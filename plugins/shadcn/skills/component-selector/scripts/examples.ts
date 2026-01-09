/**
 * Get usage examples for shadcn components
 * Usage: npx tsx examples.ts [@registry/]<query>
 *
 * Common patterns:
 *   npx tsx examples.ts "button-demo"
 *   npx tsx examples.ts "@shadcn/button-demo"
 *   npx tsx examples.ts "form-rhf-demo"
 *   npx tsx examples.ts "accordion example"
 */

import { callMcp, extractText, closeMcp, getRegistries, parseRegistryQuery } from "./mcp-client";

const arg = process.argv[2];
if (!arg) {
  console.error("Usage: npx tsx examples.ts [@registry/]<query>");
  console.error("");
  console.error("Examples:");
  console.error('  npx tsx examples.ts "button-demo"');
  console.error('  npx tsx examples.ts "@shadcn/button-demo"');
  console.error('  npx tsx examples.ts "form-rhf-demo"');
  console.error('  npx tsx examples.ts "accordion example"');
  console.error('  npx tsx examples.ts "card-with-form"');
  process.exit(1);
}

const { registry, query } = parseRegistryQuery(arg);

async function main() {
  try {
    const registries = registry ? [registry] : await getRegistries();
    const result = await callMcp("get_item_examples_from_registries", {
      registries,
      query,
    });

    const text = extractText(result);

    if (!text || text.includes("No examples found")) {
      console.log(`No examples found for "${query}"`);
      console.log("");
      console.log("Try these patterns:");
      console.log("  - {component}-demo (e.g., button-demo, card-demo)");
      console.log("  - {component}-with-{feature} (e.g., card-with-form)");
      console.log("  - form-{library}-demo (e.g., form-rhf-demo, form-tanstack-demo)");
      return;
    }

    console.log(`=== EXAMPLES FOR "${query}" ===\n`);
    console.log(text);

    // Extract and highlight imports
    const importMatches = text.matchAll(/import\s+{[^}]+}\s+from\s+["'][^"']+["']/g);
    const imports = [...importMatches].map((m) => m[0]);

    if (imports.length > 0) {
      console.log("\n=== REQUIRED IMPORTS ===\n");
      for (const imp of imports) {
        console.log(imp);
      }
    }

  } catch (error) {
    console.error("Error:", error instanceof Error ? error.message : error);
    process.exit(1);
  } finally {
    closeMcp();
  }
}

main();
