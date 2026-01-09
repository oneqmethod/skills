#!/usr/bin/env npx tsx
/**
 * Initialize Next.js DevTools Context
 *
 * Usage:
 *   npx tsx init.ts
 */

import {
  callMcp,
  extractText,
  parseJsonResponse,
  closeMcp,
} from "./mcp-client.js";

const HELP = `
Next.js DevTools Initialization

Usage:
  npx tsx init.ts

What it does:
  - Initializes the Next.js DevTools MCP context
  - Provides guidance on using docs effectively
  - Lists available MCP tools and their usage

After init, use these scripts:
  - docs.ts    - Search/fetch Next.js documentation
  - index.ts   - Discover running dev servers
  - call.ts    - Call MCP tools on dev server
  - errors.ts  - Get compilation/runtime errors
  - routes.ts  - List application routes
  - upgrade.ts - Upgrade to Next.js 16
  - cache.ts   - Enable Cache Components
  - browser.ts - Browser automation
`;

interface InitResponse {
  success?: boolean;
  guidance?: string;
  error?: string;
  message?: string;
}

async function initialize(): Promise<void> {
  console.log("Initializing Next.js DevTools...");
  console.log("─".repeat(60));

  try {
    const result = await callMcp("init", {});
    const text = extractText(result);

    // Try to parse JSON response
    const parsed = parseJsonResponse<InitResponse>(text);

    if (parsed?.error) {
      console.log(`Error: ${parsed.message || parsed.error}`);
      return;
    }

    // Success
    console.log("✓ Next.js DevTools MCP initialized\n");

    console.log("Available tools:");
    console.log("  - nextjs_docs    Search/get Next.js documentation");
    console.log("  - nextjs_index   Discover running dev servers");
    console.log("  - nextjs_call    Call tools on dev server");
    console.log("  - browser_eval   Browser automation (Playwright)");
    console.log("  - upgrade_nextjs_16       Upgrade guide");
    console.log("  - enable_cache_components Cache components setup");

    console.log("\nKey guidance:");
    console.log("  - Use docs.ts for ALL Next.js questions");
    console.log("  - Use index.ts to find running servers");
    console.log("  - Use call.ts to interact with dev server");

    // If parsed has guidance, show it
    if (parsed?.guidance) {
      console.log("\nServer guidance:");
      console.log(parsed.guidance);
    }

    console.log("\n─".repeat(60));
    console.log("Quick start:");
    console.log('  npx tsx docs.ts search "server components"');
    console.log("  npx tsx index.ts");
    console.log("  npx tsx errors.ts 3000");
  } catch (error) {
    console.error("Error:", error instanceof Error ? error.message : error);
    console.log("\nThe MCP server may not be available.");
    console.log("Ensure next-devtools-mcp is installed:");
    console.log("  npx -y next-devtools-mcp@latest");
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

initialize();
