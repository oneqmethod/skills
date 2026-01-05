/**
 * Get configured registries from components.json
 * Usage: npx tsx registries.ts
 */

import { closeMcp, getRegistries } from "./mcp-client";

async function main() {
  try {
    const registries = await getRegistries();

    console.log("=== CONFIGURED REGISTRIES ===\n");

    if (registries.length > 0) {
      for (const reg of registries) {
        console.log(`- ${reg}`);
      }
      console.log("");
      console.log("Use these registries in other scripts:");
      console.log(`  npx tsx list.ts     # Lists items from: ${registries.join(", ")}`);
      console.log(`  npx tsx search.ts   # Searches across: ${registries.join(", ")}`);
    } else {
      console.log("No registries found.");
      console.log("");
      console.log("If you haven't initialized shadcn yet, run:");
      console.log("  npx shadcn@latest init");
    }
  } catch (error) {
    console.error("Error:", error instanceof Error ? error.message : error);
    console.log("");
    console.log("Make sure you have a components.json file in your project.");
    console.log("Run 'npx shadcn@latest init' to create one.");
  } finally {
    closeMcp();
  }
}

main();
