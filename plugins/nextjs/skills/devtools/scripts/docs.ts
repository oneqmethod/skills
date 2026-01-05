#!/usr/bin/env npx tsx
/**
 * Next.js Documentation Search & Fetch
 *
 * Usage:
 *   npx tsx docs.ts search "app router"
 *   npx tsx docs.ts search "server components" --router app
 *   npx tsx docs.ts get "/docs/app/building-your-application/routing"
 */

import { callMcp, extractText, closeMcp } from "./mcp-client.js";

const HELP = `
Next.js Documentation Tool

Usage:
  npx tsx docs.ts search <query> [--router app|pages|all]
  npx tsx docs.ts get <path> [--anchor section]

Examples:
  npx tsx docs.ts search "server components"
  npx tsx docs.ts search "api routes" --router pages
  npx tsx docs.ts get "/docs/app/building-your-application/routing"
  npx tsx docs.ts get "/docs/app/api-reference/functions/fetch" --anchor caching

Options:
  --router    Filter by router type: app, pages, or all (default: all)
  --anchor    Jump to specific section when fetching docs
`;

async function searchDocs(
  query: string,
  routerType: string = "all"
): Promise<void> {
  console.log(`Searching Next.js docs for: "${query}" (router: ${routerType})`);
  console.log("─".repeat(60));

  try {
    const result = await callMcp("nextjs_docs", {
      action: "search",
      query,
      routerType,
    });

    const text = extractText(result);
    if (text) {
      console.log(text);
    } else {
      console.log("No results found.");
    }

    // Suggest next steps
    console.log("\n─".repeat(60));
    console.log("Next steps:");
    console.log('  - Fetch full doc: npx tsx docs.ts get "<path>"');
    console.log('  - Refine search: npx tsx docs.ts search "<query>" --router app');
  } catch (error) {
    console.error("Error:", error instanceof Error ? error.message : error);
  } finally {
    closeMcp();
  }
}

async function getDocs(path: string, anchor?: string): Promise<void> {
  console.log(`Fetching: ${path}${anchor ? `#${anchor}` : ""}`);
  console.log("─".repeat(60));

  try {
    const args: Record<string, unknown> = {
      action: "get",
      path,
    };
    if (anchor) {
      args.anchor = anchor;
    }

    const result = await callMcp("nextjs_docs", args);

    const text = extractText(result);
    if (text) {
      console.log(text);
    } else {
      console.log("Document not found or empty.");
    }
  } catch (error) {
    console.error("Error:", error instanceof Error ? error.message : error);
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

const command = args[0];

if (command === "search") {
  const query = args[1];
  if (!query) {
    console.error("Error: Search query required");
    console.log("Usage: npx tsx docs.ts search <query>");
    process.exit(1);
  }

  let routerType = "all";
  const routerIdx = args.indexOf("--router");
  if (routerIdx !== -1 && args[routerIdx + 1]) {
    routerType = args[routerIdx + 1];
  }

  searchDocs(query, routerType);
} else if (command === "get") {
  const path = args[1];
  if (!path) {
    console.error("Error: Document path required");
    console.log("Usage: npx tsx docs.ts get <path>");
    process.exit(1);
  }

  let anchor: string | undefined;
  const anchorIdx = args.indexOf("--anchor");
  if (anchorIdx !== -1 && args[anchorIdx + 1]) {
    anchor = args[anchorIdx + 1];
  }

  getDocs(path, anchor);
} else {
  console.error(`Unknown command: ${command}`);
  console.log("Use --help for usage information");
  process.exit(1);
}
