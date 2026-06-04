# Desktop Agent Operations Guide

## Context
This SOP covers the SnappyYak Desktop Agent (Tauri + Svelte) behaviors that are distinct from the web app: login gating, local session storage, metrics cache, system tray actions, and manual time. Use this when modifying desktop-agent auth, onboarding, sync, tray UI, or local SQLite behavior.

## Core Behavior Rules

### 1. Session & Login Guardrails
- Desktop agent is **employee-only**. Employer logins are rejected in the client with a friendly message.
- Employees must have at least one **non-deactivated** employer relationship to login or complete onboarding.
- Session retention is capped at 24 hours (stored as `jwt_login_ts` in local settings).
- Logout clears token, timestamp, and stored email and pauses tracking.

### 2. Metrics Cache Hygiene
- Local metrics are stored in SQLite `metrics_cache` and must **not** leak across users.
- On successful login, clear `metrics_cache` and seed a zeroed baseline row for today.
- When tracking is paused (manual pause or unauthenticated), counters are reset and **no sync** occurs.

### 3. Sync Eligibility
- Desktop agent syncs metrics via `POST /api/employee/metrics/sync`.
- Backend accepts sync only if the employee has **at least one active relationship**.
- Employer dashboards read metrics only for **active** relationships.

### 4. System Tray Actions (macOS)
- Tray provides: Open, Pause/Resume, Add Manual Time, Settings, Logout, Quit.
- Tray “Quit” logs once and should not duplicate “App exited” logs.
- All logs must be prefixed with `[<current_user_email>]`.

### 5. Manual Time
- Manual time adds hours/minutes to **work_time**, **computer_activity**, and **manual_time**.
- Manual time is stored locally then synced immediately; failures log but do not crash the app.

## Known Local Storage Keys
- `jwt_token`
- `jwt_login_ts`
- `user_email`

## Validation Checklist
- Login with an employee: metrics cache clears, new baseline row created.
- Login with employer: blocked with message.
- Deactivated-only employee: login + onboarding blocked with message.
- Tray pause/resume logs; tracking stops/resumes.
- Manual time appears in sync payload and doesn’t affect other users.

## Implementation Pointers
- Rust: `desktop-agent/src-tauri/src/lib.rs`, `storage.rs`, `api_client.rs`
- Svelte: `desktop-agent/src/routes/+layout.svelte`, `/auth/+page.svelte`, `/settings/+page.svelte`
- Backend: `backend/src/routes/auth.rs`, `backend/src/routes/onboarding.rs`, `backend/src/routes/employee.rs`
