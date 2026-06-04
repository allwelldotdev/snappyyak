---
name: auth-session-rules
description: Apply SnappyYak authentication and session rules. Use when handling login/logout flows, JWT storage, protected routes, or backend JWT validation.
---

# Auth Session Rules

## Overview

Use these rules to keep auth and session behavior consistent across the app.

## Rules

1. Protected routes check for JWT in `AuthProvider`.
2. Store JWT in `localStorage` with key `token`.
3. Use `useAuth()` to access auth state in the frontend.
4. Logout clears the token and redirects to `/auth`.
5. Backend validates JWT using the `AuthUser` extractor.

**Appropriate for:** Templates, boilerplate code, document templates, images, icons, fonts, or any files meant to be copied or used in the final output.

---

**Not every skill requires all three types of resources.**
