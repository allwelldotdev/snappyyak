# Architecture & File Structure

## Directory Structure

```
homepage_build/
├── src/
│   ├── assets/          # Static assets (images, svg, etc.)
│   ├── components/      # Reusable UI components
│   ├── contexts/        # React Context providers (AuthContext)
│   ├── pages/           # Route components (Home, Auth, Dashboard)
│   ├── server/          # Backend code (Hono app)
│   │   ├── db/          # Database schema and client
│   │   └── index.ts     # API routes
│   ├── utils/           # Helper functions and utilities
│   ├── App.tsx          # Main application component & Routing definitions
│   ├── main.tsx         # Application entry point
│   └── index.css        # Global styles & Tailwind directives
├── public/              # Publicly accessible files
├── index.html           # HTML entry point
├── package.json         # Dependencies and scripts
├── drizzle.config.ts    # Drizzle ORM configuration
├── sqlite.db            # SQLite database (gitignored)
├── tailwind.config.js   # Tailwind CSS configuration
├── tsconfig.json        # TypeScript configuration
└── vite.config.ts       # Vite configuration (includes Hono plugin)
```

## Routing Strategy
The application uses **React Router DOM v7** for client-side routing.

- **`/`**: Home Page - The main landing page.
- **`/auth`**: Authentication Page - For user login/signup.
- **`/dashboard`**: User Dashboard - Protected area (requires authentication).
- **`/api/*`**: Backend API routes (handled by Hono server).

Routing is defined in `src/App.tsx`. Protected routes use the `ProtectedRoute` component wrapper.

## Design System Implementation
Styles are centrally managed via **Tailwind CSS**.

- **Configuration**: `tailwind.config.js` defines the project's design tokens (colors, fonts, border radius).
- **Global Styles**: `src/index.css` contains the `@tailwind` directives and any global CSS resets.
- **Component Styling**: Utility classes are used directly in components. Complex logic can use `clsx` and `tailwind-merge`.

## Backend Architecture
The backend runs **within the Vite dev server** using `@hono/vite-dev-server`.

- **Entry Point**: `src/server/index.ts` - Hono app with `/api` base path
- **Database**: SQLite file (`sqlite.db`) managed by Drizzle ORM
- **Schema**: Defined in `src/server/db/schema.ts`
- **Routes**:
  - `POST /api/auth/signup` - User registration
  - `POST /api/auth/login` - User authentication
  - `GET /api/auth/me` - Session verification

## Entry Point
- `index.html`: The mounting point for the React app.
- `src/main.tsx`: Bootstraps the React app and wraps it with `BrowserRouter` and `AuthProvider`.
