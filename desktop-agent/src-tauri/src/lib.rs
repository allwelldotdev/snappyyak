use std::sync::Mutex;
use std::sync::atomic::{AtomicBool, Ordering};
use std::time::Duration;
use tauri::{Emitter, Manager, RunEvent};
use monitors::activity::ActivityMonitor;
use monitors::app_usage::AppUsageMonitor;
use chrono::Utc;

pub mod monitors;
pub mod storage;
pub mod api_client;

pub struct AppState {
    pub activity: ActivityMonitor,
    pub app_usage: AppUsageMonitor,
    pub api_client: api_client::ApiClient,
    pub storage: Mutex<storage::Storage>,
    pub tracking_paused: AtomicBool,
    pub current_user_email: Mutex<Option<String>>,
    pub exiting_via_tray: AtomicBool,
}

const SESSION_TTL_SECONDS: i64 = 60 * 60 * 24;
const JWT_TOKEN_KEY: &str = "jwt_token";
const JWT_LOGIN_TS_KEY: &str = "jwt_login_ts";
const USER_EMAIL_KEY: &str = "user_email";

fn user_prefix(email: Option<&str>) -> String {
    let value = email.unwrap_or("unknown");
    format!("[{}]", value)
}

fn log_prefix_from_state(state: &AppState) -> String {
    let email = state.current_user_email.lock().unwrap().clone();
    user_prefix(email.as_deref())
}

fn reset_activity_counters(activity: &ActivityMonitor) {
    let _ = activity.keyboard_count.swap(0, Ordering::Relaxed);
    let _ = activity.mouse_count.swap(0, Ordering::Relaxed);
}

fn clear_session(storage: &storage::Storage) {
    let _ = storage.delete_setting(JWT_TOKEN_KEY);
    let _ = storage.delete_setting(JWT_LOGIN_TS_KEY);
    let _ = storage.delete_setting(USER_EMAIL_KEY);
}

fn validate_session(storage: &mut storage::Storage) -> Option<String> {
    let token = storage.get_setting(JWT_TOKEN_KEY)?;
    let now = Utc::now().timestamp();
    let ts = match storage
        .get_setting(JWT_LOGIN_TS_KEY)
        .and_then(|value| value.parse::<i64>().ok())
    {
        Some(value) => value,
        None => {
            let _ = storage.set_setting(JWT_LOGIN_TS_KEY, &now.to_string());
            now
        }
    };

    if now - ts <= SESSION_TTL_SECONDS {
        Some(token)
    } else {
        clear_session(storage);
        None
    }
}

async fn fetch_baseline_metrics_with_retry(
    state: &AppState,
    email: &str,
    date: &str,
) -> Result<api_client::SyncMetricsPayload, String> {
    const MAX_ATTEMPTS: usize = 3;
    const RETRY_DELAY_MS: u64 = 350;

    for attempt in 1..=MAX_ATTEMPTS {
        match state.api_client.get_metrics_for_date(date).await {
            Ok(metrics) => {
                log::info!(
                    "{} Baseline metrics fetched for {} on attempt {}/{} (work: {}, activity: {}, manual: {})",
                    user_prefix(Some(email.trim())),
                    date,
                    attempt,
                    MAX_ATTEMPTS,
                    metrics.work_time_minutes,
                    metrics.computer_activity_minutes,
                    metrics.manual_time_minutes
                );
                return Ok(metrics);
            }
            Err(err) => {
                log::warn!(
                    "{} Failed to fetch baseline metrics on login (attempt {}/{}): {}",
                    user_prefix(Some(email.trim())),
                    attempt,
                    MAX_ATTEMPTS,
                    err
                );
                if attempt < MAX_ATTEMPTS {
                    tokio::time::sleep(Duration::from_millis(RETRY_DELAY_MS)).await;
                }
            }
        }
    }

    Err("Unable to initialize tracking baseline. Please try again.".to_string())
}

#[derive(serde::Serialize)]
struct ActivityData {
    keyboard_count: u64,
    mouse_count: u64,
    active_app: String,
    tracking_paused: bool,
}

