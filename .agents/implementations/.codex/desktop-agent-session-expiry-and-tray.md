# Desktop Agent Session Expiry, Logout, and macOS System Tray

**ExecPlan file path:** .agents/implementations/.codex/desktop-agent-session-expiry-and-tray.md

This ExecPlan is a living document. The sections `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` must be kept up to date as work proceeds.

This plan must be maintained in accordance with .agents/PLANS.md.

## Purpose / Big Picture

Employees should be able to launch the desktop agent and stay logged in for up to 24 hours, then be required to log in again. They should also be able to explicitly log out via an account/logout control in the Svelte UI, which clears stored credentials and returns them to the auth screen. On macOS, the app should also expose a system tray (menu bar) UI with basic status and actions, completing the Phase 1 checkbox in .agents/implementations/desktop_agent_time_tracking.md. After this change, a user can: launch the app to see the login screen on first run, see their prior login reused only if it is younger than 24 hours, use a Logout action to immediately clear the session, and access the app via a macOS menu bar tray with working actions.

## Progress

- [x] (2026-02-27 19:05Z) Inspect desktop-agent auth storage, login flow, and route guard in Svelte and Tauri, and document current token persistence.
- [x] (2026-02-27 19:05Z) Implement 24-hour session retention with token timestamping and expiry checks at startup and on guard evaluation.
- [x] (2026-02-27 19:15Z) Add Logout UI in the Svelte Settings panel and implement logout command to clear stored credentials and reroute to `/auth`.
- [x] (2026-02-27 19:30Z) Implement macOS system tray (menu bar) UI with status and actions, wire to existing app state, and verify behavior.
- [x] (2026-02-27 19:55Z) Update .agents/implementations/desktop_agent_time_tracking.md checkbox for System tray UI (macOS menu bar) after testing.
- [x] (2026-02-27 19:55Z) Validate end-to-end behavior and record evidence in this plan.
- [x] (2026-02-27 20:15Z) Add 24-hour session-aware logout behavior, email display, and user-prefixed logging across tracking, sync, and tray events.
- [x] (2026-02-27 20:30Z) Add app start/exit logging with suppression for tray-initiated exit; rebuild and re-check Svelte.

## Surprises & Discoveries

- Observation: None yet.
  Evidence: N/A.

## Decision Log

- Decision: Use a 24-hour session window based on a stored login timestamp (UTC epoch seconds) alongside the JWT in local SQLite settings.
  Rationale: The current implementation persists a JWT indefinitely; adding an explicit timestamp allows deterministic expiry without relying on JWT expiration claims or clock skew in the token itself.
  Date/Author: 2026-02-26 / Codex.

- Decision: Implement logout by clearing both the JWT and login timestamp in the settings table and then navigating the Svelte app to `/auth`.
  Rationale: This ensures a clean state for the next employee login and avoids UI ambiguity.
  Date/Author: 2026-02-26 / Codex.

- Decision: If a token exists without a stored login timestamp, set the timestamp to “now” and allow the session to continue for up to 24 hours.
  Rationale: This preserves existing logged-in sessions during the upgrade while still enforcing the new 24-hour expiry going forward.
  Date/Author: 2026-02-27 / Codex.

- Decision: Log app exit only for non-tray exits, and log tray quits separately.
  Rationale: Prevents duplicate exit logs while preserving visibility into non-tray exits.
  Date/Author: 2026-02-27 / Codex.

## Outcomes & Retrospective

- Completed implementation, build, and test pass for both Rust and Svelte. System tray UI verified on macOS by user confirmation. Added session-aware tracking stop/start, logout and pause/resume logging, user-email display, and user-prefixed log messages. Added app start and exit logging, with tray quit logging suppressed from app exit logs. Outstanding warnings are unrelated objc macro cfg warnings in app usage monitoring.

## Context and Orientation

