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

**Scripts**:
- `search.ts` - Search components, auto-fetch details for top results
- `list.ts` - Browse registry by type (ui, block, example)
- `examples.ts` - Get full TSX code for component demos
- `add.ts` - Generate `npx shadcn add` commands
- `audit.ts` - Post-install verification checklist

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
