#!/usr/bin/env npx tsx
/**
 * Browser Automation for Next.js Testing
 *
 * Usage:
 *   npx tsx browser.ts start [--headless]
 *   npx tsx browser.ts navigate <url>
 *   npx tsx browser.ts screenshot [--fullpage]
 *   npx tsx browser.ts click <element>
 *   npx tsx browser.ts type <element> <text>
 *   npx tsx browser.ts console [--errors-only]
 *   npx tsx browser.ts evaluate <script>
 *   npx tsx browser.ts close
 */

import {
  callMcp,
  extractText,
  parseJsonResponse,
  closeMcp,
} from "./mcp-client.js";

const HELP = `
Next.js Browser Automation (Playwright)

Usage:
  npx tsx browser.ts <action> [options]

Actions:
  test <url>                   Quick test: start browser, navigate, screenshot, console, close
  start [--headless]           Start browser (auto-installs Playwright if needed)
  navigate <url>               Navigate to URL
  screenshot [--fullpage]      Take screenshot
  click <element>              Click element (CSS selector or description)
  type <element> <text>        Type text into element
  console [--errors-only]      Get browser console messages
  evaluate <script>            Execute JavaScript in page
  close                        Close browser

Examples:
  npx tsx browser.ts test http://localhost:3000    # Quick test (recommended)
  npx tsx browser.ts start
  npx tsx browser.ts navigate http://localhost:3000
  npx tsx browser.ts screenshot
  npx tsx browser.ts click "button.submit"
  npx tsx browser.ts console --errors-only
  npx tsx browser.ts close

IMPORTANT: Each script call spawns a new MCP server, so browser sessions
don't persist between calls. Use 'test' for quick verification, or use
the MCP tools directly for multi-step workflows.
`;

type BrowserAction =
  | "start"
  | "navigate"
  | "screenshot"
  | "click"
  | "type"
  | "console_messages"
  | "evaluate"
  | "close";

async function quickTest(url: string): Promise<void> {
  console.log(`Quick test: ${url}`);
  console.log("─".repeat(60));

  try {
    // Start browser
    console.log("1. Starting browser...");
    await callMcp("browser_eval", { action: "start", headless: true });

    // Navigate
    console.log(`2. Navigating to ${url}...`);
    const navResult = await callMcp("browser_eval", { action: "navigate", url });
    const navText = extractText(navResult);

    // Extract page title from result
    const titleMatch = navText.match(/Page Title: (.+)/);
    if (titleMatch) {
      console.log(`   Page title: ${titleMatch[1]}`);
    }

    // Screenshot
    console.log("3. Taking screenshot...");
    const ssResult = await callMcp("browser_eval", { action: "screenshot" });
    const ssText = extractText(ssResult);
    const ssMatch = ssText.match(/\[Screenshot[^\]]*\]\(([^)]+)\)/);
    if (ssMatch) {
      console.log(`   Saved: ${ssMatch[1]}`);
    }

    // Console messages
    console.log("4. Checking console...");
    const consoleResult = await callMcp("browser_eval", { action: "console_messages", errorsOnly: true });
    const consoleText = extractText(consoleResult);
    if (consoleText.includes("[ERROR]") || consoleText.includes("[WARN]")) {
      console.log("   ⚠ Errors/warnings found:");
      console.log(consoleText);
    } else {
      console.log("   ✓ No errors in console");
    }

    // Close
    console.log("5. Closing browser...");
    await callMcp("browser_eval", { action: "close" });

    console.log("\n─".repeat(60));
    console.log("✓ Quick test completed");
  } catch (error) {
    console.error("Error:", error instanceof Error ? error.message : error);
  } finally {
    closeMcp();
  }
}

