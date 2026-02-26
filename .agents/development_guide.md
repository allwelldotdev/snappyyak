# Development Guide

## Getting Started

### Prerequisites
- **Node.js** (v18+)
- **Rust** (v1.93.0+)
- **Diesel CLI** (`cargo install diesel_cli --no-default-features --features sqlite`)

### Installation & Setup

#### 1. Backend (Rust)
1. Navigate to `backend/`:
   ```bash
   cd backend
   ```
2. Setup environment:
   ```bash
   # Create .env file with DATABASE_URL=sqlite://db.sqlite and JWT_SECRET=your_secret
   ```
3. Initialize Database:
   ```bash
   diesel migration run
   ```

#### 2. Frontend (Next.js)
1. Navigate to `frontend/`:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

## Running the App

You need to run both the backend and frontend servers simultaneously.

### Backend
Start the Axum server:
```bash
# inside backend/
cargo run
```
Runs on `http://localhost:8080`.

### Frontend
Start the Next.js dev server:
```bash
# inside frontend/
npm run dev
```
Runs on `http://localhost:3000`.

### Desktop Agent (macOS)
Start the Tauri dev app:
```bash
# inside desktop-agent/
RUST_LOG=info npm run tauri dev
```
The backend must be running before the desktop agent starts syncing.

## Database Commands

### Diesel CLI
- **Run Migrations**: `diesel migration run`
- **Redo Migration**: `diesel migration redo`
- **Create Migration**: `diesel migration generate <name>`

## API Testing
You can interact with the Rust API directly:

```bash
# Test Signup
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"dev@example.com", "password":"password123"}'
```

Use the standard test credentials documented in `.agents/skills/standard-test-credentials/SKILL.md`.

## Project Structure Notes
- **Frontend Components**: Located in `frontend/components/`.
  - `dashboard/`: Dashboard-specific components (e.g., `UserMenu.tsx`).
  - `layout/`: Layout components (e.g., `Navbar.tsx`).
  - `providers/`: Context providers (e.g., `AuthProvider.tsx`).
  - `ui/`: Reusable UI components (e.g., `Logo.tsx`).
- **Backend Models**: Defined in `backend/src/models.rs`.
- **Backend Routes**: Defined in `backend/src/routes.rs`.
