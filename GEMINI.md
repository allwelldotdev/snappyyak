# GEMINI.md - SnappyYak-Core Context

This document provides essential context and instructions for AI agents working on the SnappyYak-Core project. It reflects the current architecture, tech stack, and mandatory development standards.

## 🚀 Project Overview
SnappyYak is a privacy-first workforce productivity platform. It uses a high-performance Rust backend and a modern Next.js frontend to manage time tracking, scheduling, and project monitoring with a focus on local data persistence and security.

- **Architecture**: Decoupled Monorepo (Backend: Rust/Axum, Frontend: Next.js).
- **Core Workflow**: Employer signup -> Employee creation (temp password) -> Employee onboarding -> Active tracking.

## 🛠 Technology Stack
- **Backend**: Rust (v1.93.0+), Axum 0.8, Diesel ORM 2.2, SQLite, Argon2id hashing, JWT sessions.
- **Frontend**: Next.js 16 (App Router), React 19, TypeScript 5, Tailwind CSS v3, Shadcn UI (Radix-based).
- **Desktop Agent**: Tauri 2.x + Svelte + Rust (Target: <50MB RAM).

## 🏗 Directory Structure
- `backend/`: Axum server, Diesel migrations, and models.
- `frontend/`: Next.js App Router, Shadcn UI components, and AuthProvider.
- `.agents/`: **Primary Documentation Source**. Includes SOPs, architecture maps, and implementation history.
- `legacy_vite_app/`: Archived Hono/Vite codebase (Reference Only).

## 🚨 Critical Rules & Mandates

### 1. Documentation First
**MANDATORY**: Update relevant documentation after every significant change (new features, API updates, schema changes).
- Always update `.agents/current_status.md` and `AGENTS.md` (if rules change).

### 2. Backend Standards
- **Errors**: All API errors MUST return JSON format: `Json(json!({ "error": "message" }))`.
- **Sanitization**: Call `.trim()` on all user-provided strings.
- **Security**: Use Argon2id for hashing (never bcrypt). Sign JWTs with `JWT_SECRET`.
- **API Prefix**: All routes must be under the `/api` prefix.

### 3. Frontend & Design Standards
- **Design Tokens**: ONLY use approved brand colors: `brand-orange` (#EA580C), `brand-dark` (#132326), `brand-indigo` (#4F46E5).
- **Typography**: Satoshi (Body/UI) via Fontshare CDN, Instrument Sans (Headings). **Do not use Next.js font optimization on body**.
- **Components**: Use the `<Logo />` component for all brand instances. Use Next.js `<Link>` for all internal navigation.
- **Directives**: Use `'use client'` for components with hooks.

### 4. Testing & Credentials
**MANDATORY**: Use these exact credentials for all testing. DO NOT create random users.
- **Employer**: `dev@example.com` / `password123`
- **Employee**: `john.doe@company.com` / `password123`

## 🏃 Building and Running

### Backend (Port 8080)
```bash
cd backend
# Setup .env with DATABASE_URL=sqlite://db.sqlite and JWT_SECRET
diesel migration run
cargo run
```

### Frontend (Port 3000)
```bash
cd frontend
npm install
npm run dev
```

## 📄 Key Reference Files
- `AGENTS.md`: Skills index, rule pointers, and test credential guidance.
- `.agents/SOP/frontend_design_system.md`: Mandatory styling and font rules.
- `.agents/SOP/backend_authentication_guide.md`: Auth flow and API specifications.
- `.agents/current_status.md`: Living record of implemented vs. pending features.
- `.agents/architecture.md`: Full routing and system map.

---
**Agent Workflow**: Before coding, review `AGENTS.md` and `.agents/current_status.md`. After coding, verify against `.agents/SOP/` and update status.
