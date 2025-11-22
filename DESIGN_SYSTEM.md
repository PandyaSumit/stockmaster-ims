# 🎨 StockMaster IMS - Design System

## Overview
A clean, minimal, flat design system with solid colors, proper spacing, and full responsiveness across all devices.

---

## Design Principles

### ✅ Do's
- Use solid colors only (no gradients)
- Maintain consistent spacing (4px/8px grid system)
- Use soft shadows for depth
- Ensure high contrast (WCAG 2.2 compliant)
- Keep animations subtle and purposeful
- Design mobile-first, then scale up

### ❌ Don'ts
- No gradients anywhere
- No glassmorphism effects
- No heavy shadows or glows
- No excessive animations
- No inconsistent spacing

---

## Color Palette

### Primary (Indigo)
```
50:  #eef2ff - Lightest tint
100: #e0e7ff
200: #c7d2fe
300: #a5b4fc
400: #818cf8
500: #6366f1 ← Main brand color
600: #4f46e5 ← Primary buttons
700: #4338ca
800: #3730a3
900: #312e81 - Darkest shade
```

### Success (Green)
```
500: #10b981 ← Main success color
600: #059669
```

### Warning (Amber)
```
500: #f59e0b ← Main warning color
600: #d97706
```

### Error (Red)
```
500: #ef4444 ← Main error color
600: #dc2626
```

### Neutral (Gray Scale)
```
Light Mode Backgrounds:
- White: #ffffff
- Gray 50: #f9fafb (page background)
- Gray 100: #f3f4f6 (subtle backgrounds)
- Gray 200: #e5e7eb (borders)
- Gray 300: #d1d5db (disabled states)

Dark Mode Backgrounds:
- Gray 900: #111827 (page background)
- Gray 800: #1f2937 (cards)
- Gray 700: #374151 (hover states)
- Gray 600: #4b5563 (borders)
```

---

## Typography

### Font Family
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
  'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
```

### Font Sizes
```
text-xs:   12px / 0.75rem
text-sm:   14px / 0.875rem  ← Helper text, labels
text-base: 16px / 1rem      ← Body text, buttons
text-lg:   18px / 1.125rem  ← Section titles
text-xl:   20px / 1.25rem
text-2xl:  24px / 1.5rem    ← Page titles
text-3xl:  30px / 1.875rem
```

### Font Weights
```
font-normal:   400 - Body text
font-medium:   500 - Labels
font-semibold: 600 - Buttons, emphasis
font-bold:     700 - Headings
```

---

## Spacing System

### Grid System
All spacing uses 4px base unit (Tailwind's default):
```
0:  0px
1:  4px    (0.25rem)
2:  8px    (0.5rem)  ← Tight spacing
3:  12px   (0.75rem)
4:  16px   (1rem)    ← Default spacing
5:  20px   (1.25rem)
6:  24px   (1.5rem)  ← Section spacing
8:  32px   (2rem)    ← Large gaps
10: 40px   (2.5rem)
12: 48px   (3rem)
16: 64px   (4rem)
```

### Common Patterns
```css
/* Form field spacing */
gap-y-4 (16px between fields)

/* Section spacing */
gap-y-6 (24px between sections)

/* Page margins */
p-4 sm:p-6 lg:p-8 (responsive padding)
```

---

## Shadows

### Elevation Levels
```css
/* Minimal shadow - for inputs */
shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.05)

/* Soft shadow - for buttons */
shadow-sm: shadow

/* Medium shadow - cards */
shadow-soft: 0 2px 8px rgba(0, 0, 0, 0.08)

/* Large shadows - modals */
shadow-soft-md: 0 4px 12px rgba(0, 0, 0, 0.1)
shadow-soft-lg: 0 8px 24px rgba(0, 0, 0, 0.12)
shadow-soft-xl: 0 12px 32px rgba(0, 0, 0, 0.15)
```

---

## Border Radius

```css
rounded-sm:  6px  - Small elements
rounded:     8px  - Default (buttons, inputs)
rounded-md:  10px
rounded-lg:  12px - Cards
rounded-xl:  16px - Large cards
rounded-2xl: 20px - Page containers
rounded-full: 9999px - Pills, avatars
```

---

## Components

### Buttons

#### Variants
```css
/* Primary */
bg-primary-600 text-white
hover:bg-primary-700
active:bg-primary-800
focus:ring-4 focus:ring-primary-500/30
shadow-sm hover:shadow-soft-md

