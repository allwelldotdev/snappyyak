---
name: frontend-page-workflow
description: Implement or modify Next.js App Router pages in the SnappyYak frontend. Use when adding routes, layouts, or pages that require client hooks, auth protection, or dashboard layout conventions.
---

# Frontend Page Workflow

## Overview

Follow this checklist to add or update frontend pages using the App Router and project UI rules.

## Workflow

1. Create `page.tsx` under `frontend/app/[route]/` (pages must be default exports).
2. Add `'use client'` to components using hooks; prefer named exports for non-page components.
3. Use TypeScript for new files and follow existing Tailwind utility patterns.
4. Use Next.js `<Link>` for internal navigation (no `<a>` tags).
5. Route-protect with `useAuth()` when needed.
6. Ensure dashboard pages inherit `dashboard/layout.tsx`.
7. Use `usePathname()` for active navigation states.
8. Point API calls at `http://localhost:8080/api/*`.
