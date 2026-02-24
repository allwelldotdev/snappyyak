use std::sync::Mutex;
use std::sync::atomic::Ordering;
use tauri::Manager;
use monitors::activity::ActivityMonitor;
use monitors::app_usage::AppUsageMonitor;

pub mod monitors;
pub mod storage;
pub mod api_client;

pub struct AppState {
    pub activity: ActivityMonitor,
    pub app_usage: AppUsageMonitor,
    pub api_client: api_client::ApiClient,
    pub storage: Mutex<storage::Storage>,
}

#[derive(serde::Serialize)]
struct ActivityData {
    keyboard_count: u64,
    mouse_count: u64,
    active_app: String,
}

#[tauri::command]
fn get_current_activity(state: tauri::State<AppState>) -> ActivityData {
    let k_count = state.activity.keyboard_count.load(Ordering::Relaxed);
    let m_count = state.activity.mouse_count.load(Ordering::Relaxed);
    let app = state.app_usage.current_app.lock().unwrap().clone();
    
    ActivityData {
        keyboard_count: k_count,
        mouse_count: m_count,
        active_app: app,
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
    state.storage.lock().unwrap().set_setting("jwt_token", &token).map_err(|e: rusqlite::Error| e.to_string())?;
    Ok("Success".to_string())
}

#[tauri::command]
fn check_auth(state: tauri::State<'_, AppState>) -> bool {
    state.storage.lock().unwrap().get_setting("jwt_token").is_some()
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    env_logger::init();
    
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            let app_dir = app.path().app_data_dir().unwrap_or_else(|_| std::path::PathBuf::from("."));
            std::fs::create_dir_all(&app_dir).unwrap();
            
            let storage = storage::Storage::new(app_dir).expect("Failed to init storage");
            let api_client = api_client::ApiClient::new();
            
            if let Some(token) = storage.get_setting("jwt_token") {
                let token_clone = token.clone();
                let api_client_clone = api_client.clone();
                tauri::async_runtime::spawn(async move {
                    let mut lock = api_client_clone.token.lock().await;
                    *lock = Some(token_clone);
                });
            }

            let activity = ActivityMonitor::new();
            activity.start();
            
            let app_usage = AppUsageMonitor::new();
            app_usage.start();
            
            app.manage(AppState {
                activity,
                app_usage,
                api_client,
                storage: Mutex::new(storage),
            });
            
            let app_handle = app.handle().clone();
            tauri::async_runtime::spawn(async move {
                let mut interval = tokio::time::interval(std::time::Duration::from_secs(60));
                loop {
                    interval.tick().await;
                    
                    let state = match app_handle.try_state::<AppState>() {
                        Some(s) => s,
                        None => continue,
                    };

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
                                productive_minutes: 0,
                                unproductive_minutes: 0,
                                neutral_minutes: 0,
                                last_sync: None,
                            })
                    };
                    
                    if is_active {
                        log::info!("Activity detected: {} keystrokes, {} mouse movements", k_count, m_count);
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
                        productive_minutes: metrics.productive_minutes,
                        unproductive_minutes: metrics.unproductive_minutes,
                        neutral_minutes: metrics.neutral_minutes,
                    };
                    
                    match state.api_client.sync_metrics(&payload).await {
                        Ok(()) => {
                            log::info!("Successfully synced metrics for date: {}", payload.date);
                            let lock = state.storage.lock().unwrap();
                            let mut m = metrics;
                            m.last_sync = Some(chrono::Local::now().to_rfc3339());
                            let _ = lock.update_metrics(&m);
                        }
                        Err(e) => {
                            log::error!("Failed to sync metrics: {}", e);
                        }
                    }
                }
            });
            
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![get_current_activity, login, check_auth])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
