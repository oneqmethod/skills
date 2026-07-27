# Skills Marketplace

Community plugins for Claude Code with token-optimized skills using code-mode patterns.

## Installation

Add this marketplace to Claude Code:

```bash
claude plugins add oneqmethod/skills
```

## Plugins


### mcp-cli

Dynamic MCP server discovery and execution (99% token savings).

- List servers/tools, inspect schemas, execute tools
- Supports stdio and HTTP MCP servers
- Glob-based tool search

[Full Documentation](plugins/mcp-cli/README.md)

## Contributing

1. Create plugin in `plugins/<name>/`
2. Add `.claude-plugin/plugin.json`
3. Add skills in `skills/<skill-name>/SKILL.md`
4. Register in `.claude-plugin/marketplace.json`

---

### presentation-generator

Generate dark-themed HTML presentations from any document.

- Auto-detect document type (PRD, transcript, notes, articles)
- Auto-detect language for RTL/LTR support
- Dynamic theme colors, keyboard navigation, chapter sidebar
- Print-friendly CSS for PDF export

[Full Documentation](plugins/presentation-generator/README.md)

---

### agent-browser

Browser automation for web testing, form filling, and data extraction.

- Snapshot workflow with element refs for reliable interactions
- Form filling, checkboxes, dropdowns
- Screenshots and PDF export
- Parallel sessions, state persistence

**Prerequisites:** `npm install -g agent-browser && agent-browser install`

[Full Documentation](plugins/agent-browser/README.md)

---

### solomon-advisor

Business decision agent whose entire reasoning corpus is King Solomon's three books.

- Three-court panel: Song of Songs (demand & timing), Proverbs (risk & prudence), Ecclesiastes (time & uncertainty)
- Explicit tie-break rules — reversibility and exposure decide which court prevails
- Verse bank of 241 tagged sources, each with a business reading and a check question
- Structured ruling: decision, "little foxes", stop-conditions, first step
- Hebrew and English triggers; no dependencies

[Full Documentation](plugins/solomon-advisor/README.md)

