# Skills Marketplace

Community plugins for Claude Code with token-optimized skills using code-mode patterns.

## Installation

Add this marketplace to Claude Code:

```bash
claude plugins add /path/to/skills-marketplace
```

## Plugins

### shadcn

Token-efficient shadcn/ui component selection and implementation.

- **Code-mode scripts**: Wrap MCP tools for 98% token savings
- **Two workflows**: Feature-driven selection + component discovery
- **Registry access**: Search 438 components, blocks, and examples

## Contributing

1. Create plugin in `plugins/<name>/`
2. Add `.claude-plugin/plugin.json`
3. Add skills in `skills/<skill-name>/SKILL.md`
4. Register in `.claude-plugin/marketplace.json`
