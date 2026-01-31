# Frontend Design System - Standard Operating Procedure

## Context
This SOP defines the **mandatory** design system for SnappyYak's Next.js frontend. **All agents and developers MUST follow these specifications exactly.** Any deviation requires explicit user approval.

---

## Typography

### Font Stack (CRITICAL - DO NOT MODIFY)

#### 1. Satoshi (Primary Body & UI Font)
- **Source**: Fontshare CDN
- **Location**: MUST be loaded in `frontend/app/layout.tsx`
- **CDN Link**: `https://api.fontshare.com/v2/css?f[]=satoshi@900,700,500,400&display=swap`
- **Usage**: 
  - Body text across entire application
  - UI elements (buttons, inputs, labels)
  - Default font for all content except headings

#### 2. Instrument Sans (Headings Only)
- **Source**: Google Fonts
- **Location**: Imported in `frontend/app/globals.css`
- **Usage**: All headings (h1-h6)

#### 3. Inter (Fallback Only)
- **Source**: Google Fonts
- **Location**: Imported in `frontend/app/globals.css`
- **Usage**: Fallback if Satoshi fails to load (rarely occurs)

### Tailwind Font Configuration
**File**: `frontend/tailwind.config.ts`

```typescript
fontFamily: {
  heading: ['"Instrument Sans"', 'sans-serif'],
  body: ['Satoshi', 'Inter', 'sans-serif'],
  ui: ['Satoshi', 'sans-serif'],
}
```

**CRITICAL**: 
- Satoshi MUST be the first font in the `body` array
- DO NOT add Next.js Font Optimizer classes (e.g., `Inter({ subsets: ['latin'] })`) to `<body>` tag
- The body tag should have NO className or use Tailwind's `font-body` class

### Font Loading Implementation
**File**: `frontend/app/layout.tsx`

```tsx
<html lang="en">
  <head>
    <link href="https://api.fontshare.com/v2/css?f[]=satoshi@900,700,500,400&display=swap" rel="stylesheet" />
  </head>
  <body>
    {/* NO className on body - let globals.css handle it */}
  </body>
</html>
```

**File**: `frontend/app/globals.css`

```css
@import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@700&family=Inter:wght@400;500;600&display=swap');
@import url('https://api.fontshare.com/v2/css?f[]=satoshi@300,400,500,700&display=swap');

@layer base {
  body {
    @apply font-body text-text-body bg-bg-main antialiased;
  }
  
  h1, h2, h3, h4, h5, h6 {
    @apply font-heading text-text-heading;
  }
}
```

---

## Color Palette

### ⚠️ COLOR POLICY (CRITICAL)
**ONLY `brand-orange` (#EA580C) and `brand-dark` (#132326) are approved for brand colors.**

- **DO NOT** introduce additional brand colors (e.g., purple, blue, green) without explicit user approval.
- **DO NOT** add custom colors to `tailwind.config.ts` unless the user explicitly requests them.
- Stick to the defined palette below. If a design requires a different color, consult the user first.

### Brand Colors
- **Primary Orange**: `#EA580C` (Tailwind: `brand-orange`)
- **Dark**: `#132326` (Tailwind: `brand-dark`)

### Background Colors
- **Main**: `#FFFFFF` (Tailwind: `bg-main`)
- **Alt**: `#FFFAF8` (Tailwind: `bg-alt`)

### Text Colors
- **Heading**: `#132326` (Tailwind: `text-heading`)
- **Body**: `#404042` (Tailwind: `text-body`)
- **Muted**: `#646466` (Tailwind: `text-muted`)

### Border Colors
- **Primary**: `#F4CBB5` (Tailwind: `border-primary`)
- **Secondary**: `#D3D3D3` (Tailwind: `border-secondary`)

### Tailwind Config (DO NOT MODIFY)
```typescript
colors: {
  brand: {
    orange: '#EA580C',
    dark: '#132326',
    purple: '#8B5CF6', // Approved accent color
  },
  bg: {
    main: '#FFFFFF',
    alt: '#FFFAF8',
  },
  text: {
    heading: '#132326',
    body: '#404042',
    muted: '#646466',
  },
  border: {
    primary: '#F4CBB5',
    secondary: '#D3D3D3',
  }
}
```

---

## Border Radius

- **Pill**: `9999px` (Tailwind: `rounded-pill`)
- **Card**: `30px` (Tailwind: `rounded-card`)

---

## Verification Protocol

### Before Committing ANY Frontend Changes:

1. **Font Check**:
   ```javascript
   // Run in browser console at localhost:3000
   getComputedStyle(document.body).fontFamily
   // MUST return: "Satoshi, Inter, sans-serif"
   ```

2. **Visual Inspection**:
   - Body text should use Satoshi font
   - Headings should use Instrument Sans
   - Brand colors should be preserved

3. **Build Check**:
   ```bash
   cd frontend
   npm run build
   # Must complete without errors
   ```

---

---
 
 ## Common Components
 
 ### 1. Logo
 - **File**: `frontend/components/ui/Logo.tsx`
 - **Usage**: MANDATORY for all brand logo instances.
 - **Properties**: Supports `className` for additional external styling (e.g., margins).
 - **Behavior**: Automatically links to `/` and includes transition effects.
 
 ---
 
 ## Common Mistakes to Avoid

### ❌ DO NOT:
1. Add Next.js font optimization to the `<body>` tag
2. Remove or modify Fontshare CDN link
3. Change font order in Tailwind config
4. Import fonts via Next.js `next/font/google` for body text
5. Modify color values without explicit approval
6. Remove the `@layer base` styles from globals.css

### ✅ DO:
1. Always load Satoshi via CDN in layout.tsx
2. Keep font-family hierarchy: Satoshi → Inter → sans-serif
3. Use Tailwind utility classes for consistency
4. Test font loading in browser before committing
5. Preserve the exact hex color values

---

## Troubleshooting

### Font Not Loading?
1. Check `frontend/app/layout.tsx` for CDN link
2. Verify `frontend/app/globals.css` has correct imports
3. Ensure `<body>` tag has no conflicting className
4. Clear browser cache and hard reload

### Wrong Font Displaying?
1. Inspect element in DevTools → Computed → font-family
2. If showing wrong font, check Tailwind config order
3. Verify no inline styles or component-level font overrides

---

## References
- [Fontshare (Satoshi)](https://www.fontshare.com/fonts/satoshi)
- [Google Fonts (Instrument Sans)](https://fonts.google.com/specimen/Instrument+Sans)
- [Tailwind Typography Plugin](https://tailwindcss.com/docs/font-family)
