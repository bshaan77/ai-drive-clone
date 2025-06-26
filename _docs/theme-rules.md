# Theme Rules: Google Drive Clone

This document defines the complete design system and theme specifications for the Google Drive clone, ensuring visual consistency across all components and interfaces.

## Design Inspiration

### **Primary References**

- **Notion**: Clean, minimal interface with subtle shadows and ample white space
- **Grammarly**: Professional, trustworthy appearance with clear typography
- **Google Drive**: Familiar file management patterns and interactions

### **Design Philosophy**

- **Minimalistic**: Content over decoration, purposeful design
- **Professional**: Trustworthy and reliable appearance
- **Accessible**: High contrast, clear hierarchy, inclusive design
- **Modern**: Contemporary aesthetics with timeless principles

## Color System

### **Primary Colors**

```css
/* Blue - Primary Brand Color */
--primary-50: #eff6ff --primary-100: #dbeafe --primary-200: #bfdbfe
  --primary-300: #93c5fd --primary-400: #60a5fa --primary-500: #3b82f6
  /* Main Primary */ --primary-600: #2563eb --primary-700: #1d4ed8
  --primary-800: #1e40af --primary-900: #1e3a8a --primary-950: #172554;
```

### **Neutral Colors**

```css
/* Gray - Neutral System */
--gray-50: #f8fafc --gray-100: #f1f5f9 --gray-200: #e2e8f0 --gray-300: #cbd5e1
  --gray-400: #94a3b8 --gray-500: #64748b --gray-600: #475569
  --gray-700: #334155 --gray-800: #1e293b --gray-900: #0f172a
  --gray-950: #020617;
```

### **Semantic Colors**

```css
/* Success - Green */
--success-50: #f0fdf4 --success-500: #10b981 --success-600: #059669
  --success-700: #047857 /* Warning - Amber */ --warning-50: #fffbeb
  --warning-500: #f59e0b --warning-600: #d97706 --warning-700: #b45309
  /* Error - Red */ --error-50: #fef2f2 --error-500: #ef4444
  --error-600: #dc2626 --error-700: #b91c1c /* Info - Blue */ --info-50: #eff6ff
  --info-500: #3b82f6 --info-600: #2563eb --info-700: #1d4ed8;
```

### **Background Colors**

```css
/* Light Theme */
--bg-primary: #ffffff --bg-secondary: #f8fafc --bg-tertiary: #f1f5f9
  --bg-elevated: #ffffff --bg-overlay: rgba(0, 0, 0, 0.5)
  /* Dark Theme (Future) */ --bg-primary-dark: #0f172a
  --bg-secondary-dark: #1e293b --bg-tertiary-dark: #334155
  --bg-elevated-dark: #1e293b --bg-overlay-dark: rgba(0, 0, 0, 0.7);
```

### **Text Colors**

```css
/* Light Theme */
--text-primary: #0f172a --text-secondary: #475569 --text-tertiary: #64748b
  --text-muted: #94a3b8 --text-inverse: #ffffff /* Dark Theme (Future) */
  --text-primary-dark: #f8fafc --text-secondary-dark: #cbd5e1
  --text-tertiary-dark: #94a3b8 --text-muted-dark: #64748b
  --text-inverse-dark: #0f172a;
```

## Typography System

### **Font Family**

```css
/* Primary Font - Inter */
--font-sans:
  "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
  sans-serif --font-mono: "JetBrains Mono", "Fira Code", "Monaco",
  "Cascadia Code", monospace;
```

### **Font Sizes**

```css
/* Scale: 1.25 (Major Third) */
--text-xs: 0.75rem /* 12px */ --text-sm: 0.875rem /* 14px */ --text-base: 1rem
  /* 16px */ --text-lg: 1.125rem /* 18px */ --text-xl: 1.25rem /* 20px */
  --text-2xl: 1.5rem /* 24px */ --text-3xl: 1.875rem /* 30px */
  --text-4xl: 2.25rem /* 36px */ --text-5xl: 3rem /* 48px */;
```

