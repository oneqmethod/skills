# Shadcn Plugin

Token-efficient shadcn/ui component selection for Claude Code.

## Features

- **Code-mode scripts**: Wrap MCP tools via JSON-RPC for 98% token savings
- **Component selector skill**: Two workflows - feature-driven and discovery
- **Full registry access**: Search 438 components, blocks, and examples

## How It Works

Scripts run **locally on your computer**, not on Anthropic's servers.

```
User asks: "find components for a dashboard"
         ↓
Claude triggers skill, executes via Bash tool:
    npx tsx scripts/search.ts "dashboard"
         ↓
Script runs LOCALLY:
    1. Spawns: npx shadcn@latest mcp (local MCP server)
    2. Sends JSON-RPC request over stdio
    3. Filters response locally
    4. Prints relevant output to stdout
         ↓
Claude receives small, filtered output (~2k tokens)
```

**Why 98% token savings?**
- Without code-mode: MCP tool definitions loaded into context (~150k tokens)
- With code-mode: Only script stdout in context (~2k tokens)

## Skills

### component-selector

Find and implement shadcn/ui components efficiently.

**Triggers**: "add shadcn", "find components", "build dashboard", "search registry"

**Scripts** (7 total, covering all shadcn MCP tools):

| Script | MCP Tool | Purpose |
|--------|----------|---------|
| `search.ts` | `search_items_in_registries` | Fuzzy search, auto-fetch top 5 details |
| `view.ts` | `view_items_in_registries` | View specific items by name |
| `list.ts` | `list_items_in_registries` | Browse/paginate by type |
| `examples.ts` | `get_item_examples_from_registries` | Get full TSX demo code |
| `add.ts` | `get_add_command_for_items` | Generate install commands |
| `audit.ts` | `get_audit_checklist` | Post-install verification |
| `registries.ts` | `get_project_registries` | List configured registries |

## Prerequisites

### System Requirements

| Requirement | Why | Install |
|-------------|-----|---------|
| **Node.js 18+** | Runs scripts via `npx tsx` and shadcn MCP | [nodejs.org](https://nodejs.org) |

Scripts use `npx tsx` which auto-installs on first run - no additional setup needed.

### Installation

```bash
# Add this marketplace to Claude Code
claude plugins add /path/to/skills-marketplace
```

### Per-Project Requirements

When using the skill to add components to a project:

| Requirement | Check | Fix |
|-------------|-------|-----|
| `components.json` | File exists in project root | `npx shadcn@latest init` |
| Tailwind CSS | `tailwind.config.js` exists | Follow shadcn setup guide |
| Path aliases | `@/*` in tsconfig.json | Add paths configuration |
| cn() utility | `@/lib/utils.ts` exists | Created by `shadcn init` |
