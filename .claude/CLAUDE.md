# Skills Marketplace

Claude Code plugins marketplace. Plugins provide skills, commands, agents, and hooks.

## Quick Start: New Plugin

1. Run `/plugin-dev:create-plugin` for guided workflow
2. Or manually: create `plugins/{name}/.claude-plugin/plugin.json`
3. Add skills in `plugins/{name}/skills/{skill-name}/SKILL.md`
4. Register in `.claude-plugin/marketplace.json`
5. Update root `README.md`

## Plugin-Dev Skills

Use these skills when developing plugins:

| Skill | Use When |
|-------|----------|
| `/plugin-dev:create-plugin` | Creating new plugin from scratch |
| `/plugin-dev:skill-development` | Adding/modifying skills |
| `/plugin-dev:command-development` | Creating slash commands |
| `/plugin-dev:hook-development` | Adding hooks (PreToolUse, PostToolUse, etc.) |
| `/plugin-dev:mcp-integration` | Wrapping MCP servers |
| `/plugin-dev:agent-development` | Creating agents |
| `/plugin-dev:plugin-structure` | Understanding directory layout |
| `/plugin-dev:plugin-settings` | Plugin configuration patterns |

## Rules

Detailed instructions in `.claude/rules/`:
- @.claude/rules/plugin-structure.md
- @.claude/rules/skill-development.md
- @.claude/rules/marketplace-registration.md
- @.claude/rules/development-workflow.md
- @.claude/rules/testing.md
- @.claude/rules/debugging.md
