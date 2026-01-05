/**
 * Search shadcn registry and auto-fetch details for top results
 * Usage: npx tsx search.ts "query" [--type ui|block|example] [--limit N]
 */

import { callMcp, extractText, closeMcp } from "./mcp-client";
import { parseArgs } from "util";

const { values, positionals } = parseArgs({
  args: process.argv.slice(2),
  options: {
    type: { type: "string", short: "t" },
    limit: { type: "string", short: "l", default: "10" },
  },
  allowPositionals: true,
});

const query = positionals[0];
if (!query) {
  console.error("Usage: npx tsx search.ts <query> [--type ui|block|example] [--limit N]");
  process.exit(1);
}

interface SearchItem {
  name: string;
  type: string;
  registry: string;
  description?: string;
}

async function main() {
  try {
    // Search registry
    const searchResult = await callMcp("search_items_in_registries", {
      registries: ["@shadcn"],
      query,
      limit: parseInt(values.limit || "10"),
    });

    const searchText = extractText(searchResult);

    // Parse search results
    const items: SearchItem[] = [];
    const lines = searchText.split("\n");

    for (const line of lines) {
      // Match: - name (registry:type) [@registry]
      const match = line.match(/^- (\S+) \(registry:(\w+)\) \[@(\w+)\]/);
      if (match) {
        const [, name, type, registry] = match;

        // Filter by type if specified
        if (values.type && type !== values.type) continue;

        items.push({ name, type, registry });
      }
    }

    if (items.length === 0) {
      console.log(`No results found for "${query}"`);
      if (values.type) {
        console.log(`Try removing --type ${values.type} filter`);
      }
      return;
    }

    // Group by type
    const grouped: Record<string, SearchItem[]> = {};
    for (const item of items) {
      if (!grouped[item.type]) grouped[item.type] = [];
      grouped[item.type].push(item);
    }

    console.log(`Found ${items.length} items for "${query}":\n`);

    // Get details for top 5 UI components
    const topItems = items.slice(0, 5);
    if (topItems.length > 0) {
      const viewResult = await callMcp("view_items_in_registries", {
        items: topItems.map((i) => `@${i.registry}/${i.name}`),
      });
      const viewText = extractText(viewResult);

      // Print detailed view
      console.log("=== TOP RESULTS (with details) ===\n");
      console.log(viewText);
    }

    // Print remaining grouped results
    console.log("\n=== ALL MATCHES BY TYPE ===\n");
    for (const [type, typeItems] of Object.entries(grouped)) {
      console.log(`${type.toUpperCase()} (${typeItems.length}):`);
      for (const item of typeItems) {
        console.log(`  - ${item.name}`);
      }
      console.log();
    }

    // Suggest next steps
    console.log("=== NEXT STEPS ===");
    console.log(`npx tsx examples.ts "${items[0]?.name}-demo"  # Get usage examples`);
    console.log(`npx tsx add.ts ${items.slice(0, 3).map(i => i.name).join(" ")}  # Install components`);

  } catch (error) {
    console.error("Error:", error instanceof Error ? error.message : error);
    process.exit(1);
  } finally {
    closeMcp();
  }
}

main();