The desktop agent lives under `desktop-agent/`. Its Svelte frontend is in `desktop-agent/src/`, and the Tauri backend is in `desktop-agent/src-tauri/`. The auth flow currently persists a JWT to a local SQLite `settings` table via `desktop-agent/src-tauri/src/storage.rs`, then reads it on startup to allow `desktop-agent/src/routes/+layout.svelte` to decide whether to show the login screen at `desktop-agent/src/routes/auth/+page.svelte` or the main dashboard at `desktop-agent/src/routes/+page.svelte`. The Tauri commands (implemented in `desktop-agent/src-tauri/src/lib.rs` and/or `desktop-agent/src-tauri/src/api_client.rs`) mediate login, storing the token. There is no explicit logout action today. The system tray UI feature is defined but not implemented in `.agents/implementations/desktop_agent_time_tracking.md`, in the Phase 1 macOS checklist. The development guide in `.agents/development_guide.md` defines how to run the desktop agent (`RUST_LOG=info npm run tauri dev`) and notes the backend must be running before sync behavior can be validated. There are no additional SOPs specific to the desktop agent beyond the UI guidelines already defined in `.agents/implementations/desktop_agent_time_tracking.md` “### 5. User Interface”.

A “system tray” on macOS is the menu bar status item at the top of the screen. In Tauri, this is implemented as a tray icon with a menu, and it can show a small list of actions (open window, pause tracking, logout, quit). We need to wire it to existing app state and commands in Rust and, where needed, update the Svelte UI so the actions are visible and testable.

## Plan of Work

First, inspect the current desktop agent auth flow and storage. Read `desktop-agent/src/routes/+layout.svelte` to see how the app decides whether to route to `/auth`. Read `desktop-agent/src/routes/auth/+page.svelte` to understand login interactions. Read `desktop-agent/src-tauri/src/storage.rs` to confirm how the `settings` table is used and what keys exist. Read `desktop-agent/src-tauri/src/lib.rs` and `desktop-agent/src-tauri/src/api_client.rs` to find the Tauri commands for login and token retrieval. Summarize the existing flow in the plan’s Artifacts section so future work is grounded.

Second, implement 24-hour session retention. The approach is to store a login timestamp when a login succeeds and to treat the stored JWT as valid only if `now - login_timestamp <= 24 hours`. Add a new settings key such as `jwt_login_ts` with a numeric value of UTC epoch seconds. Update the login command to write both `jwt_token` and `jwt_login_ts`. Update the token retrieval logic (or the Svelte guard) to fetch the timestamp and compare it to the current time. If expired, clear the stored token and timestamp, and make the guard route to `/auth`. Make sure this logic runs at startup so the auth page appears when the token is expired. Define “24 hours” as 86,400 seconds. Be explicit about using UTC to avoid local time zone confusion.

Third, add a logout button in the Svelte frontend, preferably within an existing settings panel or account area. Identify the Svelte component responsible for settings in `desktop-agent/src/routes/` (likely a settings route or the main dashboard view). Add a button labeled “Log out” or “Logout”, and wire it to a Tauri command that clears the credentials from the settings table. After clearing, the Svelte app should navigate to `/auth`. If no settings panel exists, add a lightweight settings panel in `desktop-agent/src/routes/+page.svelte` or a new route `desktop-agent/src/routes/settings/+page.svelte` and link it from the main view. The settings UI and logout control must follow the “### 5. User Interface” guidance in `.agents/implementations/desktop_agent_time_tracking.md`, especially the Settings Panel expectations (Account section with login/logout, minimal UI, and tray-oriented UX).

Fourth, implement the macOS system tray UI. In `desktop-agent/src-tauri/src/main.rs` (or `lib.rs` depending on current structure), add a tray icon and menu entries: “Open SnappyYak”, “Pause Tracking” (if a pause concept exists; otherwise a placeholder that logs), “Logout”, and “Quit”. Wire “Open” to show/focus the main window, “Logout” to clear credentials and emit an event to the Svelte frontend to redirect to `/auth`, and “Quit” to exit the app. If a tracking pause state does not exist, define a minimal placeholder flag in Rust that toggles and emits a status event, or omit this action and document the reasoning. The tray UI must follow the “### 5. User Interface” guidance in `.agents/implementations/desktop_agent_time_tracking.md` (minimal UI, status indicator, quick actions). Ensure the tray is only enabled for macOS (guard with `cfg(target_os = "macos")`) to avoid cross-platform build issues.

