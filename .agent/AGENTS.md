# AGENTS.md - AI Agent Instructions

**Project**: SnappyYak Core Application  
**Type**: Full-stack application with separate backend and frontend  
**Last Updated**: 2026-01-29 (Auth upgrade to Argon2id, font fixes)

## Tech Stack

### Backend
- **Language**: Rust (v1.93.0+)
- **Framework**: Axum 0.8
- **Database**: SQLite via Diesel ORM 2.2
- **Auth**: JWT (jsonwebtoken crate) + Argon2id for password hashing
- **Async Runtime**: Tokio
- **Middleware**: tower-http (CORS)

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v3 (custom design system)
- **Icons**: lucide-react
- **Utilities**: clsx, tailwind-merge

## Project Structure

```
SnappyYak-Core/
├── backend/              # Rust Application
│   ├── src/
│   │   ├── main.rs       # Server entry point
│   │   ├── auth.rs       # JWT & auth middleware
│   │   ├── db.rs         # Database connection pool
│   │   ├── models.rs     # Diesel models
│   │   ├── routes.rs     # API handlers
│   │   └── schema.rs     # Auto-generated Diesel schema
│   ├── migrations/       # SQL migrations
│   └── Cargo.toml        # Rust dependencies
├── frontend/             # Next.js Application
│   ├── app/              # App Router pages
│   │   ├── auth/         # Login/Signup
│   │   ├── dashboard/    # Protected dashboard
│   │   ├── layout.tsx    # Root layout
│   │   └── page.tsx      # Home page
│   ├── components/       # UI components
│   │   ├── layout/       # Navbar, Footer
│   │   ├── sections/     # Hero, Features, etc.
│   │   ├── ui/           # Button, Container
│   │   └── providers/    # AuthProvider
│   └── public/           # Static assets
└── legacy_vite_app/      # Archived Hono/Vite codebase
```

## Critical Rules

### 🚨 MANDATORY: Documentation Updates
**AI agents MUST update documentation after every breaking change or significant implementation.**

**When to Update:**
- After any breaking change (API changes, auth changes, schema changes, etc.)
- After implementing new features
- After modifying core functionality
- At the end of every user request that modifies code

**What to Update:**
- `.agent/AGENTS.md` - If tech stack, rules, or workflows change
- `.agent/architecture.md` - If structure or design patterns change
- `.agent/current_status.md` - Always update "Recently Completed" section
- `.agent/project_overview.md` - If core features or tech stack change
- `.agent/SOP/*.md` - If procedures or standards change
- `README.md` - If setup instructions or features change
- Any other relevant docs in the workspace

**Verification:**
- Before completing a task, ask: "Have I updated all relevant documentation?"
- List which docs were updated and why in the final response

### Backend (Rust/Axum)
- All API routes **must** be under `/api` prefix
- Use proper error handling with `Result` types
- **CRITICAL**: All errors **must** return JSON format (use `Json(json!({ "error": "message" }))`)
- Hash passwords with **Argon2id** (use `argon2` crate, not bcrypt)
- **Always sanitize input**: Call `.trim()` on user-provided strings
- Validate email format (must contain '@') before processing
- Sign JWTs with `JWT_SECRET` from environment variables
- Use Diesel's type-safe query builders
- Run `diesel migration run` after schema changes

### Frontend (Next.js)
- Use **'use client'** directive for components using hooks
- Prefer **named exports** over default exports for components
- App Router pages must be default exports
- Use **TypeScript** for all new files
- Follow existing **Tailwind utility patterns**
- API calls go to `http://localhost:8080/api/*`

### Authentication
- Protected routes check for JWT in `AuthProvider`
- Store JWT in `localStorage` (key: `token`)
- Use `useAuth()` hook to access auth state
- Logout clears token and redirects to `/auth`
- Backend validates JWT using `AuthUser` extractor

### Styling
- **CRITICAL**: See `.agent/SOP/frontend_design_system.md` for mandatory design rules
- **Design tokens** in `frontend/tailwind.config.ts`:
  - Colors: `brand-orange` (#EA580C), `brand-dark` (#132326)
  - Fonts: `font-heading` (Instrument Sans), `font-body` (Satoshi), `font-ui` (Satoshi)
- **Font Loading**: Satoshi MUST be loaded via Fontshare CDN in `layout.tsx`
- **DO NOT** add Next.js font optimization classes to `<body>` tag
- Use existing components from `components/ui/` before creating new ones
- Mobile-first responsive design (md:, lg: breakpoints)

## Common Tasks

### Adding a New Backend Endpoint
1. Add handler function in `backend/src/routes.rs`
2. Register route in `main.rs`
3. Validate input and return `Json<T>`
4. Test with frontend or curl

### Adding a New Frontend Page
1. Create `page.tsx` in `app/[route]/`
2. Use layout for shared components
3. Add 'use client' if using hooks
4. Protect with `useAuth()` if needed

### Database Schema Changes
1. Create migration: `diesel migration generate <name>`
2. Edit `up.sql` and `down.sql` in migrations folder
3. Run: `diesel migration run`
4. Update `models.rs` if needed
5. Verify `schema.rs` auto-updated

### Running the App
**Backend**: `cd backend && cargo run` (port 8080)  
**Frontend**: `cd frontend && npm run dev` (port 3000)

## File Naming Conventions
- **Rust**: snake_case (e.g., `auth.rs`, `models.rs`)
- **Next.js Pages**: lowercase (e.g., `page.tsx`, `layout.tsx`)
- **Components**: PascalCase (e.g., `AuthProvider.tsx`, `Navbar.tsx`)
- **Utilities**: camelCase (e.g., `cn.ts`)

## Security Notes
- **JWT_SECRET** stored in `backend/.env` (never commit)
- Passwords hashed with **Argon2id** (memory-hard algorithm, never store plaintext)
- **Input sanitization**: All user inputs are trimmed (`.trim()`) before processing
- **Email validation**: Basic format check (must contain '@')
- **Error responses**: All errors return JSON format to prevent frontend parsing issues
- CORS configured for `http://localhost:3000` in development
- No rate limiting implemented yet
- No refresh tokens implemented yet

## Testing
- **Backend**: Manual testing with curl or frontend integration
- **Frontend**: Browser testing, verify auth flows
- Focus on: signup → dashboard → logout → login

## Dependencies Management

### Backend (Rust)
- Add dependencies in `Cargo.toml`
- Run `cargo build` to install
- Check for updates: `cargo outdated`

### Frontend (Next.js)
- Add production deps: `npm install <package>`
- Add dev deps: `npm install -D <package>`
- Check for updates: `npm outdated`

## AI Agent Workflow
1. **Read** `project_overview.md`, `architecture.md`, and `current_status.md`
2. **Check** `SOP/` for procedural guides
3. **Review** `implementations/` for past implementations
4. **Follow** this file's rules when writing code
5. **Update** documentation after significant changes

## Questions to Ask Before Coding
- Does this change require a database migration?
- Is this route protected or public?
- Does this follow the existing design system? (Check `SOP/frontend_design_system.md`)
- Have I added proper error handling with JSON responses?
- Have I sanitized user inputs (`.trim()`)?
- Does this need to be documented in `.agent/`?
- Do I need to restart the backend server?
- Am I using Argon2id (not bcrypt) for password hashing?
