use std::sync::atomic::{AtomicU64, Ordering};
use std::sync::Arc;
use std::thread;

pub struct ActivityMonitor {
    pub keyboard_count: Arc<AtomicU64>,
    pub mouse_count: Arc<AtomicU64>,
}

impl ActivityMonitor {
    pub fn new() -> Self {
        Self {
            keyboard_count: Arc::new(AtomicU64::new(0)),
            mouse_count: Arc::new(AtomicU64::new(0)),
        }
    }

    pub fn start(&self) {
        #[cfg(target_os = "macos")]
        {
            let k_count = self.keyboard_count.clone();
            let m_count = self.mouse_count.clone();
            thread::spawn(move || {
                run_macos_event_tap(k_count, m_count);
            });
        }
    }
}

// macOS native event tap using core-graphics and core-foundation FFI
#[cfg(target_os = "macos")]
fn run_macos_event_tap(k_count: Arc<AtomicU64>, m_count: Arc<AtomicU64>) {
    use core_foundation::runloop::{CFRunLoop, CFRunLoopSource};
    use core_graphics::event::{CGEventTapLocation, CGEventTapPlacement, CGEventTapOptions, CGEventType, CGEventTap};
    
    // Using core_graphics crate
    match CGEventTap::new(
        CGEventTapLocation::HID,
        CGEventTapPlacement::HeadInsertEventTap,
        CGEventTapOptions::Default,
        vec![
            CGEventType::KeyDown,
            CGEventType::MouseMoved,
            CGEventType::LeftMouseDragged,
            CGEventType::RightMouseDragged,
        ],
        move |_proxy, event_type, event| {
            match event_type {
                CGEventType::KeyDown => {
                    k_count.fetch_add(1, Ordering::Relaxed);
                }
                CGEventType::MouseMoved | CGEventType::LeftMouseDragged | CGEventType::RightMouseDragged => {
                    m_count.fetch_add(1, Ordering::Relaxed);
                }
                _ => {}
            }
            Some(event.to_owned())
        },
    ) {
        Ok(tap) => {
            unsafe {
                let loop_source = tap.mach_port.create_runloop_source(0).expect("Cannot create runloop source");
                let run_loop = CFRunLoop::get_current();
                run_loop.add_source(&loop_source, core_foundation::runloop::kCFRunLoopCommonModes);
                tap.enable();
                CFRunLoop::run_current();
            }
        },
        Err(e) => {
            eprintln!("Failed to create CGEventTap. Ensure Accessibility permissions are granted. Error: {:?}", e);
        }
    }
}