Finally, update `.agents/implementations/desktop_agent_time_tracking.md` to check the Phase 1 checkbox for “System tray UI (macOS menu bar)” after the feature is implemented and tested. Add a short note in that file about how to validate the tray on macOS (open app, see menu bar icon, use menu actions). Record evidence in this plan, then validate with local runs.

## Concrete Steps

1. Inspect current auth flow and storage:

   - From repo root:
     - `rg --files -g 'desktop-agent/src/routes/**'`
     - `rg --files -g 'desktop-agent/src-tauri/src/**'`
     - `rg "jwt|token|settings" desktop-agent/src desktop-agent/src-tauri/src`
     - Open:
       - `desktop-agent/src/routes/+layout.svelte`
       - `desktop-agent/src/routes/auth/+page.svelte`
       - `desktop-agent/src-tauri/src/storage.rs`
       - `desktop-agent/src-tauri/src/lib.rs`
       - `desktop-agent/src-tauri/src/api_client.rs`

2. Implement 24-hour session retention:

   - Update `desktop-agent/src-tauri/src/storage.rs` to support `jwt_login_ts` in the settings table. If there are helper functions for get/set, add a dedicated get/set or reuse a generic key/value method.
   - Update the login command in `desktop-agent/src-tauri/src/lib.rs` (or wherever login is handled) to set `jwt_login_ts` at successful login time using current UTC epoch seconds.
   - Update the token retrieval logic (Rust command invoked by Svelte or Svelte guard logic) to enforce the 24-hour validity check. If expired, clear both `jwt_token` and `jwt_login_ts` and return “no token”.
   - If the Svelte guard performs its own check, ensure it requests both token and timestamp and enforces expiry in a single place. Avoid duplicating the logic in multiple layers; prefer a single authoritative check in Rust commands so the Svelte code remains thin.

3. Implement logout and routing:

   - Add a Tauri command, e.g., `logout`, in `desktop-agent/src-tauri/src/lib.rs` that deletes `jwt_token` and `jwt_login_ts` from settings.
   - Add a button in the Svelte UI (Settings panel or a new settings route) that calls `invoke('logout')` and routes to `/auth` on success.
   - If using a Svelte store for auth state, reset it after logout. Ensure any background sync or metrics display does not assume a token exists after logout.

4. Implement macOS system tray UI:

   - In `desktop-agent/src-tauri/src/main.rs` or `desktop-agent/src-tauri/src/lib.rs`, create a tray icon and menu with items for open, logout, and quit. Use Tauri’s tray API and label the menu clearly.
   - Wire “Open” to show and focus the main window. Wire “Logout” to the same credential clearing logic as the logout command and emit an event to the frontend that triggers navigation to `/auth` (or restart the app state in a way that hits the guard).
   - If “Pause Tracking” is included, wire it to a stored boolean state and emit a tray menu label change or a frontend event. If not implemented, omit the item and record the decision.
   - Ensure tray functionality is compiled only on macOS by gating with `cfg(target_os = "macos")` or a runtime check, to avoid cross-platform build errors.

5. Update documentation checkbox:

   - Edit `.agents/implementations/desktop_agent_time_tracking.md` and check `[ ] System tray UI (macOS menu bar)` to `[x]` after testing. Add a short line in the Phase 1 section describing how it was tested.

6. Record evidence in this plan:

   - Add brief logs or notes in Artifacts and Surprises if any, and update Progress checkboxes with timestamps as each step completes.

## Validation and Acceptance

Behavioral acceptance criteria:

