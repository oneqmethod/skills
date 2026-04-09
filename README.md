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

### brainshop

Business validation charts for Brainshop meetings — surfaces the right chart automatically from live conversation context.

- Detects MVP cost, pricing, and viability signals from meeting transcripts
- Generates self-contained React components (Recharts) styled for Brainshop's dark UI
- Each chart includes an explanation panel for user comprehension
- Three chart types: MVP Validation Curve, Break-Even Analysis, Viability Matrix

**Prerequisites:** `recharts` installed in the Brainshop frontend

| Chart | Triggered By |
|-------|-------------|
| MVP Validation Curve | Build cost + launch timeline + first paying customer |
| Break-Even Analysis | Fixed cost + variable cost/user + price + scale questions |
| Viability Matrix | Feature list + effort vs. value debate |

[Full Documentation](plugins/brainshop/README.md)

---

### agent-browser

Browser automation for web testing, form filling, and data extraction.

- Snapshot workflow with element refs for reliable interactions
- Form filling, checkboxes, dropdowns
- Screenshots and PDF export
- Parallel sessions, state persistence

**Prerequisites:** `npm install -g agent-browser && agent-browser install`

[Full Documentation](plugins/agent-browser/README.md)

