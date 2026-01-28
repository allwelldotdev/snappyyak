# Development Guide

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Installation
1. Clone the repository.
2. Navigate to the project directory:
   ```bash
   cd files/homepage_build
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Available Scripts

### `npm run dev`
Starts the development server. Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

### `npm run build`
Builds the app for production to the `dist` folder. It basically runs `tsc` (TypeScript compiler) and `vite build`.

### `npm run preview`
Locally preview the production build.

### `npm run lint`
Runs ESLint to check for code quality issues.

## Database Commands

### `npx drizzle-kit push`
Pushes schema changes from `src/server/db/schema.ts` to the SQLite database. Run this after modifying the database schema.

### `npx drizzle-kit studio`
Opens Drizzle Studio (web-based database viewer) to inspect and modify database contents.

## Backend Development

### API Routes
All backend routes are defined in `src/server/index.ts` under the `/api` base path. The Hono server runs within the Vite dev server on the same port (5173).

### Testing API Endpoints
Use browser DevTools Network tab or `fetch()` in the console:
```javascript
fetch('/api/auth/signup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'test@example.com', password: 'password123' })
}).then(r => r.json()).then(console.log)
```

## Best Practices
- **Components**: Keep components small and focused. Use the `src/components` directory.
- **Styling**: Prefer Tailwind utility classes over custom CSS. Use `tailwind.config.js` for custom values.
- **Committing**: Ensure `npm run lint` passes before committing.
