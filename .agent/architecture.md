# Architecture & File Structure

## Directory Structure
The project is split into two distinct applications:

```
SnappyYak-Core/
├── backend/             # Rust Application (Axum + Diesel)
│   ├── src/
│   │   ├── main.rs      # Server entry point
│   │   ├── auth.rs      # JWT & Auth middleware
│   │   ├── db.rs        # Database connection pool
│   │   ├── models.rs    # Diesel structs
│   │   ├── routes/      # Modular route handlers
│   │   │   ├── mod.rs      # Route module exports
│   │   │   ├── auth.rs     # Auth endpoints (signup, login, me)
│   │   │   ├── employer.rs # Employer endpoints (employee mgmt)
│   │   │   └── onboarding.rs # Onboarding endpoints
│   │   └── schema.rs    # Auto-generated Diesel schema
│   ├── migrations/      # SQL migrations
│   ├── Cargo.toml       # Rust dependencies
│   └── .env             # Backend secrets
├── frontend/            # Next.js Application (React)
│   ├── app/             # App Router pages
│   │   ├── auth/        # Login/Signup page
│   │   │   └── forgot-password/ # Password reset placeholder
│   │   ├── dashboard/   # Protected Dashboard (Employee view)
│   │   │   ├── layout.tsx     # Shared sidebar & navigation
│   │   │   ├── page.tsx       # Overview/Home dashboard (Employees table)
│   │   │   ├── employees/[id]/   # Employee details (nested layout)
│   │   │   │   ├── layout.tsx    # Shared header (breadcrumbs, tabs)
│   │   │   │   ├── page.tsx      # Timesheets view
│   │   │   │   ├── schedules/    # Schedules calendar
│   │   │   │   │   └── page.tsx  # Calendar grid with shifts/time-off
│   │   │   │   └── projects/     # Projects dashboard
│   │   │   │       └── page.tsx  # Stats cards and bar chart
│   │   │   ├── time/          # Time and Attendance section
│   │   │   │   ├── layout.tsx    # Shared header (title, tabs, view toggle)
│   │   │   │   ├── page.tsx      # Timesheets data table
│   │   │   │   ├── manual/       # Manual time entry
│   │   │   │   │   └── page.tsx
│   │   │   │   └── schedules/    # Team schedules
│   │   │   │       └── page.tsx
│   │   │   ├── projects/      # Projects dashboard
│   │   │   │   ├── layout.tsx    # Shared header (tabs)
│   │   │   │   ├── page.tsx      # Insightful view
│   │   │   │   └── integrated/   # Integrated view
│   │   │   │       └── page.tsx
│   │   │   ├── download/      # Download page
│   │   │   │   └── page.tsx   # OS-specific installation files
│   │   │   └── settings/      # Personal settings
│   │   │       ├── layout.tsx    # Shared header (tabs)
│   │   │       ├── page.tsx      # Redirects to info
│   │   │       ├── info/         # Password, social, 2FA
│   │   │       │   └── page.tsx
│   │   │       └── localization/ # Time zones, language
│   │   │           └── page.tsx
│   │   ├── employer/    # Employer Dashboard (Protected)
│   │   │   ├── layout.tsx     # Employer portal layout
│   │   │   └── page.tsx       # Employer dashboard home
│   │   ├── onboarding/  # Employee Onboarding (Protected)
│   │   │   ├── layout.tsx     # Onboarding layout
│   │   │   └── page.tsx       # Password setup form
│   │   ├── globals.css  # Global styles
│   │   └── layout.tsx   # Root layout with AuthProvider
│   ├── components/      # UI Components
│   │   ├── dashboard/   # Dashboard-specific (UserMenu, DateRangePicker, EmptyState)
│   │   ├── layout/      # Layout components (Navbar)
│   │   ├── providers/   # Context providers (AuthProvider, useRequireAuth)
│   │   └── ui/          # Reusable UI (Logo, Calendar, Select, Button, Popover)
│   ├── public/          # Static assets
│   ├── tailwind.config.ts # Tailwind config
│   └── package.json     # Frontend dependencies
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
  - **`/dashboard/settings`**: Personal Settings - Nested layout with tabs (Info, Localization).
    - **`/dashboard/settings/info`** (default): Password change, social accounts, 2FA.
    - **`/dashboard/settings/localization`**: Time zones, time format, language settings.

### Role-Based Authentication Routes
> **Status**: ✅ **Implemented**. See `.agent/implementations/role_based_auth_system.md` for full specification.

**Authentication & Onboarding:**
- **`/onboarding`**: Employee Onboarding - Password change form for first-time employee login (temp password → new password). Protected route for employees with `needs_onboarding: true`.

**Employer Dashboard:**
- **`/employer`**: Employer Dashboard - Protected area (requires `role: employer`). Basic dashboard with employee management placeholder.

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
- **Database**: SQLite file managed by Diesel ORM.
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
    - `POST /api/employer/employees`: Add new employee (auto-generates temp password).
    - `GET /api/employer/employees`: List all employees.
    - `GET /api/employer/employees/:id`: Get employee details.
    - `DELETE /api/employer/employees/:id`: Remove employee.
  - **Onboarding** (`routes/onboarding.rs`):
    - `POST /api/onboarding/complete`: Complete employee onboarding (verify temp password, set new password).

## Integration
- The Frontend communicates with the Backend via standard HTTP requests to `http://localhost:8080`.
- CORS is configured on the Backend to allow requests from the Frontend (`http://localhost:3000`).
