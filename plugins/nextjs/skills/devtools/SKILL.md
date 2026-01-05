---
name: devtools
description: This skill should be used when the user asks to "debug Next.js", "check Next.js errors", "list routes", "upgrade to Next.js 16", "enable cache components", "search Next.js docs", "fix compilation errors", or mentions Next.js development, server components, app router issues, or needs help with Next.js 16 migration.
version: 1.0.0
---

# Next.js DevTools

Token-efficient Next.js development using code-mode scripts that wrap the Next.js DevTools MCP server.

## Overview

Execute TypeScript scripts via Bash instead of calling MCP tools directly. Scripts communicate with the Next.js MCP server via JSON-RPC over stdio, filter results locally, and return only relevant information. This reduces token usage by ~98%.

## When to Use

- Debugging Next.js compilation/runtime errors
- Exploring available routes in a Next.js app
- Upgrading to Next.js 16
- Enabling Cache Components
- Searching Next.js documentation
- Diagnosing dev server issues

## Requirements

- **Next.js 16+** for dev server MCP features
- **Node.js 18+** for script execution
- **npx tsx** auto-installs on first run

## Script Reference

All scripts are in `${CLAUDE_PLUGIN_ROOT}/skills/devtools/scripts/`.

### init.ts - Initialize Context

Initialize the DevTools context and get usage guidance.

```bash
npx tsx init.ts
npx tsx init.ts --index    # Also fetch docs index
```

### docs.ts - Search/Fetch Documentation

Search or fetch Next.js official documentation.

```bash
npx tsx docs.ts search "server components"
npx tsx docs.ts search "api routes" --router pages
npx tsx docs.ts get "/docs/app/building-your-application/routing"
```

### index.ts - Discover Dev Servers

Find running Next.js dev servers and list available MCP tools.

```bash
npx tsx index.ts
npx tsx index.ts --port 3000
```

### call.ts - Generic Tool Caller

Call any MCP tool on a running dev server.

```bash
npx tsx call.ts 3000 get_errors
npx tsx call.ts 3000 list_routes
npx tsx call.ts 3000 clear_cache '{"type":"full"}'
```

### errors.ts - Get Errors (Shortcut)

Get compilation and runtime errors from dev server.

```bash
npx tsx errors.ts 3000
npx tsx errors.ts 3000 --type compile
npx tsx errors.ts 3000 --type runtime
```

### routes.ts - List Routes (Shortcut)

List all routes in the Next.js app.

```bash
npx tsx routes.ts 3000
npx tsx routes.ts 3000 --type api
npx tsx routes.ts 3000 --type page
```

### upgrade.ts - Upgrade to Next.js 16

Guided upgrade using official codemod + manual fixes.

```bash
npx tsx upgrade.ts .
npx tsx upgrade.ts /path/to/project
npx tsx upgrade.ts . --check
```

### cache.ts - Enable Cache Components

Migrate to Cache Components mode for Next.js 16.

```bash
npx tsx cache.ts .
npx tsx cache.ts /path/to/project
```

### browser.ts - Browser Automation

Control browser with Playwright for testing Next.js pages.

```bash
npx tsx browser.ts start [--headless]
npx tsx browser.ts navigate http://localhost:3000
npx tsx browser.ts screenshot [--fullpage]
npx tsx browser.ts click "button.submit"
npx tsx browser.ts type "input[name=email]" "test@example.com"
npx tsx browser.ts console [--errors-only]
npx tsx browser.ts evaluate "document.title"
npx tsx browser.ts close
```

## Workflows

### Workflow 1: Debug Errors

1. **Find servers**: `npx tsx ${CLAUDE_PLUGIN_ROOT}/skills/devtools/scripts/index.ts`
2. **Get errors**: `npx tsx ${CLAUDE_PLUGIN_ROOT}/skills/devtools/scripts/errors.ts 3000`
3. **Fix issues**: Apply fixes based on error output
4. **Verify**: Re-run errors.ts to confirm fixes

### Workflow 2: Explore App Structure

1. **Find servers**: `npx tsx ${CLAUDE_PLUGIN_ROOT}/skills/devtools/scripts/index.ts`
2. **List routes**: `npx tsx ${CLAUDE_PLUGIN_ROOT}/skills/devtools/scripts/routes.ts 3000`
3. **Search docs**: `npx tsx ${CLAUDE_PLUGIN_ROOT}/skills/devtools/scripts/docs.ts search "dynamic routes"`

### Workflow 3: Upgrade to Next.js 16

1. **Check version**: `npx tsx ${CLAUDE_PLUGIN_ROOT}/skills/devtools/scripts/upgrade.ts . --check`
2. **Run upgrade**: `npx tsx ${CLAUDE_PLUGIN_ROOT}/skills/devtools/scripts/upgrade.ts .`
3. **Fix errors**: `npx tsx ${CLAUDE_PLUGIN_ROOT}/skills/devtools/scripts/errors.ts 3000`
4. **Enable cache**: `npx tsx ${CLAUDE_PLUGIN_ROOT}/skills/devtools/scripts/cache.ts .`

### Workflow 4: Lookup Documentation

1. **Search**: `npx tsx ${CLAUDE_PLUGIN_ROOT}/skills/devtools/scripts/docs.ts search "server actions"`
2. **Get full doc**: `npx tsx ${CLAUDE_PLUGIN_ROOT}/skills/devtools/scripts/docs.ts get "/docs/app/api-reference/functions/server-actions"`

### Workflow 5: Verify Page Renders

1. **Start browser**: `npx tsx ${CLAUDE_PLUGIN_ROOT}/skills/devtools/scripts/browser.ts start`
2. **Navigate**: `npx tsx ${CLAUDE_PLUGIN_ROOT}/skills/devtools/scripts/browser.ts navigate http://localhost:3000`
3. **Check console**: `npx tsx ${CLAUDE_PLUGIN_ROOT}/skills/devtools/scripts/browser.ts console --errors-only`
4. **Screenshot**: `npx tsx ${CLAUDE_PLUGIN_ROOT}/skills/devtools/scripts/browser.ts screenshot`
5. **Close**: `npx tsx ${CLAUDE_PLUGIN_ROOT}/skills/devtools/scripts/browser.ts close`

## Quick Examples

### Check for Errors

```bash
npx tsx index.ts
# Found server on port 3000

npx tsx errors.ts 3000
# ✓ No errors found
```

### Debug Hydration Error

```bash
npx tsx errors.ts 3000 --type runtime
# Hydration error in app/page.tsx:15
# Server: <div id="123">
# Client: <div id="456">

npx tsx docs.ts search "hydration mismatch"
# Fix: Use useId() for dynamic IDs
```

### Upgrade Project

```bash
npx tsx upgrade.ts . --check
# Current: Next.js 15.2.0
# Target: Next.js 16.0.0
# Breaking changes: 12 files need updates

npx tsx upgrade.ts .
# Running @next/codemod...
# Updating async APIs...
# Done! Run 'npm run dev' to verify
```

## Additional Resources

- **`references/upgrade-patterns.md`** - Next.js 16 migration patterns
- **`references/error-solutions.md`** - Common errors and fixes

## Token Efficiency

| Approach | Tokens | Notes |
|----------|--------|-------|
| Direct MCP tools | ~150,000 | All tool definitions loaded |
| Code-mode scripts | ~2,000 | Only script output in context |
| **Savings** | **98.7%** | Scripts execute without context load |

Scripts wrap MCP tools via JSON-RPC, filter results locally, return only actionable information.
