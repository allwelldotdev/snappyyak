---
name: design-system-guardrails
description: Enforce SnappyYak design system rules for frontend UI work. Use when creating or modifying pages, layouts, components, or styling to ensure brand colors, fonts, logo usage, and Tailwind patterns are respected.
---

# Design System Guardrails

## Overview

Use this checklist to keep UI changes aligned with the SnappyYak design system.

## Rules Checklist

1. Use only approved brand colors: `brand-orange`, `brand-dark`, `brand-indigo`.
2. Use the configured fonts: Instrument Sans for headings and Satoshi for body/UI.
3. Load Satoshi via the Fontshare CDN in `layout.tsx`.
4. Do not add Next.js font optimization classes to the `<body>` tag.
5. Use the `<Logo />` component from `components/ui/Logo.tsx` for all brand logo instances.
6. Prefer existing components in `components/ui/` before creating new ones.
7. Follow existing Tailwind utility patterns and mobile-first breakpoints.

## References

- `.agents/SOP/frontend_design_system.md`
- `frontend/tailwind.config.ts`
