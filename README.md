# SnappyYak Web - Homepage & Auth Implementation

This project is a high-performance web application built with **React**, **Vite**, and **Tailwind CSS**, featuring a full-stack local development environment with a **Hono** backend and **SQLite/Drizzle ORM** for authentication.

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/)

### Installation
1. Navigate to the project directory:
   ```bash
   cd files/homepage_build
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the App Locally
Start the development server:
```bash
npm run dev
```
The application will be available at `http://localhost:5173`.
- **Frontend**: Served by Vite.
- **Backend**: API requests to `/api/*` are handled by the Hono server (via `@hono/vite-dev-server`).

---

## 🔐 Auth Backend Functionality

The project includes a robust local authentication system.

### Features
- **JWT-based Auth**: Secure session management using JSON Web Tokens.
- **SQLite Database**: Local data persistence using `better-sqlite3`.
- **Drizzle ORM**: Type-safe database interactions.
- **Protected Routes**: Dashboard access is restricted to logged-in users.

### API Endpoints
- `POST /api/auth/signup`: Create a new user account.
- `POST /api/auth/login`: Authenticate and receive a JWT.
- `GET /api/auth/me`: Validate the current session using the stored token.

---

## 🧪 Testing the Auth Backend

### 1. Via UI (Recommended)
1. Start the app and navigate to `/auth` (or click "Log In" / "Get Started" on the homepage).
2. Use the **Signup** tab to create an account.
3. Once signed up, you will be automatically redirected to the **Dashboard**.
4. Refresh the page; you should remain logged in (token is stored in `localStorage`).
5. Use the **Logout** button to end your session.

### 2. Manual Testing (via Curl)
You can test the backend endpoints directly while the dev server is running:

**Signup:**
```bash
curl -X POST http://localhost:5173/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com", "password":"password123"}'
```

**Login:**
```bash
curl -X POST http://localhost:5173/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com", "password":"password123"}'
```

---

## 🛠️ Project Structure
- `src/server/`: Backend Hono implementation.
- `src/server/db/`: Database schema and configuration.
- `src/contexts/AuthContext.tsx`: Global auth state and persistent storage logic.
- `src/components/ProtectedRoute.tsx`: Component for securing private routes.
- `src/pages/Auth.tsx`: Integrated Signup/Login interface.

---

## 📝 Iterative Documentation
For more detailed technical documentation, refer to the `.agent` directory within `homepage_build`:
- [Architecture Overview](.agent/architecture.md)
- [Current Status](.agent/current_status.md)
- [Development Guide](.agent/development_guide.md)

