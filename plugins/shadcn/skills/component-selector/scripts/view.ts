/**
 * View detailed information about specific registry items
 * Usage: npx tsx view.ts <item1> [item2] [item3] ...
 */

import { callMcp, extractText, closeMcp, getRegistries } from "./mcp-client";

const itemNames = process.argv.slice(2);
if (itemNames.length === 0) {
  console.error("Usage: npx tsx view.ts <item1> [item2] ...");
  console.error("");
  console.error("Examples:");
  console.error("  npx tsx view.ts button");
  console.error("  npx tsx view.ts button card dialog");
  console.error("  npx tsx view.ts sidebar-01 dashboard-01");
  console.error("  npx tsx view.ts @shadcn/button @acme/custom-card");
  process.exit(1);
}

async function main() {
  try {
    const registries = await getRegistries();
    const defaultRegistry = registries[0];

    // Format as @registry/item (use first configured registry as default)
    const items = itemNames.map((name) =>
      name.startsWith("@") ? name : `${defaultRegistry}/${name}`
    );

    const result = await callMcp("view_items_in_registries", {
      items,
    });

    const text = extractText(result);

    console.log("=== ITEM DETAILS ===\n");

    if (text) {
      console.log(text);
    } else {
      console.log("No details found for the specified items.");
      console.log("");
      console.log("Requested items:");
      for (const item of items) {
        console.log(`  - ${item}`);
      }
      console.log("");
      console.log("Try searching first: npx tsx search.ts <query>");
    }

    console.log("\n=== NEXT STEPS ===");
    console.log("• Get examples: npx tsx examples.ts <item-demo>");
    console.log(`• Install:      npx tsx add.ts ${itemNames.join(" ")}`);

  } catch (error) {
    console.error("Error:", error instanceof Error ? error.message : error);
    process.exit(1);
  } finally {
    closeMcp();
  }
}

main();
