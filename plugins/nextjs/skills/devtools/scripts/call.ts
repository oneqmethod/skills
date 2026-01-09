#!/usr/bin/env npx tsx
/**
 * Call MCP Tools on Running Next.js Dev Server
 *
 * Usage:
 *   npx tsx call.ts 3000 get_errors
 *   npx tsx call.ts 3000 list_routes
 *   npx tsx call.ts 3000 get_build_status
 */

import {
  callMcp,
  extractText,
  parseJsonResponse,
  closeMcp,
} from "./mcp-client.js";

const HELP = `
Next.js MCP Tool Caller

Usage:
  npx tsx call.ts <port> <tool> [args_json]

Arguments:
  port       Port of running Next.js dev server (e.g., 3000)
  tool       MCP tool name (e.g., get_errors, list_routes)
  args_json  Optional JSON string for tool arguments

Examples:
  npx tsx call.ts 3000 get_errors
  npx tsx call.ts 3000 list_routes
  npx tsx call.ts 3000 get_build_status
  npx tsx call.ts 3000 clear_cache '{"type":"full"}'

Common tools (varies by Next.js version):
  - get_errors        Get compilation/runtime errors
  - list_routes       List all routes
  - get_build_status  Check compilation state
  - clear_cache       Clear Next.js caches

Use 'npx tsx index.ts' to discover available tools.
`;

async function callTool(
  port: string,
  toolName: string,
  toolArgs?: string
): Promise<void> {
  console.log(`Calling ${toolName} on port ${port}...`);
  console.log("─".repeat(60));

  try {
    // Validate JSON if provided
    if (toolArgs) {
      try {
        JSON.parse(toolArgs);
      } catch {
        console.error("Error: Invalid JSON for tool arguments");
        console.log("Expected format: '{\"key\": \"value\"}'");
        process.exit(1);
      }
    }

    const mcpArgs: Record<string, unknown> = { port, toolName };
    if (toolArgs) {
      mcpArgs.args = toolArgs; // Pass as string, not parsed object
    }

    const result = await callMcp("nextjs_call", mcpArgs);
    const text = extractText(result);

    // Try to parse JSON response
    interface CallResponse {
      success?: boolean;
      result?: unknown;
      error?: string;
      message?: string;
    }

    const parsed = parseJsonResponse<CallResponse>(text);

    if (parsed?.error) {
      console.log(`Error: ${parsed.message || parsed.error}`);
      return;
    }

    if (parsed?.result !== undefined) {
      console.log(
        typeof parsed.result === "string"
          ? parsed.result
          : JSON.stringify(parsed.result, null, 2)
      );
    } else if (text) {
      // Fallback: print raw text
      console.log(text);
    } else {
      console.log("Tool returned no output.");
    }
  } catch (error) {
    console.error("Error:", error instanceof Error ? error.message : error);
    console.log("\nTroubleshooting:");
    console.log(`  1. Verify dev server is running on port ${port}`);
    console.log("  2. Check tool name: npx tsx index.ts --port " + port);
    console.log("  3. Ensure Next.js 16+ is installed");
  } finally {
    closeMcp();
  }
}

// Parse arguments
const args = process.argv.slice(2);

if (args.length === 0 || args[0] === "--help" || args[0] === "-h") {
  console.log(HELP);
  process.exit(0);
}

const port = args[0];
const toolName = args[1];
const toolArgs = args[2];

if (!port || !toolName) {
  console.error("Error: Port and tool name required");
  console.log("Usage: npx tsx call.ts <port> <tool> [args_json]");
  process.exit(1);
}

callTool(port, toolName, toolArgs);
