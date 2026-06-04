---
name: backend-endpoint-workflow
description: Implement or modify Rust/Axum backend API endpoints with SnappyYak-required rules. Use when adding routes, changing handlers, touching auth, or updating request models or DB logic for an API endpoint.
---

# Backend Endpoint Workflow

## Overview

Follow this checklist to add or update API endpoints safely and consistently with project rules.

## Workflow

1. Add or update the handler in `backend/src/routes/` (or `backend/src/routes.rs` if centralized).
2. Register the route in `backend/src/main.rs` under the `/api` prefix.
3. Define a request struct specific to the endpoint payload (avoid reusing mismatched structs).
4. Sanitize inputs with `.trim()` and validate email format where applicable.
5. Return JSON errors consistently (`Json(json!({ "error": "message" }))`).
6. Use Argon2id for password hashing and `JWT_SECRET` for signing when auth is involved.
7. Use Diesel’s type-safe query builders and run migrations if schema changes.
8. Test with frontend or curl before closing the task.
