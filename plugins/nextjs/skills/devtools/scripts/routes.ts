#!/usr/bin/env npx tsx
/**
 * List Routes from Next.js Dev Server
 *
 * Usage:
 *   npx tsx routes.ts 3000
 *   npx tsx routes.ts 3000 --type page|api|all
 */

import {
  callMcp,
  extractText,
  parseJsonResponse,
  closeMcp,
} from "./mcp-client.js";

const HELP = `
Next.js Route Lister

Usage:
  npx tsx routes.ts <port>
  npx tsx routes.ts <port> --type page|api|all

Arguments:
  port   Port of running Next.js dev server (e.g., 3000)

Options:
  --type   Route type filter: page, api, or all (default: all)

Examples:
  npx tsx routes.ts 3000
  npx tsx routes.ts 3000 --type api
  npx tsx routes.ts 3001 --type page

Output includes:
  - Route paths and patterns
  - Dynamic segments ([id], [...slug])
  - Route handlers (GET, POST, etc.)
  - Middleware information

Note: Tool name "list_routes" may vary by Next.js version.
Run 'npx tsx index.ts --port <port>' to see available tools.
`;

async function listRoutes(port: string, routeType: string = "all"): Promise<void> {
  console.log(`Listing routes on port ${port} (type: ${routeType})...`);
  console.log("─".repeat(60));

  try {
    // Tool name: get_routes (confirmed in Next.js 16)
    const mcpArgs: Record<string, unknown> = {
      port,
      toolName: "get_routes",
    };
    if (routeType !== "all") {
      mcpArgs.args = JSON.stringify({ type: routeType });
    }

    const result = await callMcp("nextjs_call", mcpArgs);
    const text = extractText(result);

    // Try to parse JSON response
    interface RouteInfo {
      path: string;
      type: string;
      methods?: string[];
    }
    interface RoutesResponse {
      success?: boolean;
      count?: number;
      routes?: RouteInfo[];
      error?: string;
      message?: string;
    }

    const parsed = parseJsonResponse<RoutesResponse>(text);

    if (parsed?.error) {
      console.log(`Error: ${parsed.message || parsed.error}`);
      return;
    }

    if (parsed?.routes && parsed.routes.length > 0) {
      console.log(`Found ${parsed.count || parsed.routes.length} route(s):\n`);
      for (const route of parsed.routes) {
        const methods = route.methods ? ` [${route.methods.join(", ")}]` : "";
        console.log(`  ${route.path} (${route.type})${methods}`);
      }
      console.log("\n─".repeat(60));
      console.log("Route patterns:");
      console.log("  [param]     - Dynamic segment");
      console.log("  [...slug]   - Catch-all segment");
      console.log("  [[...opt]]  - Optional catch-all");
      console.log("  (group)     - Route group (no URL impact)");
    } else if (text) {
      // Fallback: print raw text
      console.log(text);
    } else {
      console.log("No routes found or empty response.");
      console.log("\nCheck:");
      console.log("  1. App directory exists: app/ or src/app/");
      console.log("  2. Pages exist: app/page.tsx, app/*/page.tsx");
    }
  } catch (error) {
    console.error("Error:", error instanceof Error ? error.message : error);
    console.log("\nTroubleshooting:");
    console.log(`  1. Verify dev server is running on port ${port}`);
    console.log("  2. Check server discovery: npx tsx index.ts");
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
if (!port || port.startsWith("--")) {
  console.error("Error: Port number required");
  console.log("Usage: npx tsx routes.ts <port>");
  process.exit(1);
}

let routeType = "all";
const typeIdx = args.indexOf("--type");
if (typeIdx !== -1 && args[typeIdx + 1]) {
  routeType = args[typeIdx + 1];
}

listRoutes(port, routeType);
