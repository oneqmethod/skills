# Plugin Structure

## Directory Layout

```
plugins/{plugin-name}/
├── .claude-plugin/
│   └── plugin.json          # Plugin manifest (required)
├── README.md                 # Documentation (required)
└── skills/
    └── {skill-name}/
        ├── SKILL.md          # Skill definition (required)
        ├── scripts/          # TypeScript/Bash scripts
        ├── references/       # Knowledge base (.md files)
        └── assets/           # Templates, static files
```

## plugin.json Format

```json
{
  "name": "plugin-name",
  "description": "Brief description of plugin purpose",
  "author": {
    "name": "Author Name",
    "email": "author@example.com"
  }
}
```

## Naming Conventions

- Plugin directory: `kebab-case` (e.g., `presentation-generator`)
- Skill directory: `kebab-case` (e.g., `component-selector`)
- Script files: `camelCase.ts` (e.g., `search.ts`, `mcp-client.ts`)
- Reference docs: `kebab-case.md` (e.g., `feature-patterns.md`)

## Required Files

| File | Purpose |
|------|---------|
| `plugin.json` | Manifest with name, description, author |
| `README.md` | User-facing documentation |
| `skills/*/SKILL.md` | At least one skill definition |

## Optional Components

- `commands/` - Slash commands
- `agents/` - Autonomous agents
- `hooks/` - Event handlers (PreToolUse, PostToolUse, Stop, etc.)
- `.mcp.json` - MCP server configuration
