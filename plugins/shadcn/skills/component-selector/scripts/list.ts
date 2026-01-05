/**
 * List and browse shadcn registry items
 * Usage: npx tsx list.ts [--type ui|block|example|theme|hook] [--offset N] [--limit N]
 */

import { callMcp, extractText, closeMcp } from "./mcp-client";
import { parseArgs } from "util";

const { values } = parseArgs({
  args: process.argv.slice(2),
  options: {
    type: { type: "string", short: "t" },
    offset: { type: "string", short: "o", default: "0" },
    limit: { type: "string", short: "l", default: "30" },
  },
  allowPositionals: false,
});

interface RegistryItem {
  name: string;
  type: string;
}

async function main() {
  try {
    const result = await callMcp("list_items_in_registries", {
      registries: ["@shadcn"],
      offset: parseInt(values.offset || "0"),
      limit: parseInt(values.limit || "30"),
    });

    const text = extractText(result);

    // Parse items
    const items: RegistryItem[] = [];
    const lines = text.split("\n");

    for (const line of lines) {
      const match = line.match(/^- (\S+) \(registry:(\w+)\)/);
      if (match) {
        const [, name, type] = match;
        if (values.type && type !== values.type) continue;
        items.push({ name, type });
      }
    }

    // Group by type
    const grouped: Record<string, string[]> = {};
    for (const item of items) {
      if (!grouped[item.type]) grouped[item.type] = [];
      grouped[item.type].push(item.name);
    }

    // Print summary
    console.log("=== REGISTRY SUMMARY ===\n");
    console.log("@shadcn registry contains ~438 items:");
    console.log("  - ui: ~55 core primitives (button, card, dialog, etc.)");
    console.log("  - block: ~180 pre-built features (dashboard-*, sidebar-*, login-*)");
    console.log("  - example: ~200 demo implementations (*-demo)");
    console.log("  - theme: 5 color schemes");
    console.log("  - hook: 1 (use-mobile)");
    console.log();

    // Print filtered results
    if (values.type) {
      console.log(`=== ${values.type.toUpperCase()} ITEMS ===\n`);
    } else {
      console.log("=== ITEMS BY TYPE ===\n");
    }

    for (const [type, names] of Object.entries(grouped)) {
      console.log(`${type.toUpperCase()} (${names.length}):`);
      for (const name of names) {
        console.log(`  - ${name}`);
      }
      console.log();
    }

    // Pagination info
    const offset = parseInt(values.offset || "0");
    const limit = parseInt(values.limit || "30");
    console.log("=== PAGINATION ===");
    console.log(`Showing items ${offset + 1}-${offset + items.length}`);
    if (items.length >= limit) {
      console.log(`Next page: npx tsx list.ts --offset ${offset + limit}`);
    }

  } catch (error) {
    console.error("Error:", error instanceof Error ? error.message : error);
    process.exit(1);
  } finally {
    closeMcp();
  }
}

main();
