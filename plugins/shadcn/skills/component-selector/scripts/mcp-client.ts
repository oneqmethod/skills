/**
 * MCP Client for shadcn MCP server
 * Handles JSON-RPC communication over stdio
 */

import { spawn, ChildProcess } from "child_process";

interface McpRequest {
  jsonrpc: "2.0";
  id: number;
  method: string;
  params: {
    name: string;
    arguments: Record<string, unknown>;
  };
}

interface McpResponse {
  jsonrpc: "2.0";
  id: number;
  result?: {
    content: Array<{ type: string; text: string }>;
  };
  error?: {
    code: number;
    message: string;
  };
}

let mcpProcess: ChildProcess | null = null;
let requestId = 0;
let responseBuffer = "";

const pendingRequests = new Map<
  number,
  { resolve: (value: unknown) => void; reject: (error: Error) => void }
>();

function startMcpServer(): Promise<void> {
  return new Promise((resolve, reject) => {
    mcpProcess = spawn("npx", ["shadcn@latest", "mcp"], {
      stdio: ["pipe", "pipe", "pipe"],
    });

    mcpProcess.stdout?.on("data", (data: Buffer) => {
      responseBuffer += data.toString();
      processResponses();
    });

    mcpProcess.stderr?.on("data", (data: Buffer) => {
      // MCP servers may log to stderr, ignore unless error
      const msg = data.toString();
      if (msg.includes("error") || msg.includes("Error")) {
        console.error("[MCP stderr]:", msg);
      }
    });

    mcpProcess.on("error", (err) => {
      reject(new Error(`Failed to start MCP server: ${err.message}`));
    });

    mcpProcess.on("close", (code) => {
      if (code !== 0) {
        console.error(`MCP server exited with code ${code}`);
      }
      mcpProcess = null;
    });

    // Give server time to start
    setTimeout(resolve, 1000);
  });
}

function processResponses(): void {
  const lines = responseBuffer.split("\n");
  responseBuffer = lines.pop() || "";

  for (const line of lines) {
    if (!line.trim()) continue;
    try {
      const response: McpResponse = JSON.parse(line);
      const pending = pendingRequests.get(response.id);
      if (pending) {
        pendingRequests.delete(response.id);
        if (response.error) {
          pending.reject(new Error(response.error.message));
        } else {
          pending.resolve(response.result);
        }
      }
    } catch {
      // Not JSON, might be startup message
    }
  }
}

export async function callMcp(
  toolName: string,
  args: Record<string, unknown>
): Promise<unknown> {
  if (!mcpProcess) {
    await startMcpServer();
  }

  const id = ++requestId;
  const request: McpRequest = {
    jsonrpc: "2.0",
    id,
    method: "tools/call",
    params: {
      name: toolName,
      arguments: args,
    },
  };

  return new Promise((resolve, reject) => {
    pendingRequests.set(id, { resolve, reject });

    const timeout = setTimeout(() => {
      pendingRequests.delete(id);
      reject(new Error("MCP request timeout"));
    }, 30000);

    pendingRequests.set(id, {
      resolve: (value) => {
        clearTimeout(timeout);
        resolve(value);
      },
      reject: (error) => {
        clearTimeout(timeout);
        reject(error);
      },
    });

    mcpProcess?.stdin?.write(JSON.stringify(request) + "\n");
  });
}

export function closeMcp(): void {
  if (mcpProcess) {
    mcpProcess.kill();
    mcpProcess = null;
  }
}

// Extract text content from MCP response
export function extractText(result: unknown): string {
  if (!result || typeof result !== "object") return "";
  const r = result as { content?: Array<{ type: string; text: string }> };
  if (!r.content || !Array.isArray(r.content)) return "";
  return r.content
    .filter((c) => c.type === "text")
    .map((c) => c.text)
    .join("\n");
}
