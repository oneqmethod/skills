# Skills Marketplace

Community plugins for Claude Code with token-optimized skills using code-mode patterns.

## Installation

Add this marketplace to Claude Code:

```bash
claude plugins add /path/to/skills-marketplace
```

## Plugins

### shadcn

Token-efficient shadcn/ui component selection (98% token savings).

- Code-mode scripts wrapping MCP tools via JSON-RPC
- 438+ components, blocks, examples across registries (@shadcn, @tweakcn, etc.)
- Feature-driven selection + component discovery workflows

[Full Documentation](plugins/shadcn/README.md)

---

### presentation-generator

Generate dark-themed HTML presentations from any document.

- Auto-detect document type (PRD, transcript, notes, articles)
- Auto-detect language for RTL/LTR support
- Dynamic theme colors, keyboard navigation, chapter sidebar
- Print-friendly CSS for PDF export

[Full Documentation](plugins/presentation-generator/README.md)

---

### nextjs

Next.js DevTools with MCP integration (98.7% token savings).

- Debug errors, list routes, search docs via code-mode scripts
- Upgrade assistant for Next.js 16 migration with codemods
- Cache Components enablement and migration
- Browser automation for testing

[Full Documentation](plugins/nextjs/README.md)

## Contributing

1. Create plugin in `plugins/<name>/`
2. Add `.claude-plugin/plugin.json`
3. Add skills in `skills/<skill-name>/SKILL.md`
4. Register in `.claude-plugin/marketplace.json`
