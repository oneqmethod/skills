# agent-browser Plugin

Browser automation skill for Claude Code using the agent-browser CLI.

## Prerequisites

Install agent-browser globally:

```bash
npm install -g agent-browser
agent-browser install  # Download Chromium
```

On Linux, also install system dependencies:
```bash
agent-browser install --with-deps
```

## Features

- **Snapshot workflow**: Get accessibility tree with element refs for reliable interactions
- **Form filling**: Fill inputs, check boxes, select dropdowns
- **Screenshots**: Capture pages or specific regions
- **Sessions**: Run parallel browser instances
- **State persistence**: Save/load authentication state

## Skill

| Skill | Description |
|-------|-------------|
| `agent-browser` | Browser automation workflow with snapshot-based element selection |

## Quick Example

```bash
agent-browser open https://example.com
agent-browser snapshot -i          # Get interactive elements
agent-browser fill @e1 "text"      # Fill by ref
agent-browser click @e2            # Click by ref
agent-browser screenshot page.png  # Capture result
agent-browser close
```

## Links

- [agent-browser on GitHub](https://github.com/vercel-labs/agent-browser)
- [npm package](https://www.npmjs.com/package/agent-browser)