### **Font Weights**

```css
--font-light: 300 --font-normal: 400 --font-medium: 500 --font-semibold: 600
  --font-bold: 700 --font-extrabold: 800;
```

### **Line Heights**

```css
--leading-none: 1 --leading-tight: 1.25 --leading-snug: 1.375
  --leading-normal: 1.5 --leading-relaxed: 1.625 --leading-loose: 2;
```

## Spacing System

### **Spacing Scale**

```css
/* Scale: 0.25rem (4px) increments */
--space-0: 0rem /* 0px */ --space-1: 0.25rem /* 4px */ --space-2: 0.5rem
  /* 8px */ --space-3: 0.75rem /* 12px */ --space-4: 1rem /* 16px */
  --space-5: 1.25rem /* 20px */ --space-6: 1.5rem /* 24px */ --space-8: 2rem
  /* 32px */ --space-10: 2.5rem /* 40px */ --space-12: 3rem /* 48px */
  --space-16: 4rem /* 64px */ --space-20: 5rem /* 80px */ --space-24: 6rem
  /* 96px */ --space-32: 8rem /* 128px */;
```

## Border & Shadow System

### **Border Radius**

```css
--radius-none: 0 --radius-sm: 0.125rem /* 2px */ --radius-base: 0.25rem
  /* 4px */ --radius-md: 0.375rem /* 6px */ --radius-lg: 0.5rem /* 8px */
  --radius-xl: 0.75rem /* 12px */ --radius-2xl: 1rem /* 16px */
  --radius-full: 9999px;
```

### **Border Widths**

```css
--border-0: 0px --border: 1px --border-2: 2px --border-4: 4px --border-8: 8px;
```

### **Shadows**

```css
/* Subtle shadows for depth */
--shadow-xs:
  0 1px 2px 0 rgba(0, 0, 0, 0.05) --shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1),
  0 1px 2px 0 rgba(0, 0, 0, 0.06) --shadow-base: 0 4px 6px -1px
    rgba(0, 0, 0, 0.1),
  0 2px 4px -1px rgba(0, 0, 0, 0.06) --shadow-md: 0 10px 15px -3px
    rgba(0, 0, 0, 0.1),
  0 4px 6px -2px rgba(0, 0, 0, 0.05) --shadow-lg: 0 20px 25px -5px
    rgba(0, 0, 0, 0.1),
  0 10px 10px -5px rgba(0, 0, 0, 0.04) --shadow-xl: 0 25px 50px -12px
    rgba(0, 0, 0, 0.25);
```

## Component-Specific Styles

### **Buttons**

```css
/* Primary Button */
.btn-primary {
  background-color: var(--primary-600);
  color: var(--text-inverse);
  border-radius: var(--radius-md);
  padding: var(--space-3) var(--space-4);
  font-weight: var(--font-medium);
  transition: all 0.2s ease;
}

.btn-primary:hover {
  background-color: var(--primary-700);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

/* Secondary Button */
.btn-secondary {
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--gray-300);
  border-radius: var(--radius-md);
  padding: var(--space-3) var(--space-4);
  font-weight: var(--font-medium);
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background-color: var(--gray-100);
  border-color: var(--gray-400);
}
```

### **Cards**

```css
/* File/Folder Card */
.card {
  background-color: var(--bg-elevated);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  transition: all 0.2s ease;
  cursor: pointer;
}

.card:hover {
  border-color: var(--primary-300);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.card.selected {
  border-color: var(--primary-500);
  background-color: var(--primary-50);
}
```

### **Input Fields**

```css
/* Text Input */
.input {
  background-color: var(--bg-primary);
  border: 1px solid var(--gray-300);
  border-radius: var(--radius-md);
  padding: var(--space-3) var(--space-4);
  font-size: var(--text-base);
  transition: all 0.2s ease;
}

.input:focus {
  outline: none;
  border-color: var(--primary-500);
  box-shadow: 0 0 0 3px var(--primary-100);
}

.input.error {
  border-color: var(--error-500);
  box-shadow: 0 0 0 3px var(--error-100);
}
```