#[tauri::command]
fn get_current_activity(state: tauri::State<AppState>) -> ActivityData {
    let paused = state.tracking_paused.load(Ordering::Relaxed);
    let k_count = state.activity.keyboard_count.load(Ordering::Relaxed);
    let m_count = state.activity.mouse_count.load(Ordering::Relaxed);
    let app = state.app_usage.current_app.lock().unwrap().clone();
    
    ActivityData {
        keyboard_count: if paused { 0 } else { k_count },
        mouse_count: if paused { 0 } else { m_count },
        active_app: if paused { "Paused".to_string() } else { app },
        tracking_paused: paused,
    }
}

#[tauri::command]
async fn login(
    email: String,
    password: String,
    state: tauri::State<'_, AppState>,
) -> Result<String, String> {
    let token = state.api_client.login(&email, &password).await?;
    // Save token to local DB
    let now = Utc::now().timestamp().to_string();
    let today = chrono::Local::now().date_naive().to_string();
    let baseline = match fetch_baseline_metrics_with_retry(&state, &email, &today).await {
        Ok(metrics) => metrics,
        Err(err) => {
            let mut lock = state.api_client.token.lock().await;
            *lock = None;
            state.tracking_paused.store(true, Ordering::Relaxed);
            reset_activity_counters(&state.activity);
            return Err(err);
        }
    };

    let storage = state.storage.lock().unwrap();
    storage
        .clear_metrics_cache()
        .map_err(|e: rusqlite::Error| e.to_string())?;
    let baseline_metrics = storage::MetricsCache {
        date: baseline.date,
        work_time_minutes: baseline.work_time_minutes,
        computer_activity_minutes: baseline.computer_activity_minutes,
        manual_time_minutes: baseline.manual_time_minutes,
        productive_minutes: baseline.productive_minutes,
        unproductive_minutes: baseline.unproductive_minutes,
        neutral_minutes: baseline.neutral_minutes,
        last_sync: None,
    };
    storage
        .update_metrics(&baseline_metrics)
        .map_err(|e: rusqlite::Error| e.to_string())?;
    storage.set_setting(JWT_TOKEN_KEY, &token).map_err(|e: rusqlite::Error| e.to_string())?;
    storage.set_setting(JWT_LOGIN_TS_KEY, &now).map_err(|e: rusqlite::Error| e.to_string())?;
    storage.set_setting(USER_EMAIL_KEY, email.trim()).map_err(|e: rusqlite::Error| e.to_string())?;
    {
        let mut email_lock = state.current_user_email.lock().unwrap();
        *email_lock = Some(email.trim().to_string());
    }
    state.tracking_paused.store(false, Ordering::Relaxed);
    reset_activity_counters(&state.activity);
    log::info!("{} Logged in", user_prefix(Some(email.trim())));
    Ok("Success".to_string())
}

#[tauri::command]
async fn check_auth(state: tauri::State<'_, AppState>) -> Result<bool, String> {
    let token = {
        let mut storage = state.storage.lock().unwrap();
        validate_session(&mut storage)
    };

    let mut lock = state.api_client.token.lock().await;
    *lock = token.clone();
    if token.is_none() {
        state.tracking_paused.store(true, Ordering::Relaxed);
        reset_activity_counters(&state.activity);
        let mut email_lock = state.current_user_email.lock().unwrap();
        *email_lock = None;
    } else {
        if let Some(email) = state.storage.lock().unwrap().get_setting(USER_EMAIL_KEY) {
            let mut email_lock = state.current_user_email.lock().unwrap();
            *email_lock = Some(email);
        }
    }
    Ok(token.is_some())
}

#[tauri::command]
async fn logout(state: tauri::State<'_, AppState>) -> Result<(), String> {
    let email = {
        let email_lock = state.current_user_email.lock().unwrap();
        email_lock.clone()
    };
    {
        let storage = state.storage.lock().unwrap();
        clear_session(&storage);
    }
    let mut lock = state.api_client.token.lock().await;
    *lock = None;
    state.tracking_paused.store(true, Ordering::Relaxed);
    reset_activity_counters(&state.activity);
    {
        let mut email_lock = state.current_user_email.lock().unwrap();
        *email_lock = None;
    }
    log::info!("{} Logged out", user_prefix(email.as_deref()));
    Ok(())
}

