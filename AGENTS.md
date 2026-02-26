# AGENTS.md — AI Agent Instructions

**Project**: SnappyYak Core Application  
**Type**: Full-stack application with separate backend and frontend  
**Last Updated**: 2026-02-26 (Docs sweep alignment)

## Tech Stack

### Backend
- **Language**: Rust (v1.93.0+)
- **Framework**: Axum 0.8
- **Database**: SQLite via Diesel ORM 2.2
- **Auth**: JWT (jsonwebtoken crate) + Argon2id
- **Async Runtime**: Tokio
- **Middleware**: tower-http (CORS)

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v3 (custom design system)
- **Icons**: lucide-react
- **Utilities**: clsx, tailwind-merge

### Desktop Agent
- **Framework**: Tauri 2.x + Svelte
- **Language**: Rust + TypeScript

## Project Structure & Architecture
See `.agents/architecture.md` for the full, up-to-date structure and routing overview.

## Skill Storage Convention
- All Agent Skills MUST be created under: `.agents/skills/<skill-name>/SKILL.md`
- The skill name MUST be kebab-case and MUST match the directory name exactly.

## Skill Format
- `SKILL.md` must use YAML frontmatter (`name`, `description` required) followed by Markdown instructions.
- Keep `SKILL.md` concise; place deep reference material in separate files (inside `.agents/skills/<skill-name>/references/<reference-material>.md`) only when necessary.

## Skills Index
- `docs-update-protocol`: Documentation update workflow and checklist. Path: `.agents/skills/docs-update-protocol/SKILL.md`
- `backend-endpoint-workflow`: Backend API endpoint checklist (Rust/Axum). Path: `.agents/skills/backend-endpoint-workflow/SKILL.md`
- `frontend-page-workflow`: Frontend page workflow (Next.js App Router). Path: `.agents/skills/frontend-page-workflow/SKILL.md`
- `design-system-guardrails`: Design system rules for UI work. Path: `.agents/skills/design-system-guardrails/SKILL.md`
- `diesel-migration-workflow`: Database schema migration checklist. Path: `.agents/skills/diesel-migration-workflow/SKILL.md`
- `auth-session-rules`: Auth/session rules for JWT usage. Path: `.agents/skills/auth-session-rules/SKILL.md`
- `standard-test-credentials`: Standard test accounts and cleanup rules. Path: `.agents/skills/standard-test-credentials/SKILL.md`

## Core Rules (By Skill)
- Backend endpoints: `backend-endpoint-workflow`
- Frontend pages: `frontend-page-workflow`
- Design system: `design-system-guardrails`
- Auth/session handling: `auth-session-rules`
- DB migrations: `diesel-migration-workflow`
- Test credentials: `standard-test-credentials`

## AI Agent Workflow
1. **Read** `.agents/project_overview.md`, `.agents/architecture.md`, and `.agents/current_status.md`
2. **Check** `.agents/SOP/` for procedural guides
3. **Review** `.agents/implementations/` for past implementations
4. **Follow** this file's rules when writing code
5. **Update** documentation after significant changes
