# .agent Directory

This directory contains comprehensive documentation for AI agents and developers working on the SnappyYak Core application. All documentation is designed to provide context, standards, and guidelines for maintaining code quality and consistency.

## 📋 Quick Start Guide

### For AI Agents
**Start here in this order:**
1. **[AGENTS.md](./AGENTS.md)** - Your primary instruction manual with tech stack, critical rules, and workflows
2. **[project_overview.md](./project_overview.md)** - High-level understanding of the project
3. **[architecture.md](./architecture.md)** - System architecture and file structure
4. **[current_status.md](./current_status.md)** - Latest implementation status and pending work

### For Human Developers
**Start here in this order:**
1. **[project_overview.md](./project_overview.md)** - Understand what SnappyYak is and the tech stack
2. **[development_guide.md](./development_guide.md)** - Setup instructions and common commands
3. **[architecture.md](./architecture.md)** - Learn the system structure
4. **[AGENTS.md](./AGENTS.md)** - Coding standards and best practices

## 📁 Directory Structure

```
.agent/
├── README.md                    # This file - directory guide
├── AGENTS.md                    # AI agent instructions & critical rules
├── project_overview.md          # Project introduction & tech stack
├── architecture.md              # System architecture & file structure
├── current_status.md            # Implementation status & recent changes
├── development_guide.md         # Setup & development workflow
├── SOP/                         # Standard Operating Procedures
│   ├── frontend_design_system.md     # Design system rules (MANDATORY)
│   └── backend_authentication_guide.md  # Backend auth implementation guide
└── implementations/             # Past implementation records
    └── auth_migration.md        # Example: Auth system migration notes
```

## 📖 File Descriptions

### Core Documentation

#### **AGENTS.md** 🤖
**Purpose**: Primary instruction file for AI agents  
**Contains**:
- Complete tech stack (Rust/Axum backend, Next.js frontend)
- Critical coding rules and conventions
- Security guidelines (Argon2id, JWT, input validation)
- File naming conventions
- Common task workflows
- Documentation update requirements

**When to read**: Before starting any coding task

---

#### **project_overview.md** 📊
**Purpose**: High-level project introduction  
**Contains**:
- What SnappyYak is (privacy-first workforce productivity platform)
- Complete tech stack breakdown
- Migration history (Hono/Vite → Rust/Next.js)
- Key features (current and planned)
- Development workflow basics

**When to read**: First time working on the project, or when onboarding

---

#### **architecture.md** 🏗️
**Purpose**: System design and structure  
**Contains**:
- Complete directory structure
- Routing strategy (Next.js App Router)
- Design system implementation (Tailwind, fonts)
- Backend architecture (Axum, Diesel, SQLite)
- Frontend-backend integration (CORS, API calls)

**When to read**: When adding new features, modifying structure, or understanding data flow

---

#### **current_status.md** ✅
**Purpose**: Living document of implementation status  
**Contains**:
- Implemented features checklist
- Recently completed work
- Pending/future work items
- Known issues or limitations

**When to read**: 
- Before starting work (to avoid duplicating effort)
- After completing work (to update status)
- When planning next steps

**⚠️ IMPORTANT**: Update this file after every significant implementation

---

#### **development_guide.md** 🛠️
**Purpose**: Practical setup and development instructions  
**Contains**:
- Prerequisites (Node.js, Rust, Diesel CLI)
- Installation steps (backend and frontend)
- How to run the application
- Database commands (migrations)
- API testing examples
- Component structure notes

**When to read**: Setting up local environment, running migrations, or testing

---

### SOP/ (Standard Operating Procedures)

#### **frontend_design_system.md** 🎨
**Purpose**: MANDATORY design system rules  
**Contains**:
- Color palette (brand-orange, brand-dark)
- Typography system (Instrument Sans, Satoshi)
- Component patterns
- Responsive design guidelines
- Font loading requirements

**When to read**: Before creating/modifying any UI components

**⚠️ CRITICAL**: This is MANDATORY reading for any frontend work

---

#### **backend_authentication_guide.md** 🔐
**Purpose**: Backend authentication implementation guide  
**Contains**:
- Complete auth architecture (JWT, Argon2id)
- API endpoint specifications (signup, login, me)
- Security considerations (implemented and pending)
- Frontend integration patterns
- Database schema
- Troubleshooting guide

**When to read**: Before working on authentication features or API endpoints

---

### implementations/

**Purpose**: Historical records of major implementations  
**Contains**: Detailed notes on past migrations, refactors, or complex features

**Example**: `auth_backend.md` - Documents the complete authentication backend implementation

**When to read**: When working on similar features or understanding past decisions

---

## 🎯 Use Cases

### "I need to add a new API endpoint"
1. Read: **AGENTS.md** (Backend section)
2. Read: **SOP/backend_authentication_guide.md** (for auth-related endpoints)
3. Reference: **architecture.md** (Backend Architecture)
4. Update: **current_status.md** when done

### "I need to create a new UI component"
1. Read: **SOP/frontend_design_system.md** (MANDATORY)
2. Read: **AGENTS.md** (Frontend section, Styling section)
3. Reference: **architecture.md** (Component structure)
4. Update: **current_status.md** when done

### "I need to modify the database schema"
1. Read: **AGENTS.md** (Database Schema Changes section)
2. Read: **development_guide.md** (Database Commands)
3. Update: **architecture.md** if structure changes
4. Update: **current_status.md** when done

### "I'm new to this project"
1. Read: **project_overview.md**
2. Read: **development_guide.md** (setup)
3. Read: **architecture.md**
4. Read: **AGENTS.md** (rules and conventions)
5. Read: **current_status.md** (current state)

### "I need to understand what's been done recently"
1. Read: **current_status.md** (Recently Completed section)
2. Check: **implementations/** for detailed notes

---

## 🔄 Documentation Maintenance

### When to Update Documentation

**After every significant change:**
- ✅ New features implemented
- ✅ Breaking changes made
- ✅ Tech stack modifications
- ✅ Architecture changes
- ✅ Design system updates

### What to Update

| Change Type | Files to Update |
|-------------|----------------|
| New feature | `current_status.md`, `AGENTS.md` (if rules change) |
| Architecture change | `architecture.md`, `AGENTS.md` |
| Tech stack change | `project_overview.md`, `AGENTS.md` |
| Design system change | `SOP/frontend_design_system.md`, `AGENTS.md` |
| Auth/API change | `SOP/backend_authentication_guide.md`, `AGENTS.md` |
| Setup process change | `development_guide.md` |
| Major implementation | Create new file in `implementations/` |

### Update Checklist
Before completing any task, ask:
- [ ] Have I updated `current_status.md`?
- [ ] Do any rules in `AGENTS.md` need updating?
- [ ] Has the architecture changed? (update `architecture.md`)
- [ ] Are setup instructions still accurate? (check `development_guide.md`)
- [ ] Should this be documented in `implementations/`?

---

## 🚨 Critical Reminders

1. **ALWAYS read `AGENTS.md` before coding** - It contains critical rules
2. **ALWAYS read `SOP/frontend_design_system.md` before UI work** - It's mandatory
3. **ALWAYS update `current_status.md` and `AGENTS.md` after significant work** - Keep it current
4. **NEVER skip documentation updates** - Future you (and others) will thank you

---

## 📞 Questions?

If documentation is unclear or missing:
1. Check if there's a related file in `implementations/`
2. Review `AGENTS.md` for general guidance
3. Update the documentation with what you learned

**Remember**: Good documentation is a gift to your future self and teammates.
