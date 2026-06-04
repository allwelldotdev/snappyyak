# Project Overview: SnappyYak Core Application

## Introduction
This project is the core application for SnappyYak, a privacy-first workforce productivity intelligence platform. It has been migrated from a Hono/Vite monolithic stack to a modern, performant architecture using Rust for the backend, Next.js for the frontend, and a Tauri + Svelte desktop agent.

## Tech Stack

### Backend (Rust)
- **Language**: Rust 1.93.0+
- **Framework**: Axum 0.8 (async web framework)
- **Database**: SQLite via Diesel ORM 2.2
- **Auth**: JWT (jsonwebtoken) + Argon2id
- **Runtime**: Tokio (async runtime)
- **Middleware**: tower-http for CORS

### Frontend (Next.js)
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3
- **State Management**: React Context (AuthProvider)
- **Icons**: lucide-react
- **Utilities**: clsx, tailwind-merge

### Desktop Agent (Tauri)
- **Framework**: Tauri 2.x + Svelte
- **Language**: Rust + TypeScript
- **Sync**: Employee metrics batched to backend

## Architecture

### Backend
The backend is a standalone Rust application running on port 8080. It provides RESTful API endpoints for authentication and will expand to include productivity tracking features.

**Key Files**:
- `main.rs`: Server initialization and routing
- `auth.rs`: JWT middleware and authentication logic
- `routes.rs`: API endpoint handlers
- `models.rs`: Diesel database models
- `db.rs`: Database connection pooling

### Frontend
The frontend is a Next.js application using the App Router pattern, running on port 3000. It communicates with the backend via standard HTTP requests.

**Key Directories**:
- `app/`: Page routes (Home, Auth, Dashboard)
- `components/`: Reusable UI components
- `public/`: Static assets

## Key Features

### Current Implementation
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints
- **Custom Design System**:
  - **Colors**: Brand orange (#EA580C), dark (#132326)
  - **Typography**: Instrument Sans (headings), Satoshi (body & UI)
- **Authentication**: Full JWT-based signup/login flow with protected routes.
- **Relationship Guardrails**: Employees must have at least one active employer relationship to log in, onboard, or sync metrics.
- **Desktop Agent Sync**: Employee metrics collected locally and synced to the backend.
- **Auth Enhancements**: 
    - Placeholder 'Forgot Password' flow with email input and success states.
    - Integrated Google and Slack OAuth placeholder buttons with branding icons.
- **Premium UI**: Restored original design with Hero, Features, Testimonials, Pricing sections.
- **Type Safety**: Rust backend ensures compile-time guarantees, TypeScript frontend

### Planned Features
- Real-time productivity tracking
- Team workload balancing
- Privacy-first screenshot management
- Integration with project management tools

## Migration Details

### From
- **Backend**: Hono 4 + Vite dev server
- **Database**: SQLite + Drizzle ORM
- **Frontend**: Vite + React 18

### To
- **Backend**: Rust + Axum + Diesel
- **Database**: SQLite + Diesel ORM (same DB engine, different ORM)
- **Frontend**: Next.js 16 + React 19

### Why Migrate?
1. **Performance**: Rust provides near-C performance with memory safety
2. **Scalability**: Axum is built for handling high-concurrency workloads
3. **Type Safety**: Diesel's compile-time query validation eliminates runtime DB errors
4. **Production Ready**: Next.js is industry standard for production React apps

## Development Workflow

### Starting the Application
1. **Backend**: `cd backend && cargo run`
2. **Frontend**: `cd frontend && npm run dev`

Both servers must run concurrently.

## Goal
Create a production-ready, privacy-first workforce intelligence platform with:
- Seamless authentication flow
- High-performance data processing
- Premium user experience
- Scalable architecture for future features
