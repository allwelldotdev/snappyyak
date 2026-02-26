---
name: diesel-migration-workflow
description: Apply database schema changes with Diesel in SnappyYak. Use when adding or modifying tables, columns, or constraints and when updating models or schema files.
---

# Diesel Migration Workflow

## Overview

Follow this sequence to keep Diesel migrations, models, and schema consistent.

## Workflow

1. Generate a migration: `diesel migration generate <name>`.
2. Edit `up.sql` and `down.sql` in the new migration folder.
3. Run migrations: `diesel migration run`.
4. Update `backend/src/models.rs` if models change.
5. Verify `backend/src/schema.rs` is updated and matches the DB.

**Appropriate for:** Templates, boilerplate code, document templates, images, icons, fonts, or any files meant to be copied or used in the final output.

---

**Not every skill requires all three types of resources.**
