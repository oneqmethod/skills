# MCP Integration

Wrap MCP servers in code-mode scripts for token efficiency.

## Token Efficiency

| Approach | Tokens | Savings |
|----------|--------|---------|
| Direct MCP tools | ~150,000 | - |
| Code-mode scripts | ~2,000 | 98.7% |

## When to Use Code-Mode

- MCP server has many tools (5+)
- Tool definitions are verbose
- Frequent tool calls expected
- Want to minimize context usage

## MCP Client Pattern

Create `scripts/mcp-client.ts`:

```typescript
import { spawn, ChildProcess } from "child_process";

let mcpProcess: ChildProcess | null = null;
let requestId = 0;

export async function initMcp(command: string, args: string[]): Promise<void> {
  mcpProcess = spawn(command, args, { stdio: ["pipe", "pipe", "pipe"] });
  // Initialize JSON-RPC connection
}

export async function callMcp(method: string, params: object): Promise<any> {
  const request = {
    jsonrpc: "2.0",
    id: ++requestId,
    method,
    params,
  };
  // Send request, await response
}

export function closeMcp(): void {
  mcpProcess?.kill();
}
```

## Script Structure

```typescript
#!/usr/bin/env npx tsx
import { initMcp, callMcp, closeMcp } from "./mcp-client.js";
import { parseArgs } from "util";

const { values } = parseArgs({
  options: {
    query: { type: "string", short: "q" },
  },
});

try {
  await initMcp("npx", ["some-mcp-server"]);
  const result = await callMcp("tools/call", {
    name: "tool_name",
    arguments: { query: values.query },
  });
  console.log(JSON.stringify(result, null, 2));
} finally {
  closeMcp();
}
```

## Best Practices

- 30-second timeout for MCP calls
- Always call `closeMcp()` in finally block
- Use `util.parseArgs` for CLI arguments
- Return JSON output for Claude to parse
- Handle errors gracefully with try/catch

## Reference

See: https://www.anthropic.com/engineering/code-execution-with-mcp
