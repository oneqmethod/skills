# MCP-CLI Plugin

Dynamic MCP server discovery and execution via CLI (99% token savings).

## Overview

Wraps the `mcp-cli` binary for token-efficient interaction with any MCP server. Instead of loading all tool definitions into context (~47k tokens), discover and execute tools on-demand (~400 tokens).

## Prerequisites

Install mcp-cli:

```bash
bun install -g https://github.com/philschmid/mcp-cli
```

## Configuration

Create `mcp_servers.json` in your project root or `~/.config/mcp/`:

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "."]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "your-token"
      }
    },
    "deepwiki": {
      "url": "https://mcp.deepwiki.com/mcp"
    }
  }
}
```

- **stdio servers**: `command` + `args` (+ optional `env`)
- **HTTP servers**: `url`

## Usage

| Command | Purpose |
|---------|---------|
| `mcp-cli` | List all servers and tools |
| `mcp-cli <server>` | Show server's tools with parameters |
| `mcp-cli <server>/<tool>` | Get tool JSON schema |
| `mcp-cli <server>/<tool> '<json>'` | Execute tool |
| `mcp-cli grep "<glob>"` | Search tools by name |

### Flags

- `-d` - Include descriptions
- `-j, --json` - JSON output
- `-r, --raw` - Raw text content

## Skills

| Skill | Description |
|-------|-------------|
| `mcp-cli` | MCP server interaction via CLI |

## Links

- [mcp-cli by Phil Schmid](https://www.philschmid.de/mcp-cli)
- [Model Context Protocol](https://modelcontextprotocol.io/)
