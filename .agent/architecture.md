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
│   │   ├── routes.rs    # API Handlers
│   │   └── schema.rs    # Auto-generated Diesel schema
│   ├── migrations/      # SQL migrations
│   ├── Cargo.toml       # Rust dependencies
│   └── .env             # Backend secrets
├── frontend/            # Next.js Application (React)
│   ├── app/             # App Router pages
│   │   ├── auth/        # Login/Signup page
│   │   │   └── forgot-password/ # Password reset placeholder
│   │   ├── dashboard/   # Protected Dashboard
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
│   │   │   │   └── page.tsx      # Timesheets data table
│   │   │   └── settings/      # Personal settings page
│   │   ├── globals.css  # Global styles
│   │   └── layout.tsx   # Root layout with AuthProvider
│   ├── components/      # UI Components
│   │   ├── dashboard/   # Dashboard-specific components (UserMenu)
│   │   ├── layout/      # Layout components (Navbar)
│   │   ├── providers/   # Context providers (AuthProvider)
│   │   └── ui/          # Reusable UI components (Logo)
│   ├── public/          # Static assets
│   ├── tailwind.config.ts # Tailwind config
│   └── package.json     # Frontend dependencies
└── legacy_vite_app/     # Archived Hono/Vite codebase
```

## Routing Strategy
The application uses **Next.js App Router** for client-side routing.

- **`/`**: Home Page - The main landing page.
- **`/auth`**: Authentication Page - For user login/signup (handles `?mode=login|signup`).
- **`/auth/forgot-password`**: Forgot Password Placeholder - Simple email input UI for future reset flow.
- **`/dashboard`**: User Dashboard - Protected area (requires valid JWT). Shows employees table.
  - **`/dashboard/employees/[id]`**: Employee Details - Nested layout with shared header and tabs.
    - **`/dashboard/employees/[id]`** (default): Timesheets view with data table.
    - **`/dashboard/employees/[id]/schedules`**: Schedules calendar with grid layout.
    - **`/dashboard/employees/[id]/projects`**: Projects dashboard with stats and bar chart.
  - **`/dashboard/projects`**: Projects Dashboard - Tabbed interface.
    - **`/dashboard/projects`** (default): "Insightful" view with projects table.
    - **`/dashboard/projects/integrated`**: "Integrated" view with empty state.
  - **`/dashboard/time`**: Time and Attendance - Nested layout with tabs (Timesheets, Manual Time, Schedules).
    - **`/dashboard/time`** (default): Timesheets data table with filtering controls.
  - **`/dashboard/settings`**: Personal Settings - Password change, social accounts, 2FA.

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
  - `POST /api/auth/signup`: Create user.
  - `POST /api/auth/login`: Authenticate user.
  - `GET /api/auth/me`: Validate session token.
  - `POST /api/auth/change-password`: Update user password (requires valid JWT).

## Integration
- The Frontend communicates with the Backend via standard HTTP requests to `http://localhost:8080`.
- CORS is configured on the Backend to allow requests from the Frontend (`http://localhost:3000`).
