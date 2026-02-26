# Backend Authentication Implementation Guide

## Context
This SOP documents the authentication implementation for the SnappyYak Core application using **Rust (Axum)** backend and **Next.js** frontend with **Diesel ORM** for database management.

---

## Current Implementation
- **Backend**: Rust (Axum) API server on port 8080
- **Frontend**: Next.js App Router on port 3000
- **Database**: SQLite via Diesel ORM
- **Auth Method**: JWT (JSON Web Tokens)
- **Password Security**: Argon2id hashing

---

## Architecture Overview

### Backend Stack (Rust)
- **Web Framework**: Axum 0.8 (async, type-safe)
- **ORM**: Diesel 2.2 (compile-time query validation)
- **Database**: SQLite (file-based, zero-config)
- **Auth**: jsonwebtoken + argon2 crates
- **Runtime**: Tokio (async runtime)

### Frontend Stack (Next.js)
- **Framework**: Next.js 16 (App Router)
- **State Management**: React Context (`AuthProvider`)
- **HTTP Client**: Native `fetch` API
- **Token Storage**: localStorage

---

## Implementation Details

### Backend Structure
```
backend/src/
├── main.rs       # Server initialization, route registration
├── auth.rs       # JWT creation, validation, middleware
├── routes/       # Modular API handlers
│   ├── mod.rs        # Route module exports
│   ├── auth.rs       # Auth endpoints (signup, login, me, change_password)
│   ├── employer.rs   # Employer endpoints (employee mgmt)
│   └── onboarding.rs # Onboarding endpoints (password setup)
├── models.rs     # Diesel models (User, NewUser, role-based requests)
├── db.rs         # Database connection pool
└── schema.rs     # Auto-generated Diesel schema
```

### API Endpoints

#### POST /api/auth/signup
- **Input**: `{ email: string, password: string, fullname: string }`
- **Process**:
  1. Sanitize input (trim whitespace)
  2. Validate email format (must contain '@')
  3. Check if user exists
  4. Hash password with Argon2id
  5. Insert into database with `role: 'employer'`
  6. Generate JWT with role and needs_onboarding
- **Output**: `{ token: string, user: { id, email, fullname, role, needs_onboarding } }`

#### POST /api/auth/login
- **Input**: `{ email: string, password: string }`
- **Process**:
  1. Sanitize input (trim whitespace)
  2. Find user by email
  3. Verify against password or temp_password
  4. Calculate needs_onboarding (employee with null password)
  5. Generate JWT with role and needs_onboarding
- **Output**: `{ token: string, user: { id, email, fullname, role, needs_onboarding } }`

#### GET /api/auth/me
- **Headers**: `Authorization: Bearer <token>`
- **Process**:
  1. Extract JWT from header
  2. Validate signature and expiration
  3. Return user info with role and onboarding status
- **Output**: `{ user: { id, email, fullname, role, needs_onboarding } }`

#### POST /api/auth/change-password
- **Headers**: `Authorization: Bearer <token>`
- **Input**: `{ current_password: string, new_password: string }`
- **Process**:
  1. Verify user authentication via JWT
  2. Verify current password (handles nullable password field)
  3. Hash new password with Argon2id
  4. Update user record
- **Output**: `{ message: "Password updated successfully" }`

#### POST /api/employer/employees
- **Headers**: `Authorization: Bearer <token>` (Employer only)
- **Input**: `{ email: string, name: string }`
- **Process**:
  1. Verify employer role
  2. Generate 12-char temp password
  3. Hash temp password with Argon2id
  4. Create employee with `role: 'employee'`, null password
  5. Create junction table record with employer_id, employee_id, status: 'pending'
- **Output**: `{ id: number, email: string, temp_password: string }`

#### GET /api/employer/employees
- **Headers**: `Authorization: Bearer <token>` (Employer only)
- **Query Params**: `status` (optional): Filter by `active`, `pending`, or `deactivated`
- **Output**: `{ employees: [{ id, email, fullname, status, onboarded, created_at }] }`

#### GET /api/employer/employees/:id
- **Headers**: `Authorization: Bearer <token>` (Employer only)
- **Output**: `{ id, email, fullname, status, onboarded, created_at }`

#### PATCH /api/employer/employees/:id/status
- **Headers**: `Authorization: Bearer <token>` (Employer only)
- **Input**: `{ status: string }` (e.g., "deactivated")
- **Process**: Updates the employer_employees junction table status for the relationship
- **Output**: `{ message: "Status updated successfully" }`

#### DELETE /api/employer/employees/:id
- **Headers**: `Authorization: Bearer <token>` (Employer only)
- **Output**: `{ message: "Employee deleted successfully" }`

