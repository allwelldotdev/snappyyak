# SnappyYak Web - Homepage & Auth Implementation

This project is a high-performance web application, now migrated to a **Next.js** frontend and a **Rust (Axum)** backend, featuring **SQLite/Diesel** for robust local authentication.

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [Rust](https://www.rust-lang.org/tools/install) (v1.93.0 or later)
- [Diesel CLI](https://diesel.rs/guides/getting-started) (with SQLite: `cargo install diesel_cli --no-default-features --features sqlite`)

### Installation & Setup

#### 1. Backend (Rust)
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Setup environment:
   ```bash
   cp .env.example .env # Ensure DATABASE_URL and JWT_SECRET are set
   ```
3. Run migrations:
   ```bash
   diesel migration run
   ```
4. Start the server:
   ```bash
   cargo run
   ```
   The API will be available at `http://localhost:8080`.

#### 2. Frontend (Next.js)
1. **Open a new terminal** and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000`.

---

## 🔐 Auth Backend Functionality

The project includes a robust local authentication system, now powered by Rust for performance and safety.

### Features
- **JWT-based Auth**: Secure session management using JSON Web Tokens.
- **SQLite Database**: Local data persistence using `diesel`.
- **Axum Framework**: High-performance, async backend handling.
- **Protected Routes**: Dashboard access is restricted to logged-in users via Next.js middleware/hooks.

### API Endpoints (Backend Port 8080)

**Authentication:**
- `POST /api/auth/signup`: Create a new employer account.
- `POST /api/auth/login`: Authenticate and receive a JWT (supports password or temp_password).
- `GET /api/auth/me`: Validate the current session using the stored token.
- `POST /api/auth/change-password`: Update user password (requires valid JWT).

**Employer Management:**
- `POST /api/employer/employees`: Add a new employee (auto-generates temporary password).
- `GET /api/employer/employees`: List all employees.
- `GET /api/employer/employees/:id`: Get employee details.
- `DELETE /api/employer/employees/:id`: Remove employee.

**Employee Onboarding:**
- `POST /api/onboarding/complete`: Complete onboarding by setting a new password.

---

## 🧪 Testing the Application

### 1. Via UI (Verified)

#### Employer Flow
1. Start both servers (`cargo run` in backend, `npm run dev` in frontend).
2. Navigate to `http://localhost:3000`.
3. Click "Get Started" or "Sign Up" to create an **Employer** account.
4. After signup, you'll be redirected to the **Employer Dashboard** (`/employer`).
5. Click "Add New Employee" → "Personal Computers" to add an employee.
6. Fill in name and email → receive temporary password to share with employee.

#### Employee Flow
1. After employer creates employee account with temp password:
2. Navigate to Login page and use employee email + temp password.
3. First login redirects to **Onboarding** (`/onboarding`).
4. Set permanent password → redirected to **Employee Dashboard** (`/dashboard`).
5. Subsequent logins go directly to Employee Dashboard.

---

## 🛠️ Project Structure

- **`backend/`**: Rust application (Axum, Diesel, Tokio).
  - `src/main.rs`: Server entry point.
  - `src/auth.rs`: JWT logic.
  - `src/routes.rs`: API handlers.
  - `src/models.rs`: Database models.
- **`frontend/`**: Next.js application (App Router).
  - `app/`: Pages (Home, Auth, Dashboard).
  - `components/`: UI components (restored from original design).
  - `contexts/`: Auth provider compatibility.
- **`legacy_vite_app/`**: The previous Hono/Vite implementation (archived).

---

## 📝 Iterative Documentation
For more detailed technical documentation, refer to the `.agent` directory within `homepage_build`:
- [Architecture Overview](.agent/architecture.md)
- [Current Status](.agent/current_status.md)
- [Development Guide](.agent/development_guide.md)