async function browserAction(
  action: BrowserAction,
  options: Record<string, unknown> = {}
): Promise<void> {
  console.log(`Browser: ${action}...`);
  console.log("─".repeat(60));

  try {
    const mcpArgs: Record<string, unknown> = { action, ...options };

    const result = await callMcp("browser_eval", mcpArgs);
    const text = extractText(result);

    // Try to parse JSON response
    interface BrowserResponse {
      success?: boolean;
      url?: string;
      title?: string;
      screenshot?: string;
      result?: unknown;
      messages?: Array<{ level: string; text: string }>;
      error?: string;
      message?: string;
    }

    const parsed = parseJsonResponse<BrowserResponse>(text);

    if (parsed?.error) {
      console.log(`Error: ${parsed.message || parsed.error}`);
      return;
    }

    if (parsed?.success !== undefined) {
      if (parsed.url) console.log(`URL: ${parsed.url}`);
      if (parsed.title) console.log(`Title: ${parsed.title}`);
      if (parsed.screenshot) console.log(`Screenshot: ${parsed.screenshot}`);
      if (parsed.result !== undefined) {
        console.log(
          "Result:",
          typeof parsed.result === "string"
            ? parsed.result
            : JSON.stringify(parsed.result, null, 2)
        );
      }
      if (parsed.messages && parsed.messages.length > 0) {
        console.log("Console messages:");
        parsed.messages.forEach((m) => console.log(`  [${m.level}] ${m.text}`));
      }
      if (
        !parsed.url &&
        !parsed.title &&
        !parsed.screenshot &&
        parsed.result === undefined &&
        !parsed.messages
      ) {
        console.log(`✓ Action '${action}' completed`);
      }
    } else if (text) {
      // Fallback: print raw text
      console.log(text);
    } else {
      console.log(`✓ Action '${action}' completed`);
    }
  } catch (error) {
    console.error("Error:", error instanceof Error ? error.message : error);

    if (action === "start") {
      console.log("\nTroubleshooting:");
      console.log("  1. Playwright may need to install browsers:");
      console.log("     npx playwright install chromium");
      console.log("  2. Ensure next-devtools-mcp is installed");
    }
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

const action = args[0];

switch (action) {
  case "test": {
    // Quick test workflow: start, navigate, screenshot, console, close
    const url = args[1];
    if (!url) {
      console.error("Error: URL required");
      console.log("Usage: npx tsx browser.ts test <url>");
      process.exit(1);
    }
    quickTest(url);
    break;
  }

  case "start": {
    const headless = args.includes("--headless");
    browserAction("start", { headless });
    break;
  }

  case "navigate": {
    const url = args[1];
    if (!url) {
      console.error("Error: URL required");
      console.log("Usage: npx tsx browser.ts navigate <url>");
      process.exit(1);
    }
    browserAction("navigate", { url });
    break;
  }

  case "screenshot": {
    const fullPage = args.includes("--fullpage");
    browserAction("screenshot", { fullPage });
    break;
  }

  case "click": {
    const element = args[1];
    if (!element) {
      console.error("Error: Element selector required");
      console.log("Usage: npx tsx browser.ts click <element>");
      process.exit(1);
    }
    browserAction("click", { element });
    break;
  }

  case "type": {
    const element = args[1];
    const text = args[2];
    if (!element || !text) {
      console.error("Error: Element and text required");
      console.log("Usage: npx tsx browser.ts type <element> <text>");
      process.exit(1);
    }
    browserAction("type", { element, text });
    break;
  }

  case "console": {
    const errorsOnly = args.includes("--errors-only");
    browserAction("console_messages", { errorsOnly });
    break;
  }

  case "evaluate": {
    const script = args[1];
    if (!script) {
      console.error("Error: Script required");
      console.log("Usage: npx tsx browser.ts evaluate <script>");
      process.exit(1);
    }
    browserAction("evaluate", { script });
    break;
  }

  case "close": {
    browserAction("close", {});
    break;
  }

  default:
    console.error(`Unknown action: ${action}`);
    console.log("Use --help for usage information");
    process.exit(1);
}
