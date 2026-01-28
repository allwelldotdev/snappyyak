# AGENTS.md - AI Agent Instructions

**Project**: SnappyYak Homepage  
**Type**: Full-stack SPA with local backend  
**Last Updated**: 2026-01-28

## Tech Stack

### Frontend
- **Framework**: React 18 + TypeScript 5
- **Build Tool**: Vite 5
- **Routing**: React Router DOM v7
- **Styling**: Tailwind CSS 3 (custom design system in `tailwind.config.js`)
- **Icons**: lucide-react

### Backend
- **Server**: Hono 4 (integrated via `@hono/vite-dev-server`)
- **Database**: SQLite (via better-sqlite3)
- **ORM**: Drizzle ORM
- **Auth**: JWT (via hono/jwt) + bcryptjs for password hashing

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── layout/      # Navbar, Footer, etc.
│   └── ui/          # Button, Container, etc.
├── contexts/        # React Context providers (AuthContext)
├── pages/           # Route components (Home, Auth, Dashboard)
├── server/          # Backend code (Hono app)
│   ├── db/          # Database schema and client
│   └── index.ts     # API routes (/api/*)
└── utils/           # Helper functions
```

## Critical Rules

### Code Style
- Use **functional components** with hooks (no class components)
- Prefer **named exports** over default exports for components
- Use **TypeScript** for all new files
- Follow existing **Tailwind utility patterns** (no inline styles)

### Backend
- All API routes **must** be under `/api` prefix
- Use **try/catch** blocks in all async route handlers
- Return **JSON responses** with appropriate status codes
- Hash passwords with **bcryptjs** (salt rounds: 10)
- Sign JWTs with the `JWT_SECRET` constant

### Database
- Schema changes require running `npx drizzle-kit push`
- Use Drizzle's `.get()` for single results, `.all()` for arrays
- Always validate user input before DB operations

### Authentication
- Protected routes **must** use `<ProtectedRoute />` wrapper
- Store JWT in `localStorage` (key: `token`)
- Use `useAuth()` hook to access auth state in components
- Logout clears token and redirects to `/auth`

### Styling
- **Design tokens** are in `tailwind.config.js`:
  - Colors: `brand-orange`, `brand-dark`, `bg-main`, `text-body`, `text-muted`
  - Fonts: `font-heading` (Instrument Sans), `font-body` (Inter), `font-ui` (Satoshi)
- Use existing components from `src/components/ui/` before creating new ones
- Mobile-first responsive design (use `md:`, `lg:` breakpoints)

## Common Tasks

### Adding a New API Endpoint
1. Add route in `src/server/index.ts` under `app.post/get/etc`
2. Validate input and return JSON
3. Test with browser or `fetch()` from frontend

### Adding a New Page
1. Create component in `src/pages/`
2. Add route in `src/App.tsx`
3. Wrap in `<ProtectedRoute />` if auth required

### Database Schema Changes
1. Update `src/server/db/schema.ts`
2. Run `npx drizzle-kit push`
3. Verify `sqlite.db` file updated

### Running the App
- Dev server: `npm run dev` (starts on port 5173)
- Build: `npm run build`
- Lint: `npm run lint`

## Known Issues & Solutions

### Vite Config
The `vite.config.ts` uses `@hono/vite-dev-server` to proxy API requests. The `exclude` array **must** include `/^(?!\/api).+/` to prevent Hono from intercepting frontend routes.

### Database Location
`sqlite.db` is created in the project root. Do **not** commit this file to git.

### CORS
Not an issue since frontend and backend run on the same port (5173) during development.

## File Naming Conventions
- Components: PascalCase (e.g., `AuthContext.tsx`)
- Utilities: camelCase (e.g., `formatDate.ts`)
- Pages: PascalCase (e.g., `Dashboard.tsx`)

## Testing
- Manual browser testing is currently the primary verification method
- Focus on auth flows: signup → dashboard → logout → login

## Dependencies Management
- Add production deps: `npm install <package>`
- Add dev deps: `npm install -D <package>`
- Check for updates: `npm outdated`

## Security Notes
- **JWT_SECRET** is hardcoded in `src/server/index.ts` - change before production
- Passwords are hashed with bcryptjs (never store plaintext)
- No rate limiting implemented yet
- No CSRF protection implemented yet

## AI Agent Workflow
1. **Read** `project_overview.md`, `architecture.md`, and `current_status.md` for context
2. **Check** `SOP/` for procedural guides
3. **Review** `implementations/` for past feature implementations
4. **Follow** this file's rules when writing code
5. **Update** documentation after significant changes

## Questions to Ask Before Coding
- Does this change require a database migration?
- Is this route protected or public?
- Does this follow the existing design system?
- Have I added proper error handling?
- Does this need to be documented in `.agent/`?