/* Secondary */
bg-gray-200 dark:bg-gray-700
text-gray-900 dark:text-gray-100
hover:bg-gray-300 dark:hover:bg-gray-600
active:bg-gray-400 dark:active:bg-gray-500

/* Outline */
border-2 border-primary-600
text-primary-600
hover:bg-primary-50
active:bg-primary-100

/* Ghost */
text-gray-700 dark:text-gray-300
hover:bg-gray-100 dark:hover:bg-gray-800
active:bg-gray-200 dark:active:bg-gray-700

/* Danger */
bg-error-600 text-white
hover:bg-error-700
active:bg-error-800
```

#### Sizes
```css
Small:  px-3  py-2    text-sm
Medium: px-4  py-2.5  text-base (default)
Large:  px-6  py-3    text-base
```

### Input Fields

```css
/* Base styles */
px-4 py-2.5
rounded-lg
border-2 border-gray-300 dark:border-gray-600
bg-white dark:bg-gray-800
shadow-xs

/* Focus state */
focus:border-primary-500
focus:ring-4 focus:ring-primary-500/20

/* Error state */
border-error-500
focus:border-error-600
focus:ring-error-500/20

/* With icon */
pl-10 (left icon)
pr-10 (right icon)
```

### Cards

```css
/* Light mode */
bg-white
border border-gray-200
rounded-lg
shadow-soft

/* Dark mode */
dark:bg-gray-800
dark:border-gray-700

/* Interactive cards */
hover:shadow-soft-md
transition-shadow duration-200
```

### Checkboxes

```css
w-5 h-5
rounded
border-2 border-gray-300
checked:bg-primary-600
checked:border-primary-600
focus:ring-4 focus:ring-primary-500/20
```

---

## Responsive Breakpoints

```css
/* Mobile First Approach */
Base:    < 640px   - Mobile
sm:      640px+    - Large mobile / Small tablet
md:      768px+    - Tablet
lg:      1024px+   - Desktop
xl:      1280px+   - Large desktop
2xl:     1536px+   - Extra large desktop
```

### Common Responsive Patterns

```css
/* Container widths */
w-full max-w-md      - Auth pages (28rem / 448px)
w-full max-w-7xl     - Dashboard (80rem / 1280px)

/* Padding */
p-4 sm:p-6 lg:p-8

/* Grid layouts */
grid-cols-1 md:grid-cols-2 lg:grid-cols-4

/* Text sizes */
text-2xl sm:text-3xl lg:text-4xl

/* Spacing */
gap-4 md:gap-6 lg:gap-8
```

---

## Page Layouts

### Authentication Pages (Login, SignUp, etc.)

```css
/* Container */
min-h-screen
flex items-center justify-center
p-4
bg-gray-50 dark:bg-gray-900

/* Card */
w-full max-w-md
bg-white dark:bg-gray-800
rounded-lg
shadow-soft-lg
border border-gray-200 dark:border-gray-700
p-6 sm:p-8

/* Form spacing */
space-y-4 (between fields)
space-y-6 (between sections)
```

### Dashboard Layout

```css
/* Page wrapper */
min-h-screen
bg-gray-50 dark:bg-gray-900

/* Header (sticky) */
sticky top-0 z-50
bg-white dark:bg-gray-800
border-b border-gray-200 dark:border-gray-700
shadow-xs

/* Content */
max-w-7xl mx-auto
px-4 sm:px-6 lg:px-8
py-6 lg:py-8
```

---

## Animations

### Duration
```css
transition-all duration-200  - Default
transition-all duration-300  - Slower transitions
```

### Effects
```css
/* Hover scale */
hover:scale-105 - Subtle (cards)
hover:scale-101 - Very subtle (buttons)

/* Focus ring */
focus:ring-4 focus:ring-{color}-500/30

