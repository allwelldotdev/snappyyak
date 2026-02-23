use std::sync::{Arc, Mutex};
use std::thread;
use std::time::Duration;

pub struct AppUsageMonitor {
    pub current_app: Arc<Mutex<String>>,
}

impl AppUsageMonitor {
    pub fn new() -> Self {
        Self {
            current_app: Arc::new(Mutex::new(String::new())),
        }
    }

    pub fn start(&self) {
        #[cfg(target_os = "macos")]
        {
            let current_app = self.current_app.clone();
            thread::spawn(move || {
                loop {
                    let app_name = get_active_app_macos();
                    if let Ok(mut app) = current_app.lock() {
                        if *app != app_name {
                            *app = app_name;
                        }
                    }
                    thread::sleep(Duration::from_secs(1)); // Poll every second
                }
            });
        }
    }
}

#[cfg(target_os = "macos")]
fn get_active_app_macos() -> String {
    use cocoa::base::id;
    use objc::{class, msg_send, sel, sel_impl};
    
    unsafe {
        let workspace: id = msg_send![class!(NSWorkspace), sharedWorkspace];
        let active_app: id = msg_send![workspace, frontmostApplication];
        if active_app.is_null() {
            return String::from("Unknown");
        }
        let app_name: id = msg_send![active_app, localizedName];
        if app_name.is_null() {
            return String::from("Unknown");
        }
        let utf8_str: *const std::os::raw::c_char = msg_send![app_name, UTF8String];
        if utf8_str.is_null() {
            return String::from("Unknown");
        }
        std::ffi::CStr::from_ptr(utf8_str).to_string_lossy().into_owned()
    }
}
