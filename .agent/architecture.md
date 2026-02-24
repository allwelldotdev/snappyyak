# Architecture & File Structure

## Directory Structure
The project has three components: the Rust/Axum backend, the Next.js web dashboard, and the Tauri/Svelte desktop agent.

```
SnappyYak-Core/
├── backend/             # Rust Application (Axum + Diesel + SQLite)
│   ├── src/
│   │   ├── main.rs      # Server entry point
│   │   ├── auth.rs      # JWT & Auth middleware
│   │   ├── db.rs        # Database connection pool
│   │   ├── models.rs    # Diesel structs (User, EmployerEmployee, EmployeeMetric, ...)
│   │   ├── routes/
│   │   │   ├── auth.rs       # Auth endpoints
│   │   │   ├── employer.rs   # Employer endpoints (employee mgmt + metrics aggregation)
│   │   │   ├── employee.rs   # Employee endpoints (metrics sync)
│   │   │   └── onboarding.rs # Onboarding endpoints
│   │   └── schema.rs    # Auto-generated Diesel schema
│   ├── migrations/      # SQL migrations
│   ├── Cargo.toml
│   └── .env
├── frontend/            # Next.js 16 App Router (React 19, Tailwind, Shadcn)
│   ├── app/
│   │   ├── auth/
│   │   ├── dashboard/   # Employee-facing pages
│   │   ├── employer/    # Employer-facing pages (employees, alerts, etc.)
│   │   ├── onboarding/
│   │   └── settings/
│   ├── components/
│   │   ├── dashboard/
│   │   ├── employer/
│   │   ├── providers/   # AuthProvider, useRequireAuth
│   │   └── ui/
│   └── package.json
├── desktop-agent/       # Tauri 2.x + Svelte macOS Desktop App
│   ├── src/             # Svelte frontend (SPA mode)
│   │   └── routes/
│   │       ├── +layout.svelte   # Auth guard
│   │       ├── +layout.ts       # SSR disabled
│   │       ├── +page.svelte     # Metrics dashboard
│   │       └── auth/
│   │           └── +page.svelte # Employee login form
│   ├── src-tauri/       # Rust/Tauri backend
│   │   └── src/
│   │       ├── lib.rs           # AppState, Tauri commands, background sync loop
│   │       ├── storage.rs       # Local SQLite (rusqlite)
│   │       ├── api_client.rs    # reqwest HTTP client
│   │       └── monitors/
│   │           ├── activity.rs  # CGEvent keyboard/mouse counting
│   │           └── app_usage.rs # NSWorkspace app tracking
│   └── package.json
└── legacy_vite_app/     # Archived Hono/Vite codebase
```

## Routing Strategy
The application uses **Next.js App Router** for client-side routing.

### Current Routes (Employee Dashboard)
- **`/`**: Home Page - The main landing page.
- **`/auth`**: Authentication Page - For user login/signup (handles `?mode=login|signup`).
- **`/auth/forgot-password`**: Forgot Password Placeholder - Simple email input UI for future reset flow.
- **`/dashboard`**: Employee Dashboard - Protected area (requires valid JWT). Shows employees table.
  - **`/dashboard/employees/[id]`**: Employee Details - Nested layout with shared header and tabs.
    - **`/dashboard/employees/[id]`** (default): Timesheets view with data table.
    - **`/dashboard/employees/[id]/schedules`**: Schedules calendar with grid layout.
    - **`/dashboard/employees/[id]/projects`**: Projects dashboard with stats and bar chart.
  - **`/dashboard/projects`**: Projects Dashboard - Tabbed interface.
    - **`/dashboard/projects`** (default): "Insightful" view with projects table.
    - **`/dashboard/projects/integrated`**: "Integrated" view with empty state.
  - **`/dashboard/time`**: Time and Attendance - Nested layout with tabs (Timesheets, Manual Time, Schedules).
    - **`/dashboard/time`** (default): Timesheets data table with filtering controls.
    - **`/dashboard/time/manual`**: Manual time entry page.
    - **`/dashboard/time/schedules`**: Team schedules with sticky headers.
  - **`/dashboard/download`**: Download Page - OS-specific installation file downloads (Windows, macOS, Linux).

### Role-Based Authentication Routes
> **Status**: ✅ **Implemented**. See `.agent/implementations/role_based_auth_system.md` for full specification.

**Authentication & Onboarding:**
- **`/onboarding`**: Employee Onboarding - Password change form for first-time employee login (temp password → new password). Protected route for employees with `needs_onboarding: true`.

