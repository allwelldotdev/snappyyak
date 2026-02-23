use std::sync::atomic::Ordering;
use monitors::activity::ActivityMonitor;
use monitors::app_usage::AppUsageMonitor;

pub mod monitors;

pub struct AppState {
    pub activity: ActivityMonitor,
    pub app_usage: AppUsageMonitor,
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

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let activity = ActivityMonitor::new();
    activity.start();
    
    let app_usage = AppUsageMonitor::new();
    app_usage.start();
    
    let state = AppState {
        activity,
        app_usage,
    };

    tauri::Builder::default()
        .manage(state)
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![get_current_activity])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
