# Feature to Component Patterns

Map common features to recommended shadcn/ui components.

## Authentication

### Login Page
- **Primary**: `login-01` through `login-05` (pre-built blocks)
- **Components**: form, input, button, card, label
- **Variants**: login-02 (split layout), login-03 (minimal), login-04 (with social)

### Signup Flow
- **Primary**: `signup-01` through `signup-04`
- **Components**: form, input, button, checkbox (terms), card
- **With verification**: Add `otp-01` or `otp-02` for OTP input

### Password Reset
- **Components**: form, input, button, card
- **Pattern**: Two-step (email → new password)

## Dashboard & Admin

### Main Dashboard
- **Primary**: `dashboard-01` through `dashboard-07`
- **Components**: card, chart, table, sidebar
- **dashboard-01**: Full featured with sidebar + charts
- **dashboard-05**: Minimal stats layout

### Sidebar Navigation
- **Primary**: `sidebar-01` through `sidebar-15`
- **Components**: sidebar, navigation-menu, collapsible
- **sidebar-01**: Simple nav
- **sidebar-07**: With user dropdown
- **sidebar-10**: Collapsible groups

### Data Tables
- **Components**: table, pagination, dropdown-menu, checkbox
- **With actions**: Add context-menu for row actions
- **With filters**: Add popover + select for column filters

## Forms

### Contact/Feedback
- **Components**: form, input, textarea, button, label
- **With validation**: Use react-hook-form pattern (form-rhf-demo)

### Settings Page
- **Components**: tabs, form, switch, select, separator
- **Pattern**: Tabbed sections for different settings groups

### Multi-step Wizard
- **Components**: form, button, progress, card
- **Pattern**: Card per step with progress indicator

## Content Display

### Article/Blog
- **Components**: card, badge, avatar, separator
- **With comments**: Add textarea, button for comment form

### Product Cards
- **Components**: card, badge, button, aspect-ratio
- **Pattern**: Grid layout with card per product

### Profile Page
- **Components**: avatar, card, tabs, badge, separator
- **Pattern**: Header card + tabbed content sections

## Navigation

### Top Navbar
- **Components**: navigation-menu, dropdown-menu, avatar
- **With search**: Add command (⌘K) for search palette

### Breadcrumbs
- **Components**: breadcrumb
- **Pattern**: Page path with clickable segments

### Command Palette
- **Primary**: command
- **Pattern**: ⌘K triggered search/action menu

## Feedback & Dialogs

### Confirmations
- **Components**: alert-dialog
- **Pattern**: Destructive actions with confirm/cancel

### Notifications
- **Components**: sonner (toast), alert
- **Pattern**: sonner for transient, alert for persistent

### Modal Forms
- **Components**: dialog, form, input, button
- **Pattern**: Sheet for mobile, dialog for desktop

## Scheduling & Dates

### Calendar Views
- **Primary**: `calendar-01` through `calendar-32`
- **Components**: calendar, popover, button
- **calendar-01**: Basic month view
- **calendar-15**: Date range picker
- **calendar-25**: Week view

### Date Picker
- **Components**: popover, calendar, button
- **Pattern**: Button trigger → popover with calendar

## Charts & Data Viz

### Chart Types
- **Primary**: `chart-area-*`, `chart-bar-*`, `chart-line-*`, `chart-pie-*`
- **Components**: chart (wraps Recharts)
- **Pattern**: Card wrapper with chart + legend

## E-commerce

### Product Listing
- **Components**: card, badge, button, pagination
- **Pattern**: Grid of product cards with filters

### Shopping Cart
- **Components**: sheet, table, button, separator
- **Pattern**: Sheet slide-out with item list

### Checkout
- **Components**: form, input, card, separator, button
- **Pattern**: Multi-section form in cards

## Search Patterns

To find components for a feature:

```bash
# Authentication
bun search.ts "login"
bun search.ts "signup"
bun search.ts "otp"

# Dashboard
bun search.ts "dashboard"
bun search.ts "sidebar"
bun search.ts "chart"

# Forms
bun search.ts "form"
bun examples.ts "form-rhf-demo"

# Calendar
bun search.ts "calendar"
bun search.ts "date picker"
```
