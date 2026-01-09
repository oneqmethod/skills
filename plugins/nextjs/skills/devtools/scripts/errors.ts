#!/usr/bin/env npx tsx
/**
 * Get Compilation/Runtime Errors from Next.js Dev Server
 *
 * Usage:
 *   npx tsx errors.ts 3000
 *   npx tsx errors.ts 3000 --type runtime
 */

import {
  callMcp,
  extractText,
  parseJsonResponse,
  closeMcp,
} from "./mcp-client.js";

const HELP = `
Next.js Error Reporter

Usage:
  npx tsx errors.ts <port>
  npx tsx errors.ts <port> --type compile|runtime|all

Arguments:
  port   Port of running Next.js dev server (e.g., 3000)

Options:
  --type   Error type filter: compile, runtime, or all (default: all)

Examples:
  npx tsx errors.ts 3000
  npx tsx errors.ts 3000 --type compile
  npx tsx errors.ts 3001 --type runtime

Output includes:
  - Compilation errors (TypeScript, syntax)
  - Runtime errors (hydration, server component)
  - File locations and suggested fixes

Note: Tool name "get_errors" may vary by Next.js version.
Run 'npx tsx index.ts --port <port>' to see available tools.
`;

async function getErrors(port: string, errorType: string = "all"): Promise<void> {
  console.log(`Checking errors on port ${port} (type: ${errorType})...`);
  console.log("─".repeat(60));

  try {
    // Tool name may vary by Next.js version - common names: get_errors, getErrors, errors
    const mcpArgs: Record<string, unknown> = {
      port,
      toolName: "get_errors",
    };
    if (errorType !== "all") {
      mcpArgs.args = JSON.stringify({ type: errorType });
    }

    const result = await callMcp("nextjs_call", mcpArgs);
    const text = extractText(result);

    // Try to parse JSON response
    interface ErrorInfo {
      type: string;
      message: string;
      file?: string;
      line?: number;
      column?: number;
    }
    interface ErrorsResponse {
      success?: boolean;
      count?: number;
      errors?: ErrorInfo[];
      error?: string;
      message?: string;
    }

    const parsed = parseJsonResponse<ErrorsResponse>(text);

    if (parsed?.error) {
      console.log(`Error: ${parsed.message || parsed.error}`);
      return;
    }

    if (parsed?.errors && parsed.errors.length > 0) {
      console.log(`Found ${parsed.count || parsed.errors.length} error(s):\n`);
      for (const err of parsed.errors) {
        console.log(`  [${err.type}] ${err.message}`);
        if (err.file) {
          console.log(`    at ${err.file}${err.line ? `:${err.line}` : ""}`);
        }
      }
      console.log("\n─".repeat(60));
      console.log("Tips:");
      console.log("  - Fix errors in order (first error may cause others)");
      console.log("  - Re-run: npx tsx errors.ts " + port);
    } else if (parsed?.count === 0 || (parsed?.errors && parsed.errors.length === 0)) {
      console.log("✓ No errors found");
    } else if (text) {
      // Fallback: check raw text for error indicators
      if (
        text.toLowerCase().includes("no errors") ||
        text.toLowerCase().includes("0 errors")
      ) {
        console.log("✓ No errors found");
      } else {
        console.log(text);
      }
    } else {
      console.log("✓ No errors reported");
    }
  } catch (error) {
    console.error("Error:", error instanceof Error ? error.message : error);
    console.log("\nTroubleshooting:");
    console.log(`  1. Verify dev server is running: curl http://localhost:${port}`);
    console.log("  2. Ensure Next.js 16+ is installed");
    console.log("  3. Check server discovery: npx tsx index.ts");
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
  console.log("Usage: npx tsx errors.ts <port>");
  process.exit(1);
}

let errorType = "all";
const typeIdx = args.indexOf("--type");
if (typeIdx !== -1 && args[typeIdx + 1]) {
  errorType = args[typeIdx + 1];
}

getErrors(port, errorType);
