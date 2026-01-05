/**
 * Post-install audit checklist for shadcn components
 * Usage: npx tsx audit.ts
 */

import { callMcp, extractText, closeMcp } from "./mcp-client";

async function main() {
  try {
    const result = await callMcp("get_audit_checklist", {});
    const text = extractText(result);

    console.log("=== SHADCN COMPONENT AUDIT CHECKLIST ===\n");

    if (text) {
      console.log(text);
    } else {
      // Fallback checklist
      console.log("After adding components, verify:\n");
      console.log("[ ] Import statements correct (named vs default exports)");
      console.log("[ ] All peer dependencies installed");
      console.log("[ ] TypeScript compilation passes");
      console.log("[ ] Tailwind classes rendering correctly");
      console.log("[ ] Component renders without errors");
      console.log("");
      console.log("Common issues:");
      console.log("");
      console.log("1. Missing cn() utility:");
      console.log("   Check @/lib/utils.ts exists with cn function");
      console.log("");
      console.log("2. Path aliases not configured:");
      console.log("   Verify tsconfig.json has @/* paths");
      console.log("");
      console.log("3. Tailwind not processing component classes:");
      console.log("   Add component paths to tailwind.config content[]");
      console.log("");
      console.log("4. Radix UI peer deps missing:");
      console.log("   Run: npm install @radix-ui/react-* (check package.json)");
    }

  } catch (error) {
    console.error("Error:", error instanceof Error ? error.message : error);
    // Still show fallback checklist on error
    console.log("\n=== FALLBACK CHECKLIST ===\n");
    console.log("[ ] Import statements correct");
    console.log("[ ] Dependencies installed");
    console.log("[ ] TypeScript passes");
    console.log("[ ] Components render");
  } finally {
    closeMcp();
  }
}

main();