/* Opacity */
hover:opacity-80 - Hover state
disabled:opacity-50 - Disabled state
```

---

## Accessibility (WCAG 2.2)

### Contrast Ratios
```
Normal text (< 18px):     4.5:1 minimum
Large text (≥ 18px):      3:1 minimum
UI components:            3:1 minimum
```

### Color Contrast Compliance

✅ **Passing combinations:**
```
Primary-600 on White: 6.8:1 ✓
Gray-900 on White: 16.7:1 ✓
White on Primary-600: 6.8:1 ✓
Error-600 on White: 5.4:1 ✓
Success-600 on White: 4.5:1 ✓
```

### Focus States
- All interactive elements must have visible focus indicators
- Use `focus:ring-4` with 30% opacity color
- Never remove outline without replacement

---

## Dark Mode

### Implementation
```typescript
// Using class-based dark mode
<html class="dark">

// Tailwind config
darkMode: 'class'
```

### Color Mapping
```css
/* Backgrounds */
bg-white           → dark:bg-gray-900
bg-gray-50         → dark:bg-gray-800
bg-gray-100        → dark:bg-gray-700

/* Text */
text-gray-900      → dark:text-gray-100
text-gray-700      → dark:text-gray-300
text-gray-500      → dark:text-gray-400

/* Borders */
border-gray-200    → dark:border-gray-700
border-gray-300    → dark:border-gray-600
```

---

## Icon Usage

### Icon Library
**Lucide React** - Consistent, simple line icons

### Sizes
```
w-4 h-4  - Small (inline text)
w-5 h-5  - Medium (buttons, inputs)
w-6 h-6  - Large (page headers)
w-8 h-8  - Extra large (hero sections)
```

### Colors
```css
text-gray-400 dark:text-gray-500  - Default icons
text-primary-600 dark:text-primary-400 - Active/selected
```

---

## Code Examples

### Button Usage
```tsx
<Button variant="primary" size="md" fullWidth>
  Sign In
</Button>

<Button variant="outline" leftIcon={<LogOut />}>
  Logout
</Button>

<Button variant="danger" isLoading>
  Delete
</Button>
```

### Input Usage
```tsx
<Input
  label="Email Address"
  type="email"
  placeholder="your.email@example.com"
  leftIcon={<Mail className="w-5 h-5" />}
  error={errors.email?.message}
  helperText="We'll never share your email"
/>
```

### Card Pattern
```tsx
<div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft border border-gray-200 dark:border-gray-700 p-6">
  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
    Card Title
  </h3>
  <p className="text-gray-600 dark:text-gray-400">
    Card content goes here
  </p>
</div>
```

---

## Mobile Optimization

### Touch Targets
- Minimum 44x44px for all interactive elements
- Use `py-2.5` (10px) minimum for buttons
- Add generous spacing between touch targets

### Viewport
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

### Mobile-Specific Patterns
```css
/* Full-width buttons on mobile */
w-full sm:w-auto

/* Stack on mobile, row on desktop */
flex-col sm:flex-row

/* Hide on mobile */
hidden sm:block

/* Show only on mobile */
block sm:hidden
```

---

## Performance Considerations

### Image Optimization
- Use next/image or similar for automatic optimization
- Lazy load images below the fold
- Use appropriate formats (WebP with fallback)

### Animation Performance
- Use `transform` and `opacity` only (GPU accelerated)
- Avoid animating `width`, `height`, `top`, `left`
- Use `will-change` sparingly

---

## Quality Checklist

Before deployment, verify:

- [ ] All colors pass WCAG 2.2 contrast ratios
- [ ] Dark mode works correctly on all pages
- [ ] All interactive elements have focus states
- [ ] Touch targets are minimum 44x44px
- [ ] Layout works on mobile (375px), tablet (768px), desktop (1280px)
- [ ] No gradients present anywhere
- [ ] Consistent spacing throughout
- [ ] All buttons use defined variants
- [ ] All text uses defined font sizes
- [ ] Shadows are soft and consistent

---

**Design System Version:** 2.0
**Last Updated:** 2024
**Status:** Production Ready
