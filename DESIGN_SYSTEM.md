# Design System — WhatsApp Sender Dashboard

A token-based design system built with CSS Custom Properties and CSS Modules. All visual decisions (colors, spacing, typography, etc.) are defined as tokens in `app/styles/tokens/` and consumed via semantic theme variables from `app/styles/themes/light.css`.

## Table of Contents

- [Structure](#structure)
- [How to Use Tokens](#how-to-use-tokens)
- [Color Tokens](#color-tokens)
- [Typography Tokens](#typography-tokens)
- [Spacing Tokens](#spacing-tokens)
- [Shadow Tokens](#shadow-tokens)
- [Border Tokens](#border-tokens)
- [Animation Tokens](#animation-tokens)
- [Theme Variables](#theme-variables)

---

## Structure

```
app/styles/
├── tokens/
│   ├── colors.css       # Raw color palette (primary, neutral, semantic)
│   ├── typography.css   # Font sizes, weights, line heights, letter spacing
│   ├── spacing.css      # Spacing scale (multiples of 8px)
│   ├── shadows.css      # Elevation levels (sm → xl)
│   ├── borders.css      # Border radii (none → full)
│   └── animations.css   # Durations, easing, reduced-motion support
├── themes/
│   └── light.css        # Semantic theme variables (maps tokens to roles)
├── base.css             # CSS reset and base element styles
└── globals.css          # Entry point — imports all of the above
```

All token files are imported in `globals.css` and available globally via `:root`.

---

## How to Use Tokens

**Always prefer semantic theme variables** over raw token values. Semantic variables (from `light.css`) carry intent and will automatically adapt if a dark theme is added later.

```css
/* ✅ Preferred — semantic variable */
.card {
  background: var(--color-bg-surface);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-md);
  padding: var(--spacing-6);
  box-shadow: var(--shadow-sm);
}

/* ⚠️ Acceptable — raw token when no semantic equivalent exists */
.accent {
  color: var(--color-primary-600);
}

/* ❌ Avoid — hardcoded values */
.bad {
  color: #111827;
  padding: 24px;
}
```

In a CSS Module file, just use `var(--token-name)` directly — no imports needed since tokens are global.

---

## Color Tokens

Defined in `app/styles/tokens/colors.css`.

### Primary (Blue)

| Variable | Hex | Usage |
|---|---|---|
| `--color-primary-50` | `#eff6ff` | Subtle backgrounds, active nav bg |
| `--color-primary-100` | `#dbeafe` | Muted backgrounds |
| `--color-primary-200` | `#bfdbfe` | Light accents |
| `--color-primary-300` | `#93c5fd` | Decorative |
| `--color-primary-400` | `#60a5fa` | Decorative |
| `--color-primary-500` | `#3b82f6` | Focus rings, borders |
| `--color-primary-600` | `#2563eb` | Primary buttons, links |
| `--color-primary-700` | `#1d4ed8` | Hover state for primary |
| `--color-primary-800` | `#1e40af` | Active state for primary |
| `--color-primary-900` | `#1e3a8a` | Dark accents |

### Neutral (Gray)

| Variable | Hex | Usage |
|---|---|---|
| `--color-neutral-50` | `#f9fafb` | Page background |
| `--color-neutral-100` | `#f3f4f6` | Subtle surface, disabled bg |
| `--color-neutral-200` | `#e5e7eb` | Default borders, dividers |
| `--color-neutral-300` | `#d1d5db` | Strong borders, input borders |
| `--color-neutral-400` | `#9ca3af` | Disabled text, placeholders |
| `--color-neutral-500` | `#6b7280` | Tertiary text |
| `--color-neutral-600` | `#4b5563` | Secondary text, nav text |
| `--color-neutral-700` | `#374151` | Secondary text (darker) |
| `--color-neutral-800` | `#1f2937` | Dark text |
| `--color-neutral-900` | `#111827` | Primary text |

### Semantic Colors

| Variable | Hex | Usage |
|---|---|---|
| `--color-success-50` | `#f0fdf4` | Success background |
| `--color-success-500` | `#22c55e` | Success icon, border |
| `--color-success-700` | `#15803d` | Success text |
| `--color-warning-50` | `#fffbeb` | Warning background |
| `--color-warning-500` | `#f59e0b` | Warning icon, border |
| `--color-warning-700` | `#b45309` | Warning text |
| `--color-error-50` | `#fef2f2` | Error background |
| `--color-error-500` | `#ef4444` | Error icon, border |
| `--color-error-600` | `#dc2626` | Danger button bg (WCAG AA) |
| `--color-error-700` | `#b91c1c` | Error text |
| `--color-info-50` | `#eff6ff` | Info background |
| `--color-info-500` | `#3b82f6` | Info icon, border |
| `--color-info-700` | `#1d4ed8` | Info text |

---

## Typography Tokens

Defined in `app/styles/tokens/typography.css`.

### Font Families

| Variable | Value | Usage |
|---|---|---|
| `--font-family-sans` | Inter, system-ui, sans-serif | All UI text |
| `--font-family-mono` | JetBrains Mono, Fira Code, monospace | Code, phone numbers |

### Font Sizes

| Variable | Value (px) | Usage |
|---|---|---|
| `--font-size-h1` | `2rem` (32px) | Page titles |
| `--font-size-h2` | `1.5rem` (24px) | Section headings |
| `--font-size-h3` | `1.25rem` (20px) | Card headings |
| `--font-size-h4` | `1.125rem` (18px) | Sub-headings |
| `--font-size-body` | `1rem` (16px) | Body text |
| `--font-size-small` | `0.875rem` (14px) | Labels, captions |
| `--font-size-xs` | `0.75rem` (12px) | Badges, timestamps |

### Font Weights

| Variable | Value | Usage |
|---|---|---|
| `--font-weight-regular` | `400` | Body text |
| `--font-weight-medium` | `500` | Labels, nav items |
| `--font-weight-semibold` | `600` | Headings, button text |
| `--font-weight-bold` | `700` | Strong emphasis |

### Line Heights

| Variable | Value | Usage |
|---|---|---|
| `--line-height-tight` | `1.25` | Headings |
| `--line-height-snug` | `1.375` | Sub-headings |
| `--line-height-normal` | `1.5` | Body text (default) |
| `--line-height-relaxed` | `1.625` | Long-form text |
| `--line-height-loose` | `2` | Spacious layouts |

### Letter Spacing

| Variable | Value | Usage |
|---|---|---|
| `--letter-spacing-tight` | `-0.025em` | Large headings |
| `--letter-spacing-normal` | `0em` | Body text |
| `--letter-spacing-wide` | `0.025em` | Small caps, labels |
| `--letter-spacing-wider` | `0.05em` | Uppercase labels |
| `--letter-spacing-widest` | `0.1em` | All-caps text |

**Example:**

```css
.pageTitle {
  font-size: var(--font-size-h1);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
  letter-spacing: var(--letter-spacing-tight);
  color: var(--color-text-primary);
}

.bodyText {
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-regular);
  line-height: var(--line-height-normal);
  color: var(--color-text-secondary);
}
```

---

## Spacing Tokens

Defined in `app/styles/tokens/spacing.css`. Based on multiples of 8px.

| Variable | Value | Multiplier |
|---|---|---|
| `--spacing-0` | `0px` | — |
| `--spacing-1` | `4px` | 0.5× |
| `--spacing-2` | `8px` | 1× |
| `--spacing-3` | `12px` | 1.5× |
| `--spacing-4` | `16px` | 2× |
| `--spacing-6` | `24px` | 3× |
| `--spacing-8` | `32px` | 4× |
| `--spacing-10` | `40px` | 5× |
| `--spacing-12` | `48px` | 6× |
| `--spacing-16` | `64px` | 8× |
| `--spacing-20` | `80px` | 10× |
| `--spacing-24` | `96px` | 12× |

**Example:**

```css
.card {
  padding: var(--spacing-6);        /* 24px */
  gap: var(--spacing-4);            /* 16px */
  margin-bottom: var(--spacing-8);  /* 32px */
}
```

---

## Shadow Tokens

Defined in `app/styles/tokens/shadows.css`. Four elevation levels.

| Variable | Usage |
|---|---|
| `--shadow-none` | Flat elements, no elevation |
| `--shadow-sm` | Cards and inputs at rest |
| `--shadow-md` | Cards on hover, dropdowns |
| `--shadow-lg` | Modals, popovers |
| `--shadow-xl` | Drawers, full-screen overlays |

**Example:**

```css
.card {
  box-shadow: var(--shadow-sm);
  transition: box-shadow var(--duration-fast) var(--easing-out);
}

.card:hover {
  box-shadow: var(--shadow-md);
}
```

---

## Border Tokens

Defined in `app/styles/tokens/borders.css`.

| Variable | Value | Usage |
|---|---|---|
| `--radius-none` | `0px` | Sharp corners (tables, dividers) |
| `--radius-sm` | `4px` | Inputs, badges, small elements |
| `--radius-md` | `8px` | Buttons, cards |
| `--radius-lg` | `12px` | Modals, panels, large cards |
| `--radius-full` | `9999px` | Pills, avatars, circular buttons |

**Example:**

```css
.button {
  border-radius: var(--radius-md);
}

.badge {
  border-radius: var(--radius-full);
}

.modal {
  border-radius: var(--radius-lg);
}
```

---

## Animation Tokens

Defined in `app/styles/tokens/animations.css`. Automatically respects `prefers-reduced-motion`.

### Durations

| Variable | Value | Usage |
|---|---|---|
| `--duration-fast` | `150ms` | Hover color changes, micro-interactions |
| `--duration-normal` | `300ms` | Element appearance, state changes |
| `--duration-slow` | `500ms` | Modals, complex entrance animations |

### Easing Functions

| Variable | Curve | Usage |
|---|---|---|
| `--easing-in-out` | `cubic-bezier(0.4, 0, 0.2, 1)` | General movement |
| `--easing-out` | `cubic-bezier(0, 0, 0.2, 1)` | Elements entering the view |
| `--easing-in` | `cubic-bezier(0.4, 0, 1, 1)` | Elements leaving the view |

### Reduced Motion

When the user has `prefers-reduced-motion: reduce` set, all duration tokens are automatically set to `1ms`, effectively disabling animations without breaking state transitions. No extra code needed in components.

**Example:**

```css
.button {
  transition:
    background-color var(--duration-fast) var(--easing-out),
    box-shadow var(--duration-fast) var(--easing-out);
}

.modal {
  animation: fadeIn var(--duration-normal) var(--easing-out);
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to   { opacity: 1; transform: scale(1); }
}
```

---

## Theme Variables

`app/styles/themes/light.css` maps raw tokens to semantic roles. Use these in components instead of raw tokens whenever possible.

### Text

| Variable | Maps to | Hex |
|---|---|---|
| `--color-text-primary` | `neutral-900` | `#111827` |
| `--color-text-secondary` | `neutral-700` | `#374151` |
| `--color-text-tertiary` | `neutral-500` | `#6b7280` |
| `--color-text-disabled` | `neutral-400` | `#9ca3af` |
| `--color-text-inverse` | white | `#ffffff` |
| `--color-text-on-primary` | white | `#ffffff` |

### Backgrounds

| Variable | Maps to | Hex |
|---|---|---|
| `--color-bg-base` | `neutral-50` | `#f9fafb` |
| `--color-bg-surface` | white | `#ffffff` |
| `--color-bg-elevated` | white | `#ffffff` |
| `--color-bg-subtle` | `neutral-100` | `#f3f4f6` |
| `--color-bg-muted` | `neutral-200` | `#e5e7eb` |
| `--color-bg-overlay` | `rgba(17,24,39,0.5)` | — |

### Borders

| Variable | Maps to | Hex |
|---|---|---|
| `--color-border-default` | `neutral-200` | `#e5e7eb` |
| `--color-border-strong` | `neutral-300` | `#d1d5db` |
| `--color-border-focus` | `primary-500` | `#3b82f6` |

### Buttons

| Variable | Hex | Notes |
|---|---|---|
| `--color-btn-primary-bg` | `#2563eb` | |
| `--color-btn-primary-bg-hover` | `#1d4ed8` | |
| `--color-btn-secondary-bg` | `#f3f4f6` | |
| `--color-btn-outline-text` | `#2563eb` | |
| `--color-btn-danger-bg` | `#dc2626` | WCAG AA: 4.83:1 with white |

### Inputs

| Variable | Notes |
|---|---|
| `--color-input-bg` | White |
| `--color-input-border` | `neutral-300` |
| `--color-input-border-focus` | `primary-500` |
| `--color-input-border-error` | `error-500` |
| `--color-input-placeholder` | `neutral-500` — WCAG AA: 4.83:1 |

### Semantic States

Each semantic state (success, warning, error, info) exposes four variables:

```
--color-{state}-bg      → light background
--color-{state}-border  → border / icon color
--color-{state}-text    → readable text color
--color-{state}-icon    → icon color
```

**Example:**

```css
.errorAlert {
  background: var(--color-error-bg);
  border: 1px solid var(--color-error-border);
  color: var(--color-error-text);
  border-radius: var(--radius-md);
  padding: var(--spacing-4);
}
```
