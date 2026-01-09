#!/usr/bin/env npx tsx
/**
 * Next.js 16 Upgrade Guide
 *
 * Usage:
 *   npx tsx upgrade.ts /path/to/project
 *   npx tsx upgrade.ts . --check
 */

import {
  callMcp,
  extractText,
  parseJsonResponse,
  closeMcp,
} from "./mcp-client.js";

const HELP = `
Next.js 16 Upgrade Assistant

Usage:
  npx tsx upgrade.ts <project_path>
  npx tsx upgrade.ts <project_path> --check

Arguments:
  project_path   Path to Next.js project (e.g., . or /path/to/app)

Options:
  --check   Only check current version and compatibility (no changes)

Examples:
  npx tsx upgrade.ts .
  npx tsx upgrade.ts /home/user/my-app
  npx tsx upgrade.ts . --check

What it does:
  1. Checks current Next.js version
  2. Identifies breaking changes needed
  3. Runs official codemod (requires clean git)
  4. Provides manual fix guidance for remaining issues

Breaking changes covered:
  - Async params/searchParams/cookies/headers APIs
  - next.config.js to next.config.ts migration
  - Image component defaults
  - React 19 compatibility
  - Dynamic segment changes
`;

async function runUpgrade(projectPath: string, checkOnly: boolean): Promise<void> {
  console.log(`Next.js 16 Upgrade ${checkOnly ? "Check" : "Assistant"}`);
  console.log(`Project: ${projectPath}`);
  console.log("─".repeat(60));

  if (checkOnly) {
    console.log("Checking current version and compatibility...\n");
  } else {
    console.log("Requirements:");
    console.log("  - Clean git working directory (commit/stash changes)");
    console.log("  - Node.js 18+");
    console.log("  - npm/pnpm/yarn/bun installed\n");
  }

  try {
    const result = await callMcp("upgrade_nextjs_16", {
      project_path: projectPath,
    });
    const text = extractText(result);

    // Try to parse JSON response
    interface UpgradeResponse {
      success?: boolean;
      compatible?: boolean;
      currentVersion?: string;
      targetVersion?: string;
      changes?: string[];
      steps?: string[];
      error?: string;
      message?: string;
    }

    const parsed = parseJsonResponse<UpgradeResponse>(text);

    if (parsed?.error) {
      console.log(`Error: ${parsed.message || parsed.error}`);
      return;
    }

    if (parsed?.currentVersion || parsed?.changes) {
      if (parsed.currentVersion) {
        console.log(`Current version: ${parsed.currentVersion}`);
      }
      if (parsed.targetVersion) {
        console.log(`Target version: ${parsed.targetVersion}`);
      }
      if (parsed.compatible !== undefined) {
        console.log(`Compatible: ${parsed.compatible ? "Yes" : "No"}`);
      }
      if (parsed.changes && parsed.changes.length > 0) {
        console.log("\nRequired changes:");
        parsed.changes.forEach((c) => console.log(`  - ${c}`));
      }
      if (parsed.steps && parsed.steps.length > 0) {
        console.log("\nUpgrade steps:");
        parsed.steps.forEach((s, i) => console.log(`  ${i + 1}. ${s}`));
      }
    } else if (text) {
      // Fallback: print raw text
      console.log(text);
    } else {
      console.log("Upgrade guidance completed. Check output above.");
    }

    // Additional resources
    console.log("\n─".repeat(60));
    console.log("Resources:");
    console.log("  - Patterns: references/upgrade-patterns.md");
    console.log("  - Errors:   references/error-solutions.md");
    console.log('  - Docs:     npx tsx docs.ts search "migration"');
  } catch (error) {
    console.error("Error:", error instanceof Error ? error.message : error);
    console.log("\nManual upgrade steps:");
    console.log("  1. git status (ensure clean)");
    console.log("  2. npx @next/codemod@latest upgrade");
    console.log("  3. npm install next@latest react@latest react-dom@latest");
    console.log("  4. Fix remaining issues (see references/upgrade-patterns.md)");
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
const checkOnly = args.includes("--check");

if (!projectPath || projectPath.startsWith("--")) {
  console.error("Error: Project path required");
  console.log("Usage: npx tsx upgrade.ts <project_path>");
  process.exit(1);
}

runUpgrade(projectPath, checkOnly);