#### POST /api/onboarding/complete
- **Headers**: `Authorization: Bearer <token>` (Employee only, needs_onboarding: true)
- **Input**: `{ temp_password: string, new_password: string }`
- **Process**:
  1. Verify temp_password
  2. Validate new_password (min 8 chars)
  3. Hash new password
  4. Update user (set password, clear temp_password)
  5. Update employer_employees junction status to 'active'
  6. Return new JWT with needs_onboarding: false
- **Output**: `{ message: "Onboarding complete", token: string }`

### Frontend Integration
- **AuthProvider**: `frontend/components/providers/AuthProvider.tsx`
  - Manages global auth state
  - Persists token in localStorage
  - Auto-restores session on page load
- **Protected Routes**: Use `useAuth()` hook to check authentication
- **API Calls**: All requests to `http://localhost:8080/api/*`

### Database Schema
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  fullname TEXT NOT NULL,
  password TEXT,                     -- Nullable for new employees
  temp_password TEXT,                -- For employee onboarding
  role TEXT NOT NULL DEFAULT 'employee',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE employer_employees (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  employer_id INTEGER NOT NULL,
  employee_id INTEGER NOT NULL,
  department TEXT,
  role_title TEXT,
  status TEXT NOT NULL DEFAULT 'pending',  -- 'pending', 'active', 'deactivated'
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (employer_id) REFERENCES users(id),
  FOREIGN KEY (employee_id) REFERENCES users(id),
  UNIQUE(employer_id, employee_id)
);

CREATE TABLE employee_metrics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  employee_id INTEGER NOT NULL,
  metric_date DATE NOT NULL,
  work_time_seconds INTEGER DEFAULT 0,
  manual_time_seconds INTEGER DEFAULT 0,
  computer_activity_seconds INTEGER DEFAULT 0,
  productive_time_seconds INTEGER DEFAULT 0,
  unproductive_time_seconds INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES users(id)
);
```

---

## Security Considerations

### Implemented
- ✅ Password hashing with Argon2id (industry-standard, memory-hard algorithm)
- ✅ JWT signature validation
- ✅ Token expiration (24 hours)
- ✅ CORS configuration (localhost:3000 allowed)
- ✅ Type-safe database queries (Diesel prevents SQL injection)
- ✅ Input sanitization (trim whitespace from user inputs)
- ✅ Basic email validation (format check)
- ✅ JSON error responses (prevents frontend parsing errors)

### Not Implemented
- ❌ Refresh tokens
- ❌ Rate limiting on auth endpoints
- ❌ Email verification
- ❌ Password reset flow
- ❌ CSRF protection
- ❌ httpOnly cookies (tokens in localStorage)

---

## Development Workflow

### Running the Application
1. **Start Backend**:
   ```bash
   cd backend
   cargo run
   ```
   Runs on `http://localhost:8080`

2. **Start Frontend**:
   ```bash
   cd frontend
   npm run dev
   ```
   Runs on `http://localhost:3000`

### Database Migrations
```bash
# Create migration
diesel migration generate <name>

# Run migrations
diesel migration run

# Undo last migration
diesel migration redo
```

### Testing Auth Flow

#### Standard Test Credentials
**CRITICAL**: Use these exact credentials for all testing. DO NOT create your own.

**Employer Account:**
- Name: `Allwell Employer`
- Email: `employer@company.com`
- Password: `password123`

**Employee Accounts:**
- Name: `John Doe` | Email: `john.doe@company.com` | Password: `password123`
- Name: `Barry Scot` | Email: `barry.scot@company.com` | Password: `password123`

#### Testing Steps
1. Navigate to `http://localhost:3000/auth`
2. Create account (signup) using employer credentials
3. Verify redirect to `/employer` dashboard
4. Check user email and role displayed
5. Logout and login again
6. Test employee onboarding flow (if applicable)


---

## Troubleshooting

### Backend won't compile
- Run `cargo clean && cargo build`
- Check `Cargo.toml` for dependency conflicts
- Ensure Diesel features include `sqlite` and `returning_clauses_for_sqlite_3_35`

### Frontend can't connect to backend
- Verify backend is running on port 8080
- Check CORS configuration in `main.rs`
- Inspect browser console for errors

### Database errors
- Run `diesel migration run` to ensure schema is up-to-date
- Check `DATABASE_URL` in `backend/.env`
- Verify `db.sqlite` file exists

---

## Future Enhancements
1. **Security**:
   - Implement refresh tokens for long sessions
   - Add rate limiting middleware
   - Switch to httpOnly cookies
2. **Features**:
   - Email verification on signup
   - Password reset flow
   - Social auth (Google, GitHub)
3. **DevOps**:
   - Dockerize applications
   - Set up CI/CD pipelines
   - Implement proper logging

---

## References
- [Axum Documentation](https://docs.rs/axum/)
- [Diesel ORM Guide](https://diesel.rs/)
- [Next.js App Router](https://nextjs.org/docs/app)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