#[tauri::command]
fn get_account_email(state: tauri::State<'_, AppState>) -> Option<String> {
    state.storage.lock().unwrap().get_setting(USER_EMAIL_KEY)
}

#[tauri::command]
async fn add_manual_time(
    date: String,
    hours: i32,
    minutes: i32,
    state: tauri::State<'_, AppState>,
) -> Result<(), String> {
    if hours < 0 || minutes < 0 {
        return Err("Hours and minutes must be non-negative".to_string());
    }

    let total_minutes = hours.saturating_mul(60).saturating_add(minutes);
    if total_minutes == 0 {
        return Err("Manual time must be greater than 0".to_string());
    }

    let mut metrics = {
        let lock = state.storage.lock().unwrap();
        lock.get_metrics_for_date(&date)
            .map_err(|e| e.to_string())?
            .unwrap_or(storage::MetricsCache {
                date: date.clone(),
                work_time_minutes: 0,
                computer_activity_minutes: 0,
                manual_time_minutes: 0,
                productive_minutes: 0,
                unproductive_minutes: 0,
                neutral_minutes: 0,
                last_sync: None,
            })
    };

    metrics.work_time_minutes += total_minutes;
    metrics.computer_activity_minutes += total_minutes;
    metrics.manual_time_minutes += total_minutes;

    {
        let lock = state.storage.lock().unwrap();
        lock.update_metrics(&metrics).map_err(|e| e.to_string())?;
    }

    let payload = api_client::SyncMetricsPayload {
        date: metrics.date.clone(),
        work_time_minutes: metrics.work_time_minutes,
        computer_activity_minutes: metrics.computer_activity_minutes,
        manual_time_minutes: metrics.manual_time_minutes,
        productive_minutes: metrics.productive_minutes,
        unproductive_minutes: metrics.unproductive_minutes,
        neutral_minutes: metrics.neutral_minutes,
    };

    let email = state.current_user_email.lock().unwrap().clone();
    match state.api_client.sync_metrics(&payload).await {
        Ok(()) => {
            log::info!(
                "{} Manual time added ({}h {}m) for {}",
                user_prefix(email.as_deref()),
                hours,
                minutes,
                metrics.date
            );
        }
        Err(e) => {
            log::error!(
                "{} Manual time sync failed: {}",
                user_prefix(email.as_deref()),
                e
            );
        }
    }

    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    env_logger::init();
    
    let app = tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            let app_dir = app.path().app_data_dir().unwrap_or_else(|_| std::path::PathBuf::from("."));
            std::fs::create_dir_all(&app_dir).unwrap();
            
            let storage = storage::Storage::new(app_dir).expect("Failed to init storage");
            let api_client = api_client::ApiClient::new();

            let activity = ActivityMonitor::new();
            activity.start();
            
            let app_usage = AppUsageMonitor::new();
            app_usage.start();
            
            app.manage(AppState {
                activity,
                app_usage,
                api_client,
                storage: Mutex::new(storage),
                tracking_paused: AtomicBool::new(false),
                current_user_email: Mutex::new(None),
                exiting_via_tray: AtomicBool::new(false),
            });

            let state = app.state::<AppState>();
            let valid_token = {
                let mut storage = state.storage.lock().unwrap();
                validate_session(&mut storage)
            };
            if let Some(token) = valid_token {
                if let Some(email) = state.storage.lock().unwrap().get_setting(USER_EMAIL_KEY) {
                    let mut email_lock = state.current_user_email.lock().unwrap();
                    *email_lock = Some(email);
                }
                let token_clone = token.clone();
                let api_client_clone = state.api_client.clone();
                tauri::async_runtime::spawn(async move {
                    let mut lock = api_client_clone.token.lock().await;
                    *lock = Some(token_clone);
                });
            } else {
                state.tracking_paused.store(true, Ordering::Relaxed);
            }
            log::info!("{} App started", log_prefix_from_state(&state));

            #[cfg(target_os = "macos")]
            {
                use tauri::image::Image;
                use tauri::menu::{Menu, MenuItemBuilder};
                use tauri::tray::TrayIconBuilder;

                let status_item = MenuItemBuilder::with_id("status", "Status: Active - Tracking")
                    .enabled(false)
                    .build(app)?;
                let open_item = MenuItemBuilder::with_id("open", "Open SnappyYak")
                    .build(app)?;
                let pause_item = MenuItemBuilder::with_id("toggle_pause", "Pause Tracking")
                    .build(app)?;
                let manual_time_item = MenuItemBuilder::with_id("manual_time", "Add Manual Time")
                    .build(app)?;
                let settings_item = MenuItemBuilder::with_id("settings", "Settings")
                    .build(app)?;
                let logout_item = MenuItemBuilder::with_id("logout", "Logout")
                    .build(app)?;
                let quit_item = MenuItemBuilder::with_id("quit", "Quit")
                    .build(app)?;

                let tray_menu = Menu::with_items(
                    app,
                    &[
                        &status_item,
                        &open_item,
                        &pause_item,
                        &manual_time_item,
                        &settings_item,
                        &logout_item,
                        &quit_item,
                    ],
                )?;

                let icon = Image::from_bytes(include_bytes!("../icons/icon.png"))
                    .expect("Failed to load tray icon");

                let status_item_handle = status_item.clone();
                let pause_item_handle = pause_item.clone();

                TrayIconBuilder::new()
                    .icon(icon)
                    .tooltip("SnappyYak Agent")
                    .menu(&tray_menu)
                    .on_menu_event(move |app: &tauri::AppHandle, event: tauri::menu::MenuEvent| match event.id().as_ref() {
                        "open" => {
                            if let Some(window) = app.get_webview_window("main") {
                                let _ = window.show();
                                let _ = window.set_focus();
                            }
                        }
                        "toggle_pause" => {
                            if let Some(state) = app.try_state::<AppState>() {
                                let currently_paused = state.tracking_paused.load(Ordering::Relaxed);
                                let new_paused = !currently_paused;
                                state.tracking_paused.store(new_paused, Ordering::Relaxed);

                                let status_text = if new_paused {
                                    "Status: Paused - Tracking"
                                } else {
                                    "Status: Active - Tracking"
                                };
                                let pause_text = if new_paused {
                                    "Resume Tracking"
                                } else {
                                    "Pause Tracking"
                                };

                                let _ = status_item_handle.set_text(status_text);
                                let _ = pause_item_handle.set_text(pause_text);

                                let email = state.current_user_email.lock().unwrap().clone();
                                if new_paused {
                                    log::info!(
                                        "{} Tracking paused via system tray",
                                        user_prefix(email.as_deref())
                                    );
                                } else {
                                    log::info!(
                                        "{} Tracking resumed via system tray",
                                        user_prefix(email.as_deref())
                                    );
                                }
                            }
                        }
                        "manual_time" => {
                            let _ = app.emit("navigate:manual_time", ());
                            if let Some(window) = app.get_webview_window("main") {
                                let _ = window.show();
                                let _ = window.set_focus();
                            }
                        }
                        "settings" => {
                            let _ = app.emit("navigate:settings", ());
                            if let Some(window) = app.get_webview_window("main") {
                                let _ = window.show();
                                let _ = window.set_focus();
                            }
                        }
                        "logout" => {
                            if let Some(state) = app.try_state::<AppState>() {
                                let email = state.current_user_email.lock().unwrap().clone();
                                let storage = state.storage.lock().unwrap();
                                clear_session(&storage);
                                state.tracking_paused.store(true, Ordering::Relaxed);
                                reset_activity_counters(&state.activity);
                                {
                                    let mut email_lock = state.current_user_email.lock().unwrap();
                                    *email_lock = None;
                                }
                                log::info!(
                                    "{} Logged out via system tray",
                                    user_prefix(email.as_deref())
                                );
                            }
                            let app_handle = app.clone();
                            tauri::async_runtime::spawn(async move {
                                if let Some(state) = app_handle.try_state::<AppState>() {
                                    let mut lock = state.api_client.token.lock().await;
                                    *lock = None;
                                }
                            });
                            let _ = app.emit("auth:logout", ());
                            if let Some(window) = app.get_webview_window("main") {
                                let _ = window.show();
                                let _ = window.set_focus();
                            }
                        }
                        "quit" => {
                            if let Some(state) = app.try_state::<AppState>() {
                                state.exiting_via_tray.store(true, Ordering::Relaxed);
                                log::info!("{} App quitting via tray", log_prefix_from_state(&state));
                            }
                            app.exit(0);
                        }
                        _ => {}
                    })
                    .build(app)?;
            }
            
            let app_handle = app.handle().clone();
            tauri::async_runtime::spawn(async move {
                let mut interval = tokio::time::interval(std::time::Duration::from_secs(60));
                loop {
                    interval.tick().await;
                    
                    let state = match app_handle.try_state::<AppState>() {
                        Some(s) => s,
                        None => continue,
                    };

                    if state.tracking_paused.load(Ordering::Relaxed) {
                        reset_activity_counters(&state.activity);
                        continue;
                    }

                    let k_count = state.activity.keyboard_count.swap(0, Ordering::Relaxed);
                    let m_count = state.activity.mouse_count.swap(0, Ordering::Relaxed);
                    
                    let is_active = k_count > 0 || m_count > 0;
                    let today = chrono::Local::now().date_naive().to_string();
                    
                    let mut metrics = {
                        let lock = state.storage.lock().unwrap();
                        lock.get_metrics_for_date(&today).unwrap_or(None)
                            .unwrap_or(storage::MetricsCache {
                                date: today.clone(),
                                work_time_minutes: 0,
                                computer_activity_minutes: 0,
                                manual_time_minutes: 0,
                                productive_minutes: 0,
                                unproductive_minutes: 0,
                                neutral_minutes: 0,
                                last_sync: None,
                            })
                    };
                    
                    if is_active {
                        let email = state.current_user_email.lock().unwrap().clone();
                        log::info!(
                            "{} Activity detected: {} keystrokes, {} mouse movements",
                            user_prefix(email.as_deref()),
                            k_count,
                            m_count
                        );
                        metrics.computer_activity_minutes += 1;
                        metrics.work_time_minutes += 1;
                        metrics.neutral_minutes += 1;
                    }
                    
                    {
                        let lock = state.storage.lock().unwrap();
                        let _ = lock.update_metrics(&metrics);
                    }
                    
                    let payload = api_client::SyncMetricsPayload {
                        date: metrics.date.clone(),
                        work_time_minutes: metrics.work_time_minutes,
                        computer_activity_minutes: metrics.computer_activity_minutes,
                        manual_time_minutes: metrics.manual_time_minutes,
                        productive_minutes: metrics.productive_minutes,
                        unproductive_minutes: metrics.unproductive_minutes,
                        neutral_minutes: metrics.neutral_minutes,
                    };
                    
                    match state.api_client.sync_metrics(&payload).await {
                        Ok(()) => {
                            let email = state.current_user_email.lock().unwrap().clone();
                            log::info!(
                                "{} Successfully synced metrics for date: {}",
                                user_prefix(email.as_deref()),
                                payload.date
                            );
                            let lock = state.storage.lock().unwrap();
                            let mut m = metrics;
                            m.last_sync = Some(chrono::Local::now().to_rfc3339());
                            let _ = lock.update_metrics(&m);
                        }
                        Err(e) => {
                            let email = state.current_user_email.lock().unwrap().clone();
                            log::error!(
                                "{} Failed to sync metrics: {}",
                                user_prefix(email.as_deref()),
                                e
                            );
                        }
                    }
                }
            });
            
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![get_current_activity, login, check_auth, logout, get_account_email, add_manual_time])
        .build(tauri::generate_context!())
        .expect("error while building tauri application");

    app.run(|app_handle, event| {
        if let RunEvent::Exit { .. } = event {
            if let Some(state) = app_handle.try_state::<AppState>() {
                let exit_via_tray = state.exiting_via_tray.load(Ordering::Relaxed);
                if !exit_via_tray {
                    log::info!("{} App exited", log_prefix_from_state(&state));
                }
                state.exiting_via_tray.store(false, Ordering::Relaxed);
            }
        }
    });
}
