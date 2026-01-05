# Component Combinations

Common component pairings and their use cases.

## Form Building

### Basic Form
```
form + input + button + label
```
Minimum set for any form. Form wraps react-hook-form.

### Form with Validation
```
form + field + input + button + label
```
Field component handles error display.

### Form with Select
```
form + select + button + label
```
Native-feeling dropdowns with Radix.

### Form with Checkbox/Switch
```
form + checkbox + switch + label
```
Binary options: checkbox for multi-select, switch for toggles.

### Form with Date
```
form + popover + calendar + button
```
Date picker pattern using popover trigger.

## Navigation

### Sidebar + Content
```
sidebar + separator + scroll-area
```
App shell with collapsible sidebar.

### Top Nav
```
navigation-menu + dropdown-menu + avatar + button
```
Horizontal nav with user menu.

### Breadcrumb Trail
```
breadcrumb + separator
```
Page hierarchy indicator.

### Tab Navigation
```
tabs + separator
```
In-page section switching.

## Data Display

### Data Table
```
table + pagination + checkbox + dropdown-menu
```
Full-featured table with selection and row actions.

### Card Grid
```
card + badge + button + aspect-ratio
```
Grid of content cards (products, articles).

### List with Actions
```
card + button + dropdown-menu + separator
```
Vertical list items with action menus.

## Dialogs & Overlays

### Confirmation Dialog
```
alert-dialog + button
```
Destructive action confirmation.

### Form Modal
```
dialog + form + input + button
```
Modal with embedded form.

### Side Panel
```
sheet + form + button + separator
```
Slide-out panel for editing.

### Dropdown Actions
```
dropdown-menu + button
```
Context menus for items.

## Feedback

### Toast Notifications
```
sonner + button
```
Transient success/error messages.

### Alert Banner
```
alert + button
```
Persistent page-level messages.

### Loading States
```
skeleton + spinner
```
Content placeholders during load.

### Progress Indicator
```
progress + badge
```
Operation progress display.

## Layout

### Page Header
```
card + badge + button + separator
```
Title area with actions.

### Stats Cards
```
card + badge
```
Metric display widgets.

### Split Layout
```
resizable + separator
```
Adjustable panel layout.

### Accordion Sections
```
accordion + separator
```
Collapsible content sections.

## User Interface

### User Menu
```
dropdown-menu + avatar + separator
```
Account/settings dropdown.

### Command Palette
```
command + dialog
```
⌘K search and action interface.

### Context Menu
```
context-menu
```
Right-click actions on elements.

### Hover Info
```
hover-card + avatar
```
Popover on hover for details.

## Installation Groups

### Starter Set
```bash
bun add.ts button card input label form
```
Minimum for most projects.

### Dashboard Starter
```bash
bun add.ts sidebar card chart table pagination
```
Admin dashboard foundation.

### Auth Starter
```bash
bun add.ts form input button card label
bun add.ts login-01 signup-01
```
Authentication pages.

### Form Builder
```bash
bun add.ts form field input select checkbox switch textarea button label
```
Complete form toolkit.

### Dialog Kit
```bash
bun add.ts dialog alert-dialog sheet popover
```
All overlay components.

## Dependency Chains

Some components require others:

| Component | Requires |
|-----------|----------|
| form | button, label (typically) |
| calendar | button, popover (for picker) |
| command | dialog (for palette mode) |
| data-table | table, checkbox, dropdown-menu |
| sidebar | button, separator, scroll-area |

## Anti-Patterns

Avoid these combinations:

| Avoid | Reason | Use Instead |
|-------|--------|-------------|
| dialog + sheet | Overlapping overlays | Pick one based on content |
| multiple sonner | Toast spam | Batch notifications |
| nested dropdowns | UX confusion | Flat menu with sections |
| form without field | No error display | Always use field wrapper |
