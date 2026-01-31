# UI Library Consideration: RadixUI & Shadcn

## Context
As of January 2026, the SnappyYak Core frontend is built using a custom design system with vanilla Tailwind CSS and bespoke React components (Modal, Tooltip, etc.). There is a pending consideration to migrate these to RadixUI primitives or Shadcn UI.

## Pros & Cons Analysis

### Benefits (RadixUI / Shadcn)
- **Built-in Accessibility**: Provides industry-standard ARIA support, keyboard navigation, and focus management (traps) out of the box.
- **Robustness**: Battle-tested logic for complex components like Selects, Dropdowns, and Popovers which are error-prone when built from scratch.
- **Development Velocity**: Rapid implementation of standard UI patterns without reinventing foundational logic.
- **Consistency**: Hardened behaviors across different browsers and devices.

### Tradeoffs (Current Custom Approach)
- **Bundle Size**: Current custom components have near-zero dependency overhead. Shadcn adds small but non-zero dependencies.
- **Styling Control**: Our custom system offers 100% control over every pixel without fighting library defaults or opinionated architectures.
- **Simplicity**: For the current basic UI needs, custom components remain lightweight and easy to debug without abstraction layers.

## Recommendation
If the application complexity increases (e.g., adding advanced forms, complex tables, or multi-step modals), migrating to **Shadcn UI** is recommended for its balance of accessibility and Tailwind-first customization.

## Status
**Under Review**. Current implementation remains custom vanilla Tailwind.
