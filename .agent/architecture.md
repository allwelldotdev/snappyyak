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
│   │   ├── dashboard/   # Protected Dashboard
│   │   │   ├── layout.tsx     # Shared sidebar & navigation
│   │   │   ├── page.tsx       # Overview/Home dashboard
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
- **`/dashboard`**: User Dashboard - Protected area (requires valid JWT).
  - **`/dashboard/settings`**: Personal Settings - Password change, social accounts, 2FA.

## Design System Implementation
Styles are centrally managed via **Tailwind CSS**.

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