## Animation & Transition System

### **Duration Scale**

```css
--duration-75: 75ms --duration-100: 100ms --duration-150: 150ms
  --duration-200: 200ms --duration-300: 300ms --duration-500: 500ms
  --duration-700: 700ms --duration-1000: 1000ms;
```

### **Easing Functions**

```css
--ease-linear: linear --ease-in: cubic-bezier(0.4, 0, 1, 1)
  --ease-out: cubic-bezier(0, 0, 0.2, 1)
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
```

### **Common Transitions**

```css
/* Hover transitions */
.transition-hover {
  transition: all var(--duration-200) var(--ease-out);
}

/* Focus transitions */
.transition-focus {
  transition: all var(--duration-150) var(--ease-out);
}

/* Page transitions */
.transition-page {
  transition: opacity var(--duration-300) var(--ease-in-out);
}
```

## Icon System

### **Icon Sizes**

```css
--icon-xs: 12px --icon-sm: 16px --icon-md: 20px --icon-lg: 24px --icon-xl: 32px
  --icon-2xl: 48px;
```

### **Icon Colors**

```css
/* Default icon colors */
--icon-primary: var(--text-primary) --icon-secondary: var(--text-secondary)
  --icon-muted: var(--text-muted) --icon-accent: var(--primary-600)
  --icon-success: var(--success-600) --icon-warning: var(--warning-600)
  --icon-error: var(--error-600);
```

## Responsive Design Tokens

### **Breakpoints**

```css
--breakpoint-sm: 640px --breakpoint-md: 768px --breakpoint-lg: 1024px
  --breakpoint-xl: 1280px --breakpoint-2xl: 1536px;
```

### **Container Max Widths**

```css
--container-sm: 640px --container-md: 768px --container-lg: 1024px
  --container-xl: 1280px --container-2xl: 1536px;
```

## Implementation with Tailwind CSS

### **Tailwind Configuration**

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eff6ff",
          100: "#dbeafe",
          // ... rest of primary colors
        },
        gray: {
          50: "#f8fafc",
          100: "#f1f5f9",
          // ... rest of gray colors
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      spacing: {
        // Custom spacing if needed
      },
      borderRadius: {
        // Custom border radius if needed
      },
      boxShadow: {
        // Custom shadows if needed
      },
    },
  },
};
```

### **CSS Custom Properties**

```css
/* globals.css */
:root {
  /* Color tokens */
  --primary-50: #eff6ff;
  --primary-100: #dbeafe;
  /* ... all color tokens */

  /* Typography tokens */
  --font-sans: "Inter", system-ui, sans-serif;
  --text-xs: 0.75rem;
  /* ... all typography tokens */

  /* Spacing tokens */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  /* ... all spacing tokens */
}
```

## Usage Guidelines

### **Color Usage Rules**

1. **Primary Blue**: Use for main actions, links, and brand elements
2. **Neutral Grays**: Use for text, borders, and backgrounds
3. **Semantic Colors**: Use sparingly for status indicators and feedback
4. **Contrast**: Always ensure 4.5:1 contrast ratio for text

### **Typography Rules**

1. **Headings**: Use Inter with appropriate weights (600-700)
2. **Body Text**: Use Inter Regular (400) for readability
3. **Code**: Use JetBrains Mono for code snippets
4. **Line Height**: Use 1.5 for body text, 1.25 for headings

### **Spacing Rules**

1. **Consistency**: Use the spacing scale consistently
2. **Hierarchy**: Use larger spacing for major sections
3. **Density**: Balance information density with readability
4. **Responsive**: Adjust spacing for different screen sizes

### **Component Rules**

1. **Consistency**: Use consistent styling across similar components
2. **Accessibility**: Ensure proper contrast and focus states
3. **Performance**: Use efficient CSS properties for animations
4. **Maintainability**: Use design tokens for easy updates