- First launch with no stored token shows the login page at `/auth`.
- Successful login stores a token and login timestamp. The app opens to the main page and stays logged in when closed and re-opened within 24 hours.
- If more than 24 hours elapse since login, the app clears credentials on startup and shows the `/auth` page.
- Clicking “Logout” in the Svelte UI clears credentials and navigates to `/auth` immediately.
- On macOS, a menu bar tray icon appears with menu items that open the app and log out (and quit). Using the tray “Logout” routes the UI to `/auth`.
- The Phase 1 checkbox for system tray UI is marked as complete in `.agents/implementations/desktop_agent_time_tracking.md`.

Suggested manual test steps:

- Ensure the backend is running first (from `backend/`, run `cargo run`). This is required for sync-related logs and API calls during the desktop agent session (per `.agents/development_guide.md`).
- Start the desktop agent in dev mode: from `desktop-agent/`, run `RUST_LOG=info npm run tauri dev`. Confirm initial routing and watch logs for sync activity.
- Log in, close the app, re-open, and verify it bypasses `/auth` within 24 hours.
- Manually set the stored `jwt_login_ts` to an older timestamp using the SQLite settings table (via a small Rust or sqlite3 command) to simulate expiry, then re-open the app and confirm it routes to `/auth`.
- Click Logout in the UI and verify the storage keys are cleared.
- Verify the menu bar icon and actions on macOS.

## Idempotence and Recovery

All changes are additive and safe to re-run. If a step fails, delete the `jwt_login_ts` and `jwt_token` keys in the settings table to return the app to a clean state. If the tray UI misbehaves, the app can be run without it by disabling the tray creation code or gating it by a feature flag during debugging.

## Artifacts and Notes

Record concise evidence here during implementation, such as:

    Settings keys after login:
      jwt_token = <redacted>
      jwt_login_ts = 1761523200

    Expiry logic result:
      now=1761609601, token_age=86401 -> expired, clearing credentials

    Tray menu:
      Open SnappyYak
      Logout
      Quit

    Manual verification:
      User confirmed macOS menu bar tray icon appears and menu items function as expected after running backend and `RUST_LOG=info npm run tauri dev`.

    Additional verification:
      Logs now include `[user_email]` prefix for activity and sync. Tray quit logs once, and non-tray exits log `App exited` once.

## Interfaces and Dependencies

Rust (Tauri backend) commands and APIs to exist after implementation:

- In `desktop-agent/src-tauri/src/lib.rs` (or `main.rs` if commands are defined there), ensure these commands exist and are exported via `tauri::command`:

    - `login(email: String, password: String) -> Result<LoginResult, String>` (existing; updated to store `jwt_login_ts` on success)
    - `get_session_token() -> Result<Option<String>, String>` (or similar; updated to enforce 24-hour expiry and clear credentials if expired)
    - `logout() -> Result<(), String>` (new; clears `jwt_token` and `jwt_login_ts`)

- In `desktop-agent/src-tauri/src/storage.rs`, ensure helper methods exist for:

    - `set_setting(key: &str, value: &str)` and `get_setting(key: &str) -> Option<String>` (existing or added)
    - If time is stored as epoch seconds, use string storage and parse into `i64` in Rust.

Svelte frontend changes:

- In `desktop-agent/src/routes/+layout.svelte`, call the session/token command and route to `/auth` if absent or expired.
- In `desktop-agent/src/routes/auth/+page.svelte`, retain the existing login form but ensure that after successful login it triggers the main route.
- Add a Logout button in the settings panel or a new settings page; call `invoke('logout')` and `goto('/auth')`.

System tray:

- Use Tauri tray APIs (tray icon + menu). For macOS only, define a tray menu with minimal status indicator text and quick actions per `.agents/implementations/desktop_agent_time_tracking.md` “### 5. User Interface”. At minimum, include “Open SnappyYak”, “Logout”, and “Quit”; include “Pause Tracking” only if a pause state is implemented. Menu items should call Rust functions that show the window or clear credentials.

---
Plan created: 2026-02-26. No implementation work has started yet.
