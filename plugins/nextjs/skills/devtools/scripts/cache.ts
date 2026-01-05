#!/usr/bin/env npx tsx
/**
 * Cache Components Migration for Next.js 16
 *
 * Usage:
 *   npx tsx cache.ts /path/to/project
 */

import { callMcp, extractText, closeMcp } from "./mcp-client.js";

const HELP = `
Cache Components Migration Assistant

Usage:
  npx tsx cache.ts <project_path>

Arguments:
  project_path   Path to Next.js 16 project

Examples:
  npx tsx cache.ts .
  npx tsx cache.ts /home/user/my-app

What it does:
  1. Enables cacheComponents in next.config
  2. Starts dev server (MCP enabled by default in 16+)
  3. Loads routes via browser automation
  4. Detects errors using Next.js MCP
  5. Auto-fixes with:
     - Suspense boundaries
     - "use cache" directives
     - generateStaticParams
     - cacheLife profiles
     - Cache tags
  6. Verifies all routes work

Cache Components features:
  - "use cache" directive at function/component level
  - "use cache: private" for user-specific caching
  - cacheLife() for TTL configuration
  - cacheTag() for invalidation
  - Automatic Suspense boundary insertion

Requirements:
  - Next.js 16.0.0+ (stable or canary)
  - Clean working directory preferred
  - Browser automation (auto-installed if needed)
`;

async function runCacheMigration(projectPath: string): Promise<void> {
  console.log("Cache Components Migration");
  console.log(`Project: ${projectPath}`);
  console.log("─".repeat(60));

  console.log("This will:");
  console.log("  1. Update next.config with cacheComponents flag");
  console.log("  2. Start dev server and load routes");
  console.log("  3. Detect and fix cache-related errors");
  console.log("  4. Verify all routes work\n");

  try {
    const result = await callMcp("enable_cache_components", {
      project_path: projectPath,
    });

    const text = extractText(result);
    if (text) {
      console.log(text);
    } else {
      console.log("Cache components migration completed.");
    }

    // Additional guidance
    console.log("\n─".repeat(60));
    console.log("Cache patterns:");
    console.log('  "use cache"           - Cache at build + runtime');
    console.log('  "use cache: private"  - User-specific cache');
    console.log("  cacheLife('hours')    - Set cache duration");
    console.log("  cacheTag('products')  - Enable targeted invalidation");
    console.log("\nDocs:");
    console.log('  npx tsx docs.ts search "cache components"');
    console.log('  npx tsx docs.ts search "cacheLife"');
  } catch (error) {
    console.error("Error:", error instanceof Error ? error.message : error);
    console.log("\nManual cache components setup:");
    console.log("  1. Add to next.config.ts:");
    console.log("     experimental: { cacheComponents: true }");
    console.log("  2. Add Suspense boundaries around async components");
    console.log('  3. Add "use cache" to cacheable functions');
    console.log("  4. Configure cacheLife for TTL control");
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

const projectPath = args[0];

if (!projectPath || projectPath.startsWith("--")) {
  console.error("Error: Project path required");
  console.log("Usage: npx tsx cache.ts <project_path>");
  process.exit(1);
}

runCacheMigration(projectPath);
