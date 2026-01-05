/**
 * Generate shadcn add command for components
 * Usage: npx tsx add.ts <component1> [component2] [component3] ...
 */

import { callMcp, extractText, closeMcp } from "./mcp-client";

const components = process.argv.slice(2);
if (components.length === 0) {
  console.error("Usage: npx tsx add.ts <component1> [component2] ...");
  console.error("");
  console.error("Examples:");
  console.error("  npx tsx add.ts button card");
  console.error("  npx tsx add.ts sidebar-01 dashboard-01");
  console.error("  npx tsx add.ts form field input button");
  process.exit(1);
}

async function main() {
  try {
    // Format as @shadcn/component
    const items = components.map((c) =>
      c.startsWith("@") ? c : `@shadcn/${c}`
    );

    const result = await callMcp("get_add_command_for_items", {
      items,
    });

    const text = extractText(result);

    console.log("=== INSTALL COMMAND ===\n");

    // Extract and clean up the command
    const cmdMatch = text.match(/npx shadcn[@\w]*\s+add\s+[^\n]+/);
    if (cmdMatch) {
      console.log(cmdMatch[0]);
    } else {
      // Fallback: construct command manually
      console.log(`npx shadcn@latest add ${components.join(" ")}`);
    }

    console.log("\n=== COMPONENTS ===\n");
    for (const comp of components) {
      console.log(`  - ${comp}`);
    }

    console.log("\n=== AFTER INSTALL ===");
    console.log("Run: npx tsx audit.ts  # Verify installation");

  } catch (error) {
    console.error("Error:", error instanceof Error ? error.message : error);
    process.exit(1);
  } finally {
    closeMcp();
  }
}

main();
