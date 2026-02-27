# SnappyYak - Workforce Productivity Platform

A privacy-first workforce productivity platform. The system is composed of a **Rust (Axum)** backend, a **Next.js** employer/employee web dashboard, and a **Tauri + Svelte** desktop agent for macOS that tracks activity and syncs data in real time.

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

#### 3. Desktop Agent (macOS)
1. **Open a new terminal** and navigate to the desktop agent directory:
   ```bash
   cd desktop-agent
   ```
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Start the Tauri development app:
   ```bash
   RUST_LOG=info npm run tauri dev
   ```
   The desktop agent window will open. Log in with an **Employee** account. Metrics sync to the backend every 60 seconds.

> **Note**: The backend must be running on port 8080 before launching the desktop agent.

---

## 🔐 Auth & API

### Features
- **JWT-based Auth**: Secure session management using JSON Web Tokens.
- **Role-Based Access**: Employers and Employees have separate dashboards and API permissions.
- **Relationship Guardrails**: Employees must have at least one active employer relationship to log in, onboard, or sync metrics.
- **SQLite Database**: Local persistence using Diesel ORM.
- **Desktop Agent Sync**: Employee metrics collected locally and synced via batched REST POST.

### API Endpoints (Backend Port 8080)

**Authentication:**
- `POST /api/auth/signup`: Create a new employer account.
- `POST /api/auth/login`: Authenticate and receive a JWT.
- `GET /api/auth/me`: Validate the current session.
- `POST /api/auth/change-password`: Update user password.

**Employer Management:**
- `POST /api/employer/employees`: Add a new employee (generates temporary password).
- `GET /api/employer/employees`: List all employees with today's synced metrics.
- `GET /api/employer/employees/:id`: Get employee details.
- `PATCH /api/employer/employees/:id/status`: Update employee status.
- `DELETE /api/employer/employees/:id`: Remove employee relationship.

**Employee Onboarding:**
- `POST /api/onboarding/complete`: Complete onboarding by setting a new password.

**Desktop Agent Sync (Employee-only):**
- `POST /api/employee/metrics/sync`: Upsert today's aggregated activity metrics.

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
6. If all employer relationships are deactivated, login and onboarding are blocked.

---

## 📝 Iterative Documentation
For more detailed technical documentation, refer to the `.agents` directory:
- [Architecture Overview](.agents/architecture.md)
- [Current Status](.agents/current_status.md)
- [Development Guide](.agents/development_guide.md)
