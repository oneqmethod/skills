---
name: component-selector
description: This skill should be used when the user asks to "add shadcn components", "find UI components", "build a dashboard", "create a form", "add a sidebar", "search shadcn registry", "install shadcn", "what shadcn components", or mentions shadcn, radix, component library selection for React/Next.js projects, or needs help choosing UI components.
version: 1.0.0
---

# Shadcn Component Selector

Token-efficient component selection using code-mode scripts that wrap the shadcn MCP server.

## Overview

Execute TypeScript scripts via Bash instead of calling MCP tools directly. Scripts communicate with the shadcn MCP server via JSON-RPC over stdio, filter results locally, and return only relevant information. This reduces token usage by ~98%.

## When to Use

- Building React/Next.js interfaces
- Selecting components from shadcn/ui registry
- Finding pre-built blocks (dashboards, auth, sidebars)
- Getting component implementation examples
- Installing multiple related components

## Registry Structure

| Type | Count | Description |
|------|-------|-------------|
| ui | ~55 | Core primitives: button, card, dialog, form, input, table |
| block | ~180 | Pre-built features: dashboard-*, sidebar-*, login-*, calendar-* |
| example | ~200 | Demo implementations: *-demo, *-with-* |
| theme | 5 | Color schemes |
| hook | 1 | use-mobile |

## Two Workflows

### Workflow 1: Feature-Driven Selection

Start from a feature requirement, find matching components.

1. **Identify need**: User describes feature (e.g., "user authentication page")
2. **Search registry**: `npx tsx ${CLAUDE_PLUGIN_ROOT}/skills/component-selector/scripts/search.ts "login form"`
3. **Review results**: See matching blocks (login-01 through login-05) with details
4. **Get examples**: `npx tsx ${CLAUDE_PLUGIN_ROOT}/skills/component-selector/scripts/examples.ts "login-01"`
5. **Install**: `npx tsx ${CLAUDE_PLUGIN_ROOT}/skills/component-selector/scripts/add.ts login-01`
6. **Verify**: `npx tsx ${CLAUDE_PLUGIN_ROOT}/skills/component-selector/scripts/audit.ts`

### Workflow 2: Component Discovery

Explore available components to understand options.

1. **Browse by type**: `npx tsx ${CLAUDE_PLUGIN_ROOT}/skills/component-selector/scripts/list.ts --type ui`
2. **Browse blocks**: `npx tsx ${CLAUDE_PLUGIN_ROOT}/skills/component-selector/scripts/list.ts --type block`
3. **Search specific**: `npx tsx ${CLAUDE_PLUGIN_ROOT}/skills/component-selector/scripts/search.ts "calendar"`
4. **View examples**: Get code before deciding to install

## Script Reference

All scripts are in `${CLAUDE_PLUGIN_ROOT}/skills/component-selector/scripts/`.

### search.ts - Search Components

Search registry with optional type filter. Auto-fetches details for top 5 results.

```bash
npx tsx search.ts "form validation"
npx tsx search.ts "sidebar" --type block
npx tsx search.ts "calendar" --limit 20
```

**Output**: Consolidated results with dependencies, file counts, grouped by type.

### list.ts - Browse Registry

List and paginate registry items by type.

```bash
npx tsx list.ts                    # All types
npx tsx list.ts --type ui          # Core components only
npx tsx list.ts --type block       # Pre-built features only
npx tsx list.ts --offset 50        # Page 2
```

**Output**: Items grouped by type with counts, pagination hints.

### examples.ts - Get Usage Examples

Fetch complete TSX code with imports for component demos.

```bash
npx tsx examples.ts "button-demo"
npx tsx examples.ts "form-rhf-demo"
npx tsx examples.ts "card-with-form"
```

**Output**: Full implementation code with highlighted imports.

### add.ts - Generate Install Command

Create `npx shadcn add` command for one or more components.

```bash
npx tsx add.ts button card
npx tsx add.ts sidebar-01 dashboard-01
npx tsx add.ts form field input button
```

**Output**: Ready-to-run install command.

### audit.ts - Post-Install Checklist

Verification checklist after adding components.

```bash
npx tsx audit.ts
```

**Output**: Checklist for imports, dependencies, TypeScript, Tailwind.

## Quick Examples

### Dashboard with Sidebar

```bash
npx tsx search.ts "dashboard"
# Review: dashboard-01, sidebar-01, chart, card

npx tsx add.ts dashboard-01 sidebar-01
```

### Authentication Flow

```bash
npx tsx search.ts "login"
# Review: login-01 through login-05, signup-*, otp-*

npx tsx add.ts login-01 signup-01
```

### Form with Validation

```bash
npx tsx search.ts "form"
# Review: form, field, input types

npx tsx examples.ts "form-rhf-demo"
# Review: react-hook-form integration pattern

npx tsx add.ts form field input button
```

### Data Table

```bash
npx tsx search.ts "table"
# Review: table, pagination, dropdown-menu

npx tsx add.ts table pagination
```

## Prerequisites

Before adding components, ensure project has:

1. **components.json**: Run `npx shadcn@latest init` if missing
2. **Tailwind CSS**: Configured in tailwind.config.js
3. **cn() utility**: Available at @/lib/utils.ts
4. **Path aliases**: tsconfig.json has @/* paths configured

## Common Issues

| Issue | Solution |
|-------|----------|
| Import errors | Check named vs default exports in component files |
| Missing cn() | Create lib/utils.ts with clsx + tailwind-merge |
| Tailwind not working | Add component paths to tailwind.config content[] |
| TypeScript errors | Install @radix-ui/* peer dependencies |

## Additional Resources

For detailed component combinations and feature mappings:

- **`references/feature-patterns.md`** - Feature requirements to component selection
- **`references/component-combinations.md`** - Common component pairings

## Token Efficiency

| Approach | Tokens | Notes |
|----------|--------|-------|
| Direct MCP tools | ~150,000 | All tool definitions loaded |
| Code-mode scripts | ~2,000 | Only script output in context |
| **Savings** | **98.7%** | Scripts execute without context load |

Scripts wrap MCP tools via JSON-RPC, filter results locally, return only actionable information.
