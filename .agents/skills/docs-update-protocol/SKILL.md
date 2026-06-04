---
name: docs-update-protocol
description: Enforce documentation updates after breaking changes, new features, schema or auth changes, or any core behavior modifications. Use when implementing code changes that affect APIs, workflows, architecture, setup, or design system rules and when you must report which docs were updated.
---

# Docs Update Protocol

## Overview

Keep documentation accurate after meaningful code changes. Apply this workflow whenever changes affect APIs, auth, schemas, architecture, workflows, setup, or the design system.

## Workflow

1. Identify the change type: breaking change, new feature, core behavior change, schema change, auth change, or design system change.
2. Update the required docs based on the change type (see checklist).
3. Ensure the "Recently Completed" section in `current_status.md` reflects the change.
4. Before final response, verify: "Have I updated all relevant documentation?"
5. In the final response, list which docs were updated and why.

## Required Docs Checklist

- `.agents/current_status.md`: Always update "Recently Completed."
- `.agents/architecture.md`: If structure or design patterns change.
- `.agents/project_overview.md`: If core features or tech stack change.
- `.agents/SOP/frontend_design_system.md`: If design system changes.
- `.agents/SOP/backend_authentication_guide.md`: If auth implementation changes.
- `.agents/SOP/desktop_agent_operations.md`: If desktop agent auth, sync, tray UI, or local storage behavior changes.
- `README.md`: If setup instructions or features change.
- `AGENTS.md`: If rules or workflows change.
