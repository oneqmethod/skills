---
name: frontend-design
description: This skill should be used when the user asks to "design a UI component", "create a layout", "style this component", "generate a color palette", "design a landing page", "create a design system", "make this look better", "improve the UI", "add responsive design", "fix the styling", "design a form", "create a navigation bar", "build a card component", "make it accessible", or wants help with frontend design, CSS styling, visual design, or UI/UX implementation.
version: 1.0.0
---

# Frontend Design

Create polished UI components, layouts, and design systems with modern CSS and accessibility best practices.

## When to Use

- User asks to design or style a UI component (button, card, form, nav, modal, etc.)
- User wants a color palette, typography system, or design tokens
- User needs a responsive layout or grid/flex system
- User wants a landing page, hero section, or marketing page
- User asks to improve existing UI or make something "look better"
- User needs accessible UI with ARIA, focus management, or contrast compliance
- User wants CSS animations, transitions, or micro-interactions
- User asks for a design system or component library foundation

## Workflow

1. **Understand context** - identify the component type, framework (React/Vue/HTML), and CSS approach (Tailwind/CSS Modules/vanilla)
2. **Choose design direction** - minimal, bold, playful, corporate, etc. based on user cues
3. **Apply design principles** - spacing scale, color contrast, typography hierarchy
4. **Generate the component** - clean, semantic HTML/JSX with well-structured CSS
5. **Ensure accessibility** - ARIA attributes, keyboard navigation, color contrast ratios
6. **Add responsive behavior** - mobile-first breakpoints where appropriate

## Design Principles

### Spacing Scale (8pt grid)
| Token | Value | Use |
|-------|-------|-----|
| `xs` | 4px | Tight spacing, icon gaps |
| `sm` | 8px | Inner padding small elements |
| `md` | 16px | Default component padding |
| `lg` | 24px | Section spacing |
| `xl` | 32px | Large section gaps |
| `2xl` | 48px | Page section spacing |
| `3xl` | 64px | Hero/feature spacing |

### Color Contrast Requirements (WCAG AA)
- Normal text: minimum 4.5:1 contrast ratio
- Large text (18px+ or 14px+ bold): minimum 3:1
- Interactive focus indicators: minimum 3:1 against adjacent colors
- Never rely on color alone to convey information

### Typography Hierarchy
- Use relative units (`rem`, `em`) not `px` for font sizes
- Line height: 1.4–1.6 for body, 1.1–1.3 for headings
- Limit to 2–3 typefaces; prefer system font stacks for performance
- Heading scale: h1 > h2 > h3 with clear visual distinction

### Component Patterns

**Interactive states** (always define all four):
- Default, Hover, Focus (visible ring), Active/Pressed, Disabled

**Focus management:**
- Visible focus indicator on all interactive elements
- Use `focus-visible` pseudo-class to hide ring on mouse click
- Trap focus in modals and dialogs

**Motion:**
- Respect `prefers-reduced-motion` media query
- Transitions: 150–300ms for micro-interactions, ease-in-out
- Avoid layout-triggering animations (prefer `transform`, `opacity`)

## Output Formats

### HTML + CSS
```html
<!-- Semantic, accessible markup with embedded or linked CSS -->
<button class="btn btn-primary" type="button">
  Label
</button>
```

### React + Tailwind
```jsx
export function Button({ children, variant = 'primary', disabled }) {
  return (
    <button
      className={`px-4 py-2 rounded-md font-medium transition-colors
        focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
        ${variant === 'primary' ? 'bg-blue-600 text-white hover:bg-blue-700' : ''}
        disabled:opacity-50 disabled:cursor-not-allowed`}
      disabled={disabled}
    >
      {children}
    </button>
  )
}
```

### CSS Custom Properties (Design Tokens)
```css
:root {
  --color-primary: #2563eb;
  --color-primary-hover: #1d4ed8;
  --color-surface: #ffffff;
  --color-text: #111827;
  --radius-md: 6px;
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
}
```

## Common Components

| Component | Key Considerations |
|-----------|-------------------|
| Button | States (hover/focus/disabled), loading state, icon support |
| Form inputs | Label association, error states, helper text, validation |
| Card | Hover elevation, clickable variant, image aspect ratio |
| Navigation | Mobile hamburger, active states, keyboard accessibility |
| Modal/Dialog | Focus trap, backdrop, escape key, scroll lock |
| Table | Responsive overflow, sortable headers, row hover |
| Badge/Tag | Color meaning with text label, dismissible variant |
| Toast/Alert | Role="alert", dismiss, auto-timeout animation |

## Accessibility Checklist

- [ ] All images have meaningful `alt` text (or `alt=""` for decorative)
- [ ] Interactive elements are keyboard-operable
- [ ] Focus order follows visual reading order
- [ ] Color contrast meets WCAG AA (4.5:1 for text)
- [ ] Form fields have associated `<label>` elements
- [ ] Error messages reference the field (`aria-describedby`)
- [ ] Modal/dialogs trap focus and restore on close
- [ ] Animated content respects `prefers-reduced-motion`

## Example Invocations

```
User: Design a primary button component in React with Tailwind
→ Generate button with all interactive states, focus ring, disabled, loading

User: Create a card component for a product listing
→ Generate card with image, title, price, CTA, hover effects

User: Give me a color palette for a SaaS dashboard
→ Generate primary, neutral, semantic (success/warning/error) palettes with hex values and CSS tokens

User: Make this form more accessible
→ Add labels, ARIA attributes, error messaging, focus management

User: Design a responsive navigation bar
→ Desktop nav + mobile hamburger menu with keyboard support
```
