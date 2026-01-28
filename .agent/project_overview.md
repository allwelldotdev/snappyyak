# Project Overview: SnappyYak Homepage Build

## Introduction
This project is the frontend build for the SnappyYak homepage, designed to be a high-performance, visually appealing web application. It is built using modern web technologies to ensure scalability, maintainability, and a premium user experience.

## Tech Stack

### Core
- **Framework**: React 18
- **Build Tool**: Vite 5
- **Language**: TypeScript 5
- **Routing**: React Router DOM 7

### Styling
- **CSS Framework**: Tailwind CSS 3
- **CSS Utils**: clsx, tailwind-merge (for dynamic class handling)
- **Icons**: lucide-react

### Backend
- **Server**: Hono 4 (integrated via `@hono/vite-dev-server`)
- **Database**: SQLite (better-sqlite3)
- **ORM**: Drizzle ORM
- **Authentication**: JWT (hono/jwt) + bcryptjs

### Code Quality
- **Linting**: ESLint
- **Formatter**: Prettier (implied usage standard)

## Key Features (Current)
- **Responsive Design**: Mobile-first approach using Tailwind's responsive modifiers.
- **Custom Design System**:
  - **Colors**: Custom brand palette (Orange, Dark) defined in `tailwind.config.js`.
  - **Typography**: Instrument Sans (Headings), Inter (Body), Satoshi (UI).
- **Routing**: Client-side routing set up for Home, Auth, and Dashboard pages.
- **Authentication**: Full signup/login flow with JWT-based sessions and protected routes.
- **Local Backend**: Hono server integrated into Vite dev server (single-port development).

## Goal
The primary goal is to create a seamless, engaging homepage that converts visitors, with a robust foundation for future expansion into a full web application with authentication and dashboard capabilities.