**Shared Routes:**
- **`/settings`**: Personal Settings - Role-aware route that wraps in appropriate layout (Employer/Employee).
  - **`/settings/info`** (default): Password change, social accounts, 2FA.
  - **`/settings/localization`**: Time zones, time format, language settings.

**Employer Dashboard:**
- **`/employer`**: Employer Dashboard - Protected area (requires `role: employer`). Basic dashboard with employee management placeholder.
- **`/employer/employees`**: Employees Management - Tabbed interface with status-based views.
  - **`/employer/employees`** (default): Active employees list with metrics.
  - **`/employer/employees/pending`**: Pending employees awaiting onboarding.
  - **`/employer/employees/deactivated`**: Deactivated employees archive.
  - **`/employer/employees/add`**: Add new employee form.
- **`/employer/alerts`**: Alerts Dashboard - Nested layout with tabs (Overview, Logs).
  - **`/employer/alerts`** (default): Overview page with date controls, filters, and empty state.
  - **`/employer/alerts/logs`**: Logs page displaying alert history with controls and empty state.

**Role-Based Routing Logic:**
- After login, users are routed based on JWT claims:
  - `role: employer` → `/employer`
  - `role: employee` + `needs_onboarding: true` → `/onboarding` (first-time)
  - `role: employee` + `needs_onboarding: false` → `/dashboard` (returning)
- Route protection enforced via `useRequireAuth` hook.

## Design System Implementation
Styles are managed via **Tailwind CSS** with advanced accessible components provided by **Shadcn UI** (Radix-based).

- **UI Components**: Reusable components like `Popover`, `Tooltip`, and `Button` are located in `frontend/components/ui/`, following the Shadcn pattern.
- **Configuration**: `frontend/tailwind.config.ts` defines design tokens (colors, fonts, radii).
- **Fonts**: 
  - `Instrument Sans` (Google Fonts) for headings.
  - `Satoshi` (Fontshare) for body text.
  - `Satoshi` (Fontshare) for UI elements.
- **Global Styles**: `frontend/app/globals.css` imports external fonts and sets base styles.

## Backend Architecture
The backend is a standalone **Rust** application using the **Axum** framework.

- **Server**: Runs on port `8080`.
- **Database**: SQLite file managed by Diesel ORM with many-to-many relationships.
  - **Core Tables**: `users`, `employer_employees` (junction), `employee_metrics`
  - **Relationship Model**: Employers and employees linked via `employer_employees` junction table with status tracking.
- **Authentication**: 
  - JWT (JSON Web Tokens) for stateless sessions.
  - `Argon2id` for password hashing.
- **API Routes**:
  - **Authentication** (`routes/auth.rs`):
    - `POST /api/auth/signup`: Create employer account.
    - `POST /api/auth/login`: Authenticate user (supports password or temp_password).
    - `GET /api/auth/me`: Validate session token (returns role and onboarding status).
    - `POST /api/auth/change-password`: Update user password (requires valid JWT).
  - **Employee Management** (`routes/employer.rs`):
    - `POST /api/employer/employees`: Add new employee with junction table relationship (auto-generates temp password).
    - `GET /api/employer/employees?status={active|pending|deactivated}`: List employees filtered by relationship status.
    - `GET /api/employer/employees/:id`: Get employee details.
    - `PATCH /api/employer/employees/:id/status`: Update employee relationship status (e.g., deactivate).
    - `DELETE /api/employer/employees/:id`: Remove employee relationship.
  - **Onboarding** (`routes/onboarding.rs`):
    - `POST /api/onboarding/complete`: Complete employee onboarding (verify temp password, set new password, update junction status to 'active').
  - **Employee Sync** (`routes/employee.rs`):
    - `POST /api/employee/metrics/sync`: Upsert today's aggregated metrics for the authenticated employee. Requires `role: employee` JWT. Performs `INSERT OR REPLACE` on `employee_metrics`.

## Integration
- The Frontend and Desktop Agent communicate with the Backend via HTTP to `http://localhost:8080`.
- CORS is configured on the Backend to allow requests from the Frontend (`http://localhost:3000`).
- The Desktop Agent syncs metrics every 60 seconds via a background Tokio task. Offline data is buffered in local SQLite and retried on the next tick.
- The Employer Dashboard (`GET /api/employer/employees`) joins `employee_metrics` for today's date and formats per-employee minutes as `HH:MM` strings for display.
