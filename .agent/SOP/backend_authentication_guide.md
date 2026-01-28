# Backend Authentication Implementation Guide

## Context
This SOP documents the recommended strategies for implementing backend authentication for the SnappyYak homepage application. The frontend is built with **React 18 + Vite + TypeScript**, and authentication needs to connect the existing [`Auth.tsx`](file:///Users/tundeoladipupo/Code/SnappyYak/homepage_design/files/homepage_build/src/pages/Auth.tsx) page to the [`Dashboard.tsx`](file:///Users/tundeoladipupo/Code/SnappyYak/homepage_design/files/homepage_build/src/pages/Dashboard.tsx) page.

---

## Current State
- **Auth Page**: Has UI for login/signup with email and password fields. Currently simulates auth with `setTimeout` and redirects to dashboard.
- **Dashboard Page**: Accessible without authentication. No user session management.
- **Routing**: Uses React Router DOM v7 with routes defined in [`App.tsx`](file:///Users/tundeoladipupo/Code/SnappyYak/homepage_design/files/homepage_build/src/App.tsx).

---

## Recommended Approaches

### Option 1: Local Backend (Hono + Vite Plugin)
**Best for**: Local development without external dependencies.

#### Stack
- **Backend Framework**: [Hono](https://hono.dev/) (lightweight, TypeScript-first)
- **Database**: SQLite via [Drizzle ORM](https://orm.drizzle.team/)
- **Integration**: `@hono/vite-dev-server` plugin

#### Key Benefits
- Single process: frontend + backend on same port (e.g., `5173`)
- No CORS issues
- Zero infrastructure setup
- Entire app (including DB) lives in project folder
- Portable and git-committable

#### Implementation Steps
1. Install: `@hono/vite-dev-server`, `hono`, `drizzle-orm`, `better-sqlite3`
2. Update `vite.config.ts` to include Hono plugin
3. Create `/src/server/index.ts` with API routes:
   - `POST /api/auth/signup`
   - `POST /api/auth/login`
4. Configure Drizzle schema for users table
5. Implement JWT-based authentication
6. Update `Auth.tsx` to call `fetch('/api/auth/login')` instead of `setTimeout`
7. Store JWT in `localStorage`
8. Create protected route wrapper for dashboard

---

### Option 2: Next.js Migration
**Best for**: Production-grade SaaS applications with long-term scalability.

#### Why Next.js
- **Built-in API Routes**: No plugin setup required
- **Server Components**: More secure auth handling
- **NextAuth.js Integration**: Industry-standard auth library
- **Full-stack by Design**: Not a "stretched" frontend tool

#### Trade-offs vs Current Stack
| Aspect | Vite + Hono | Next.js |
|--------|-------------|---------|
| Migration Effort | None (add-on) | High (restructure files) |
| Learning Curve | Low | Moderate-High |
| Auth Complexity | Manual JWT | Near-automatic (NextAuth) |
| Industry Standard | Good for SPAs | Gold standard for web apps |

#### When to Choose
- Planning production deployment soon
- Team familiar with Next.js patterns
- Need advanced features (SSR, ISR, Middleware)

---

### Option 3: Backend-as-a-Service (BaaS)
**Best for**: Rapid prototyping without maintaining backend code.

#### Providers
1. **Supabase** (PostgreSQL + Auth + Storage)
   - Install: `@supabase/supabase-js`
   - Provides: Database, Auth, Real-time subscriptions
   - Auth: Email/password, OAuth, magic links

2. **Clerk** (Specialized Auth Provider)
   - Pre-built auth UI components
   - Zero maintenance
   - Premium developer experience

#### Implementation Pattern
1. Create provider account and project
2. Install SDK
3. Create `src/lib/[provider].ts` client
4. Wrap `App.tsx` in `AuthProvider` context
5. Replace `setTimeout` simulation with provider's auth methods
6. Implement protected routes

---

## Standard Authentication Workflow

Regardless of chosen approach, the auth flow should follow this pattern:

### 1. Initialize Auth Provider
- Set up backend/service client
- Configure environment variables for secrets

### 2. Create Auth Context
```typescript
// src/contexts/AuthContext.tsx
// Provides: user state, login(), signup(), logout()
```

### 3. Protect Routes
```typescript
// src/components/ProtectedRoute.tsx
// Redirects to /auth if no valid session
```

### 4. Wire UI
- Update `Auth.tsx` handleSubmit to call real auth
- Store session token (JWT/cookie)
- Redirect on success

### 5. Session Persistence
- Use `localStorage` or `httpOnly` cookies
- Auto-restore session on page refresh

### 6. Dashboard Integration
- Fetch user data from session
- Display user-specific information
- Implement logout functionality

---

## Security Checklist
- [ ] Store passwords hashed (bcrypt/argon2)
- [ ] Use HTTPS in production
- [ ] Implement CSRF protection
- [ ] Set secure cookie flags (`httpOnly`, `secure`, `sameSite`)
- [ ] Add rate limiting to auth endpoints
- [ ] Validate and sanitize all inputs
- [ ] Implement session expiration
- [ ] Add refresh token mechanism for long sessions

---

## Migration Path Recommendation

For the current Vite-based project:
1. **Short-term**: Implement Hono + SQLite for local development
2. **Medium-term**: Evaluate production needs
3. **Long-term**: Consider Next.js migration if building full SaaS platform

---

## References
- [Hono Documentation](https://hono.dev/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [NextAuth.js](https://next-auth.js.org/)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
