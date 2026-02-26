# Desktop Agent - Time Tracking & Monitoring Implementation

**Status**: ✅ Phase 1 Complete (macOS)  
**Priority**: High  
**Technology Stack**: Tauri 2.x + Svelte + Rust  
**Last Updated**: 2026-02-24

---

## Overview

The SnappyYak Desktop Agent is a **ultra-lightweight** native cross-platform application that runs on employee workstations to collect productivity metrics and activity data. It communicates with the backend API to store time tracking data, which is then displayed in the Employer dashboard.

**Memory Usage Target**: <50MB RAM at idle and during operation

**Development Priority**: macOS first, then Windows (end of Phase 1), Linux (Phase 2)

---

## Architecture

### Technology Choice: Tauri + Svelte + TypeScript

**Why Tauri?**
- **Ultra-Low Memory**: 30-50MB idle on macOS, 50-120MB on Windows (vs Electron's 100-300MB)
- **Small Bundle Size**: ~3MB vs Electron's ~100MB
- **Security**: Sandboxed runtime with granular permissions
- **Performance**: Native Rust backend, no Chromium overhead leveraging WebKit on macOS
- **Cross-Platform**: macOS (primary), Windows, Linux support
- **Native APIs**: Direct access to OS-level features

**Why Svelte?**
- **Compile-Time Framework**: No runtime overhead, compiles to vanilla JavaScript
- **Tiny Bundle Size**: ~15KB framework overhead (vs React's ~130KB)
- **Low Memory Footprint**: No virtual DOM, direct DOM manipulation
- **Excellent TypeScript Support**: First-class TypeScript integration
- **Mature Community**: Large, active developer community for troubleshooting
- **Reactive by Default**: Efficient state management without additional libraries

**Why TypeScript?**
- **Type Safety**: Catch errors at compile time
- **Better IDE Support**: Autocompletion, refactoring, navigation
- **Self-Documenting**: Types serve as inline documentation
- **Maintainability**: Easier to maintain and scale codebase

### Application Structure

```
desktop-agent/
├── src/                      # Svelte Frontend
│   ├── app.html             # HTML shell
│   └── routes/
│       ├── +layout.svelte   # Auth guard (redirects to /auth if no JWT)
│       ├── +layout.ts       # SSR disabled (SPA mode for Tauri)
│       ├── +page.svelte     # Employee metrics dashboard view
│       └── auth/
│           └── +page.svelte # Employee login form
├── src-tauri/               # Rust Backend (Tauri)
│   ├── src/
│   │   ├── main.rs          # Binary entry point
│   │   ├── lib.rs           # App setup: state, commands, background sync task
│   │   ├── monitors/
│   │   │   ├── activity.rs  # Keyboard & mouse event counting via CGEvent (macOS)
│   │   │   └── app_usage.rs # Active app detection via NSWorkspace (macOS)
│   │   ├── storage.rs       # Local SQLite (rusqlite): metrics_cache + settings tables
│   │   └── api_client.rs    # HTTP client (reqwest/rustls): login + sync_metrics
│   └── Cargo.toml
├── vite.config.js
└── package.json
```

---

## Ultra-Low Memory Optimization Strategy

### Memory Target: <50MB RAM

**Platform Baselines**:
- macOS: 30-50MB at idle (leveraging native WebKit)
- Windows: 50-70MB at idle (WebView2)
- Linux: 60-90MB at idle (WebKitGTK)

### Frontend Optimization Techniques

#### 1. Bundle Size Minimization
```json
// vite.config.ts optimizations
export default {
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console logs
        drop_debugger: true,
        pure_funcs: ['console.log']
      }
    },
    rollupOptions: {
      output: {
        manualChunks: undefined // Prevent code splitting for minimal overhead
      }
    }
  }
}
```

#### 2. Lazy Loading & Code Splitting
- **Avoid**: Do not lazy-load core components (system tray, status indicator)
- **Lazy-load**: Settings panel, analytics dashboard (infrequently accessed)
- **Image optimization**: Compress assets, use WebP, downsample to required resolution

#### 3. Memory Leak Prevention
```typescript
// Example: Proper cleanup in Svelte components
import { onDestroy } from 'svelte';

let interval: NodeJS.Timeout;

onMount(() => {
    interval = setInterval(() => {
        // Periodic task
    }, 60000);
});

// CRITICAL: Always clean up
onDestroy(() => {
    clearInterval(interval);
});
```

#### 4. Svelte Store Optimization
```typescript
// Use writable stores sparingly, prefer derived for computed values
import { writable, derived } from 'svelte/store';

export const activitySeconds = writable(0);

// Derived stores don't create duplicate data
export const activityFormatted = derived(
    activitySeconds,
    $seconds => formatTime($seconds)
);
```

#### 5. DOM Optimization
- **No animations**: Avoid CSS transitions/animations that increase repaint costs
- **Minimal DOM**: Render only visible elements
- **Virtual scrolling**: For long lists (if needed)

### Backend (Rust) Optimization Techniques

#### 1. Memory-Efficient Data Structures
```rust
// Use arrays instead of vectors when size is known
const MAX_SESSIONS: usize = 100;
let sessions: [ActivitySession; MAX_SESSIONS];

// Use Box<str> instead of String for immutable text
let app_name: Box<str> = "VSCode".into();

// Pool objects to avoid allocations
struct SessionPool {
    pool: Vec<ActivitySession>,
    active: Vec<usize>,
}
```

#### 2. Lazy Initialization
```rust
// Only initialize heavy resources when needed
use once_cell::sync::Lazy;

static CATEGORIZER: Lazy<Categorizer> = Lazy::new(|| {
    Categorizer::load_rules()
});
```

#### 3. Offload Heavy Tasks to Rust
- **Categorization**: Run in Rust, not JavaScript
- **Image compression**: Use Rust libraries (e.g., image, webp)
- **Data aggregation**: Process in Rust before sending to frontend
- **Target**: Keep Rust backend under 10MB memory usage

#### 4. Platform-Specific Optimizations

**macOS**:
```rust
// Leverage native WebKit (minimal memory overhead)
// tauri.conf.json
{
  \"tauri\": {
    \"macOSPrivateApi\": true // Access private APIs for better performance
  }
}
```

**Windows**:
```rust
// Enable WebView2 low-memory mode
// tauri.conf.json
{
  \"tauri\": {
    \"bundle\": {
      \"windows\": {
        \"webviewInstallMode\": {
          \"type\": \"offlineCache\"
        }
      }
    }
  }
}

// Set environment variable for WebView2
std::env::set_var(\"WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS\", \"--disable-features=msWebOOUI,msPdfOOUI\");
```

**General**:
- Release resources when app is inactive (hidden/minimized)
- Pause non-critical background tasks when idle
- Compress local database periodically

---

## Core Features

### 1. Activity Monitoring

#### Keyboard & Mouse Tracking
- **Non-Intrusive**: Count key presses and mouse movements without logging content
- **Privacy-First**: No keystroke logging, only activity counts
- **Implementation**: OS-level event hooks
  - Windows: `SetWindowsHookEx`
  - macOS: `CGEvent` API
  - Linux: `XRecord` extension

#### Active Application Tracking
- **Window Detection**: Identify currently focused application
- **Title Tracking**: Capture window titles (with privacy controls)
- **Duration**: Calculate time spent in each application
- **Implementation**: Platform-specific window APIs

#### Idle Time Detection
- **Threshold**: Configurable idle timeout (default: 5 minutes)
- **Resume Detection**: Log when user becomes active again
- **Break Time**: Distinguish between idle and deliberate breaks

#### Screenshot Capture
- **Configurable Frequency**: Default every 10 minutes
- **Privacy Controls**:
  - Blur sensitive content
  - Exclude specific applications
  - Disable based on active window
- **Compression**: Efficient WebP format
- **Storage**: Local cache before upload

---

### 2. Application Categorization

#### Productivity Classification

**Categories**:
- **Productive**: Development tools, design software, communication apps
- **Unproductive**: Social media, entertainment, games
- **Neutral**: Web browsers (context-dependent), file managers
- **Administrative**: Email, calendar, project management

**Implementation**:
```rust
// Example categorization logic
pub enum ProductivityCategory {
    Productive,
    Unproductive,
    Neutral,
    Administrative,
}

pub fn categorize_application(app_name: &str, window_title: &str) -> ProductivityCategory {
    // Rule-based categorization
    match app_name.to_lowercase().as_str() {
        "vscode" | "intellij" | "xcode" => ProductivityCategory::Productive,
        "chrome" | "firefox" => categorize_browser_activity(window_title),
        "spotify" | "youtube" => ProductivityCategory::Unproductive,
        _ => ProductivityCategory::Neutral,
    }
}

fn categorize_browser_activity(title: &str) -> ProductivityCategory {
    // URL/title-based heuristics
    if title.contains("github") || title.contains("stackoverflow") {
        ProductivityCategory::Productive
    } else if title.contains("facebook") || title.contains("twitter") {
        ProductivityCategory::Unproductive
    } else {
        ProductivityCategory::Neutral
    }
}
```

**Customization**:
- Employer-defined rules
- Per-employee overrides
- Machine learning-based classification (future)

---

### 3. Data Collection & Storage

#### Local SQLite Database

**Proposed Schema**:
```sql
CREATE TABLE activity_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP,
    app_name TEXT NOT NULL,
    window_title TEXT,
    category TEXT NOT NULL,
    is_synced BOOLEAN DEFAULT 0
);

CREATE TABLE screenshots (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp TIMESTAMP NOT NULL,
    file_path TEXT NOT NULL,
    app_name TEXT,
    is_uploaded BOOLEAN DEFAULT 0
);

CREATE TABLE metrics_cache (
    date DATE PRIMARY KEY,
    work_time_minutes INTEGER,
    computer_activity_minutes INTEGER,
    productive_minutes INTEGER,
    unproductive_minutes INTEGER,
    neutral_minutes INTEGER,
    last_sync TIMESTAMP
);
```

**Implemented schema** (in `storage.rs`):
```sql
CREATE TABLE IF NOT EXISTS metrics_cache (
    date TEXT PRIMARY KEY,
    work_time_minutes INTEGER DEFAULT 0,
    computer_activity_minutes INTEGER DEFAULT 0,
    productive_minutes INTEGER DEFAULT 0,
    unproductive_minutes INTEGER DEFAULT 0,
    neutral_minutes INTEGER DEFAULT 0,
    last_sync TEXT
);

CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
);
```

**`settings` table** stores key/value pairs, primarily the `jwt_token` after a successful employee login, persisted across restarts.

**Purpose**:
- Offline resilience: metrics accumulate locally even when the backend is unreachable
- Batched uploads: the sync loop reads from this cache before pushing to the API
- Cross-restart persistence: token survives app restarts so the user stays logged in

---

### 4. Backend Synchronization

#### API Integration

**Endpoints to Consume**:

##### POST /api/employee/activity
Upload activity sessions in batches:
```typescript
interface ActivitySession {
  start_time: string;      // ISO 8601
  end_time: string;
  app_name: string;
  window_title?: string;
  category: 'productive' | 'unproductive' | 'neutral' | 'administrative';
  keyboard_count: number;
  mouse_count: number;
}

// Request
POST /api/employee/activity
Authorization: Bearer <employee_jwt>
Content-Type: application/json

{
  "sessions": [ActivitySession],
  "date": "2026-02-09"
}
```

##### POST /api/employee/screenshots
Upload screenshots:
```typescript
POST /api/employee/screenshots
Authorization: Bearer <employee_jwt>
Content-Type: multipart/form-data

{
  "screenshot": <binary>,
  "timestamp": "2026-02-09T14:30:00Z",
  "app_name": "VSCode"
}
```

##### GET /api/employee/metrics/:date
Retrieve aggregated metrics:
```typescript
GET /api/employee/metrics/2026-02-09
Authorization: Bearer <employee_jwt>

Response:
{
  "date": "2026-02-09",
  "work_time_minutes": 480,
  "computer_activity_minutes": 465,
  "productive_minutes": 380,
  "unproductive_minutes": 45,
  "neutral_minutes": 55,
  "break_time_minutes": 60
}
```

---

#### Sync Strategy

**Batch Uploads**:
- Aggregate data every 10 minutes
- Upload in batches to reduce API calls
- Retry with exponential backoff on failure

**Conflict Resolution**:
- Server timestamps are authoritative
- Local cache updated after successful sync
- Duplicate prevention via session IDs

#### Sync Strategy (Implemented)

**Batched REST API** — a background Tokio task runs inside the Tauri process:

```rust
// lib.rs — spawned on app startup
tauri::async_runtime::spawn(async move {
    let mut interval = tokio::time::interval(Duration::from_secs(60));
    loop {
        interval.tick().await;
        // 1. Drain atomic counters (keyboard + mouse) — reset to 0
        // 2. Increment SQLite metrics_cache for today's date
        // 3. POST /api/employee/metrics/sync with today's summary
        // 4. On success: stamp last_sync timestamp in SQLite
        // 5. On failure: log error, keep data in SQLite for next cycle
    }
});
```

**Why batched vs. simple REST**:
- A simple REST call fires immediately on every event (thousands/minute per user).
- Batching accumulates all events over a window, then sends **one** HTTP POST per minute per employee, drastically reducing server load and battery drain.

**Offline Resilience**:
- If the backend is unreachable, the sync call fails gracefully (`log::error!`) and data stays in SQLite.
- On the next tick the accumulated total (including the missed window) is retried automatically.

**Backend Endpoint**:
```
POST /api/employee/metrics/sync
Authorization: Bearer <employee_jwt>
Content-Type: application/json

{
  "date": "2026-02-24",
  "work_time_minutes": 23,
  "computer_activity_minutes": 23,
  "productive_minutes": 0,
  "unproductive_minutes": 0,
  "neutral_minutes": 23
}
```
The backend performs an **upsert** (insert or update) on `employee_metrics` keyed by `(user_id, date)`.

**Logging**:
- `env_logger` is initialised in `lib.rs`. Run with `RUST_LOG=info` to see sync activity in the terminal.
- `[INFO]  Activity detected: N keystrokes, M mouse movements`
- `[INFO]  Successfully synced metrics for date: YYYY-MM-DD`
- `[ERROR] Failed to sync metrics: <reason>`

---

### 5. User Interface

#### System Tray Application

**Features**:
- **Minimal UI**: Lives in system tray/menu bar
- **Status Indicator**: Shows active tracking status
- **Quick Actions**:
  - Pause/Resume tracking
  - Take manual break
  - Open detailed view
  - Settings

**Example UI States**:
```
🟢 Active - Tracking (3h 42m today)
🟡 Idle - No activity detected
🔴 Paused - Tracking disabled
⚪ Offline - No connection to backend
```

#### Settings Panel

**Configuration Options**:
- **Privacy**:
  - Enable/disable screenshot capture
  - Blur sensitive applications
  - Exclude specific windows
- **Tracking**:
  - Idle timeout duration
  - Screenshot frequency
  - Activity sensitivity
- **Account**:
  - Login/logout
  - Sync status
  - Data usage statistics

---

## Security & Privacy

### 1. Data Encryption

**In Transit**:
- TLS 1.3 for all API communication
- Certificate pinning to prevent MITM attacks

**At Rest**:
- SQLite database encrypted with SQLCipher
- Screenshots encrypted before storage
- Credentials stored in OS keychain

### 2. Privacy Controls

**Employee Transparency**:
- Clear indication when tracking is active
- Ability to pause tracking
- Access to personal activity data
- Notification before screenshot capture

**Data Minimization**:
- Only collect necessary metrics
- No keystroke logging
- No audio/video recording
- Configurable data retention

### 3. Permissions

**Required OS Permissions**:
- **Accessibility**: For window/app detection
- **Screen Recording**: For screenshots (macOS)
- **Input Monitoring**: For activity tracking (macOS)

**User Consent**:
- Explicit permission request on first launch
- Clear explanation of each permission
- Ability to revoke individual permissions

---

## Implementation Phases

### Phase 1: MVP (Core Tracking) - macOS
**Status**: ✅ Complete

**macOS Implementation**:
- [x] Tauri 2.x project setup with SvelteKit + TypeScript
- [x] Keyboard & mouse activity counting via macOS CGEvent API
- [x] Active application tracking via macOS NSWorkspace
- [x] Local SQLite storage (`storage.rs`) with `metrics_cache` and `settings` tables
- [x] API client (`api_client.rs`) using `reqwest` + `rustls-tls` (no OpenSSL)
- [x] Employee-only login via Tauri `login` command; JWT persisted in SQLite
- [x] Route guard in `+layout.svelte` redirects unauthenticated users to `/auth`
- [x] Background Tokio sync task: accumulates data, pushes to backend every 60s
- [x] `env_logger` logging for terminal monitoring of sync events
- [x] Backend `POST /api/employee/metrics/sync` endpoint with JWT auth + upsert
- [x] Employer dashboard (`/employer/employees`) displays live synced metrics
- [x] Verified memory footprint of ~40.9MB on macOS during active tracking
- [ ] System tray UI (macOS menu bar)

**Windows Development (Next)**:
- [ ] Port activity monitoring to Windows (SetWindowsHookEx)
- [ ] Active application tracking (Windows API)
- [ ] System tray UI (Windows system tray)
- [ ] WebView2 low-memory configuration
- [ ] Memory profiling: Ensure <60MB idle on Windows
- [ ] Cross-platform testing and bug fixes

**Deliverable**: Working macOS desktop agent with <50MB memory and full backend sync

### Phase 2: Enhanced Features
**Timeline**: 1-2 months

- [ ] Screenshot capture & upload
- [ ] Application categorization engine (productive / unproductive / neutral)
- [ ] Idle time detection and break time tracking
- [x] Offline mode with batched REST sync
- [ ] Linux support
- [ ] Advanced privacy controls

### Phase 3: Intelligence & Optimization
**Timeline**: 2-3 months

- [ ] Smart categorization (ML-based)
- [ ] Productivity insights & recommendations
- [ ] Auto-pause detection (meetings, breaks)
- [ ] Bandwidth optimization
- [ ] Multi-monitor support
- [ ] Advanced analytics dashboard (employee-facing)

---

## Dependencies

### Frontend (TypeScript + Svelte)
```json
{
  "dependencies": {
    "@tauri-apps/api": "^2.0.0",
    "svelte": "^4.2.8"
  },
  "devDependencies": {
    "@sveltejs/vite-plugin-svelte": "^3.0.1",
    "typescript": "^5.3.3",
    "vite": "^5.0.11",
    "terser": "^5.26.0"
  }
}
```

**Note**: Intentionally minimal dependencies. No date libraries (use native Intl), no state management libraries beyond Svelte stores, no UI component libraries.

### Backend (Rust)
```toml
[dependencies]
tauri = { version = "2.0", features = ["macos-private-api"] }
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
tokio = { version = "1.0", features = ["rt-multi-thread", "macros", "time"] }
reqwest = { version = "0.11", default-features = false, features = ["json", "rustls-tls"] }
sqlx = { version = "0.7", default-features = false, features = ["sqlite", "runtime-tokio"] }
once_cell = "1.19" # Lazy initialization

# Platform-specific (macOS primary focus)
[target.'cfg(target_os = "macos")'.dependencies]
cocoa = "0.25"
core-graphics = "0.23"
core-foundation = "0.9"

# Windows support (Phase 1, end)
[target.'cfg(target_os = "windows")'.dependencies]
windows = { version = "0.51", features = ["Win32_UI_WindowsAndMessaging", "Win32_System_Threading"] }

# Linux support (Phase 2)
[target.'cfg(target_os = "linux")'.dependencies]
x11 = "2.21"

[profile.release]
opt-level = "z"     # Optimize for size
lto = true          # Link-time optimization
codegen-units = 1   # Better optimization, slower compile
strip = true        # Remove symbols for smaller binary
```

**Optimization Notes**:
- `default-features = false` reduces unnecessary dependencies
- `rustls-tls` instead of `openssl` for smaller binary
- `opt-level = "z"` prioritizes binary size (contributes to lower memory)

---

## Installation & Distribution

### Packaging
- **Windows**: MSI installer
- **macOS**: DMG with code signing
- **Linux**: AppImage, Deb, RPM

### Auto-Update
- Integrated Tauri updater
- Silent background updates
- Rollback capability

### Deployment
- Employer-initiated installation (send download link)
- Employee onboarding flow
- Automatic authentication with temp credentials

---

## Testing Strategy

### Unit Tests
- Categorization logic
- Data aggregation algorithms
- API client retry logic

### Integration Tests
- Backend API communication
- Local database operations
- Screenshot capture pipeline

### Platform Testing
- Windows 10, 11
- macOS 12+
- Ubuntu 20.04+

### Privacy Audit
- Verify no sensitive data leakage
- Test permission revocation
- Validate encryption implementation

---

## Performance & Memory Targets

### Primary Targets (Must Achieve)
- **Memory (macOS)**: <40MB at idle, <50MB during active tracking
- **Memory (Windows)**: <60MB at idle, <70MB during active tracking  
- **Memory (Linux)**: <70MB at idle, <90MB during active tracking
- **CPU Usage**: <1% average, <5% during screenshot capture
- **Disk Space**: <200MB (app + local cache, excluding screenshots)
- **Network**: <5MB/day typical upload (excluding screenshots)
- **Battery Impact**: <3% additional drain on laptops

### Memory Profiling Tools

**macOS**:
```bash
# Activity Monitor: Memory column
# Command line:
top -pid $(pgrep -f "snappyyak-agent") -stats mem

# Instruments (Xcode): Allocations template
instruments -t Allocations -D trace.trace ~/path/to/app
```

**Windows**:
```powershell
# Task Manager: Details → Memory (Private Working Set)
# Command line:
Get-Process snappyyak-agent | Select-Object PM

# Performance Monitor: Add Counter → "Private Bytes"
```

**Frontend Heap Profiling** (Chrome DevTools):
1. Open app with DevTools
2. Memory tab → Heap snapshot
3. Compare snapshots before/after actions
4. Identify memory leaks (detached DOM, event listeners)

### Optimization Checklist

- [ ] Minimize JavaScript bundle (<200KB)
- [ ] No runtime dependencies beyond Svelte
- [ ] Lazy-load non-critical UI components
- [ ] Compress images (WebP, downsampled)
- [ ] Clear intervals/timeouts in `onDestroy`
- [ ] Use Rust for heavy processing
- [ ] Profile memory at each development milestone
- [ ] Enable WebView2 low-memory mode on Windows
- [ ] Test on low-spec machines (8GB RAM)
-

---

## Future Enhancements

1. **AI-Powered Insights**: Personalized productivity recommendations
2. **Team Collaboration**: Shared focus time, meeting detection
3. **Integrations**: Jira, GitHub, Slack activity correlation
4. **Health Monitoring**: Break reminders, posture alerts
5. **Productivity Gamification**: Achievements, streaks, challenges

---

## References

- [Tauri Documentation](https://tauri.app/)
- [Platform-Specific APIs](https://github.com/tauri-apps/tauri/tree/dev/core/tauri)
- [SQLCipher Encryption](https://www.zetetic.net/sqlcipher/)
- [Activity Monitoring Best Practices](https://www.notion.so/Time-Tracking-Privacy-Guide-example)
