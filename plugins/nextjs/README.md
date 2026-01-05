# Next.js DevTools Plugin

Token-efficient Next.js development using code-mode scripts instead of direct MCP tool calls.

## Features

- **Code-mode scripts** - Execute TypeScript scripts via Bash, ~98% token savings
- **DevTools skill** - Debug errors, list routes, search docs
- **Upgrade assistant** - Guided Next.js 16 migration with codemods
- **Cache components** - Enable and migrate to Cache Components mode

## How It Works

```
User asks: "what errors does my Next.js app have?"
    ↓
Claude skill triggers:
    npx tsx scripts/errors.ts 3000
    ↓
Local execution:
  1. Script spawns Next.js DevTools MCP server
  2. Sends JSON-RPC request over stdio
  3. Filters response locally
  4. Prints ~2k tokens of relevant output
    ↓
Claude receives minimal output (~2k vs 150k tokens)
```

## Prerequisites

- **Node.js 18+** - Required for script execution
- **npx tsx** - Auto-installs on first run
- **Next.js 16+** - Required for dev server MCP features

## Quick Start

### Debug Errors

```bash
# Discover running dev servers
npx tsx skills/devtools/scripts/index.ts

# Get errors from dev server on port 3000
npx tsx skills/devtools/scripts/errors.ts 3000
```

### Search Documentation

```bash
# Search docs
npx tsx skills/devtools/scripts/docs.ts search "server components"

# Get full documentation page
npx tsx skills/devtools/scripts/docs.ts get "/docs/app/building-your-application/routing"
```

### Upgrade to Next.js 16

```bash
# Check current version
npx tsx skills/devtools/scripts/upgrade.ts . --check

# Run upgrade
npx tsx skills/devtools/scripts/upgrade.ts .
```

### Enable Cache Components

```bash
npx tsx skills/devtools/scripts/cache.ts .
```

## Scripts

| Script | Purpose |
|--------|---------|
| `init.ts` | Initialize context, get usage guidance |
| `docs.ts` | Search/fetch Next.js documentation |
| `index.ts` | Discover running dev servers |
| `call.ts` | Call any MCP tool on dev server |
| `errors.ts` | Get compilation/runtime errors |
| `routes.ts` | List application routes |
| `upgrade.ts` | Upgrade to Next.js 16 |
| `cache.ts` | Enable Cache Components |
| `browser.ts` | Browser automation (Playwright) |

## Token Efficiency

| Approach | Tokens | Notes |
|----------|--------|-------|
| Direct MCP tools | ~150,000 | All tool definitions in context |
| Code-mode scripts | ~2,000 | Only script output in context |
| **Savings** | **98.7%** | Scripts wrap MCP via JSON-RPC |

## Architecture

```
plugins/nextjs/
├── .claude-plugin/
│   └── plugin.json           # Plugin manifest
├── skills/
│   └── devtools/
│       ├── SKILL.md          # Skill documentation
│       ├── scripts/          # TypeScript scripts
│       │   ├── mcp-client.ts # JSON-RPC client
│       │   ├── init.ts
│       │   ├── docs.ts
│       │   ├── index.ts
│       │   ├── call.ts
│       │   ├── errors.ts
│       │   ├── routes.ts
│       │   ├── upgrade.ts
│       │   ├── cache.ts
│       │   └── browser.ts
│       └── references/       # Knowledge base
│           ├── upgrade-patterns.md
│           └── error-solutions.md
└── README.md
```

## MCP Client

The `mcp-client.ts` module handles communication with the Next.js DevTools MCP server:

- Spawns MCP server as child process
- JSON-RPC 2.0 protocol over stdio
- 30-second request timeout
- Automatic cleanup on exit

To use a different MCP server, update the spawn command in `mcp-client.ts`:

```typescript
const MCP_COMMAND = "npx";
const MCP_ARGS = ["-y", "next-devtools-mcp@latest"];
```

## License

MIT
