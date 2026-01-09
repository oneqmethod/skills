#!/usr/bin/env npx tsx
/**
 * Discover Running Next.js Dev Servers
 *
 * Usage:
 *   npx tsx index.ts
 *   npx tsx index.ts --port 3000
 */

import {
  callMcp,
  extractText,
  parseJsonResponse,
  closeMcp,
} from "./mcp-client.js";

const HELP = `
Next.js Dev Server Discovery

Usage:
  npx tsx index.ts              # Auto-discover all running servers
  npx tsx index.ts --port 3000  # Check specific port

Discovers running Next.js 16+ dev servers and lists available MCP tools.
Servers expose /_next/mcp endpoint automatically.

Output:
  - Server port, PID, URL
  - Available MCP tools with descriptions
`;

async function discoverServers(port?: string): Promise<void> {
  console.log("Discovering Next.js dev servers...");
  console.log("─".repeat(60));

  try {
    const args: Record<string, unknown> = {};
    if (port) {
      args.port = port;
    }

    const result = await callMcp("nextjs_index", args);
    const text = extractText(result);

    // Try to parse JSON response
    interface ServerInfo {
      port: number;
      url: string;
      pid?: number;
      tools?: Array<{ name: string; description?: string }>;
    }
    interface IndexResponse {
      success?: boolean;
      count?: number;
      servers?: ServerInfo[];
      error?: string;
      message?: string;
    }

    const parsed = parseJsonResponse<IndexResponse>(text);

    if (parsed?.error) {
      console.log(`Error: ${parsed.message || parsed.error}`);
      return;
    }

    if (parsed?.servers && parsed.servers.length > 0) {
      console.log(`Found ${parsed.count || parsed.servers.length} server(s):\n`);
      for (const server of parsed.servers) {
        console.log(`  Port ${server.port}: ${server.url}`);
        if (server.pid) console.log(`    PID: ${server.pid}`);
        if (server.tools && server.tools.length > 0) {
          console.log(`    Tools: ${server.tools.map((t) => t.name).join(", ")}`);
        }
      }
      console.log("\n─".repeat(60));
      console.log("Quick commands:");
      console.log("  - Get errors:  npx tsx errors.ts <port>");
      console.log("  - List routes: npx tsx routes.ts <port>");
      console.log("  - Call tool:   npx tsx call.ts <port> <tool> [args]");
    } else if (text) {
      // Fallback: print raw text
      console.log(text);
    } else {
      console.log("No running Next.js dev servers found.");
      console.log("\nTo start a dev server:");
      console.log("  cd /your/nextjs/project && npm run dev");
      console.log("\nRequirements:");
      console.log("  - Next.js 16+ (MCP enabled by default)");
      console.log("  - Dev server running (npm run dev)");
    }
  } catch (error) {
    console.error("Error:", error instanceof Error ? error.message : error);
    console.log("\nTroubleshooting:");
    console.log("  1. Ensure Next.js 16+ is installed");
    console.log("  2. Run: npm run dev");
    console.log("  3. Try: npx tsx index.ts --port 3000");
  } finally {
    closeMcp();
  }
}

// Parse arguments
const args = process.argv.slice(2);

if (args[0] === "--help" || args[0] === "-h") {
  console.log(HELP);
  process.exit(0);
}

let port: string | undefined;
const portIdx = args.indexOf("--port");
if (portIdx !== -1 && args[portIdx + 1]) {
  port = args[portIdx + 1];
}

discoverServers(port);
