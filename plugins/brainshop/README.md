# Brainshop Business Charts

Generates interactive business validation charts during Brainshop meetings. When a conversation touches on startup viability, MVP cost, pricing, or first paying customers, this skill surfaces the right chart — with a plain-language explanation — as a React component ready to render in the Brainshop UI.

### Features

- Detects chart-worthy moments from live meeting transcripts
- Extracts numbers (costs, pricing, timelines) from natural conversation
- Outputs self-contained React components using Recharts
- Styled for Brainshop's dark navy UI
- Each chart includes an explanation panel so users understand what they're seeing
- Three chart types covering the full MVP validation journey

### Prerequisites

- `recharts` installed in the Brainshop frontend (`npm install recharts`)
- React 18+

### Skills

| Skill | Description |
|-------|-------------|
| `business-charts` | Detects viability/MVP moments in meeting conversations and generates the appropriate React chart component with explanation |

### Chart Types

| Chart | Triggered When |
|-------|---------------|
| MVP Validation Curve (J-Curve) | Discussion of MVP build cost, launch timeline, first paying customer |
| Break-Even Analysis | Discussion of fixed costs, variable costs, pricing, and scale |
| Viability Matrix | Discussion of which features to build, effort vs. value trade-offs |
