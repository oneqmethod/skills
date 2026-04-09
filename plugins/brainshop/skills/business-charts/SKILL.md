---
name: business-charts
description: This skill should be used when a Brainshop meeting conversation mentions "first paying customer", "MVP cost", "burn rate", "break-even", "how many users do we need", "what should we charge", "viability", "which features to build first", "effort vs value", "unit economics", "willingness to pay", "launch timeline", or when someone asks to "show me the curve", "visualize the startup journey", "plot the break-even", "draw the viability matrix", or "generate a chart from what we discussed".
version: 1.0.0
---

# Business Validation Charts

Surfaces the right business validation chart — with explanation — as a React component, extracted directly from meeting conversation context.

## When to Use

- Someone mentions their MVP build cost, launch timeline, or first paying customer moment
- Discussion of fixed costs, variable costs, and pricing (break-even territory)
- Debate about which features to prioritize (effort vs. customer value)
- Any explicit request to visualize or chart business viability

## Chart Selection Logic

Choose **one** chart per invocation based on what the conversation is about:

| Conversation Signal | Chart to Generate |
|---------------------|-------------------|
| MVP cost + launch timeline + first customer | MVP Validation Curve (J-Curve) |
| Fixed costs + variable cost/user + price/user + scale | Break-Even Analysis |
| List of features + effort estimates + value scores | Viability Matrix (2x2) |

When signals overlap, prefer the chart that answers the most pressing question being discussed.

## Workflow

1. **Scan the conversation** for the data signals listed in `references/data-extraction.md`
2. **Fill in defaults** for any missing values (clearly label them as estimates)
3. **Select the chart type** using the table above
4. **Output the React component** using the template from `references/chart-components.md`
5. **Append the explanation block** from `references/chart-components.md` for the chosen chart
6. Wrap the output in a clear code block labeled `// BrainshopChart — ready to render`

## Output Format

Always output:
1. A single self-contained React component (no external imports beyond `recharts`)
2. Immediately followed by the explanation section as a separate JSX block
3. A brief note listing which numbers came from the conversation vs. which are estimates

### Example Output Structure

```tsx
// BrainshopChart — ready to render
// Numbers from conversation: fixed cost ($5,000), price ($15/mo)
// Estimated: variable cost ($5/user), growth rate (20 users/mo)

import { ... } from 'recharts';

export function BreakEvenChart() {
  // ... component code
}

export function BreakEvenExplanation() {
  // ... explanation panel
}
```

## Script Reference

No scripts — this skill generates React component code directly from the conversation context using the reference files below.

## References

- `references/chart-components.md` — Full React/Recharts component templates for all three chart types
- `references/data-extraction.md` — What signals to look for and how to fill gaps with defaults
