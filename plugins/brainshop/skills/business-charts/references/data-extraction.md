# Data Extraction from Meeting Conversations

## How to extract chart inputs from live conversation

Scan the transcript for these signals and map them to chart config values. When a value is not mentioned, use the listed default and mark it clearly as an estimate in the output comment.

---

## MVP Validation Curve — Signal Mapping

### Trigger phrases
- "how much will it cost to build"
- "first paying customer"
- "when do we launch"
- "burn rate", "runway"
- "MVP timeline", "MVP budget"
- "proof of viability"
- "first dollar"

### Extraction rules

| CONFIG key | Listen for | Example phrases |
|------------|-----------|-----------------|
| `totalBurnCost` | Dollar amount to build/launch | "it'll cost us about $5k", "we're spending $8,000 to get to launch", "around 3 grand all-in" |
| `weeksToLaunch` | Time to launch in weeks | "we'll launch in 6 weeks", "two months to go live", "end of the month" (convert to weeks) |
| `firstCustomerWeek` | When first customer is expected | "we expect our first sale by week 10", "within a month of launch", "first customer in 4 weeks post-launch" (add to `weeksToLaunch`) |
| `pricePerCustomer` | Price of first sale | "$50/month subscription", "$500 one-time", "charging $29 per seat" |

### Defaults when not stated
```
totalBurnCost: 3000           // Conservative startup
weeksToLaunch: 6              // Lean MVP assumption
firstCustomerWeek: weeksToLaunch + 4   // 4 weeks post-launch
pricePerCustomer: 49          // Common SaaS entry price
```

---

## Break-Even Analysis — Signal Mapping

### Trigger phrases
- "how many users do we need"
- "when do we break even"
- "unit economics"
- "is this viable at scale"
- "what's our margin"
- "cost per user", "cost to serve"
- "server costs", "support cost per customer"

### Extraction rules

| CONFIG key | Listen for | Example phrases |
|------------|-----------|-----------------|
| `fixedCost` | Total upfront investment | "we spent $5k building this", "initial development was $12,000", "fixed overhead is $2k/month" |
| `variableCostPerUser` | Cost that scales with each user | "$5 per user for hosting", "support costs us $3 per customer", "AWS bill goes up $8 per user" |
| `pricePerUser` | Revenue per paying user | "$15 per month per user", "charging $29/seat", "$99 one-time" (divide by expected lifetime in months for monthly equivalent) |

### Defaults when not stated
```
fixedCost: 5000
variableCostPerUser: 5
pricePerUser: 29    // Common SaaS price
```

### Edge case: No variable cost mentioned
If the product is purely software with negligible per-user cost, use `variableCostPerUser: 1` (representing minimal support overhead).

---

## Viability Matrix — Signal Mapping

### Trigger phrases
- "which features should we build"
- "what goes in the MVP"
- "effort vs value"
- "should we include X"
- "priority", "prioritize"
- "feature list"
- "what's most important to users"

### Extraction rules

Extract each feature mentioned and score it:

**Value score (1–10):** Infer from:
- "users love it / must-have / won't use without" → 9–10
- "really want / high demand" → 7–8
- "nice to have / some users want" → 5–6
- "rarely mentioned / minor request" → 3–4
- "internal convenience / no user demand" → 1–2

**Cost score (1–10):** Infer from:
- "massive lift / months of work / requires new architecture" → 9–10
- "significant work / few weeks" → 7–8
- "moderate / a sprint or two" → 5–6
- "quick / a few days" → 3–4
- "trivial / config change / hours" → 1–2

### Minimum feature set
Always include at least 4 features. If fewer than 4 are mentioned, prompt with:
> "I can see features X and Y from the conversation. Should I add estimated placeholders for other common features in this space, or can you name 2 more to plot?"

---

## General Extraction Guidelines

1. **Currency detection**: If amounts are mentioned in other currencies (€, £, ₪), note the currency and set `CONFIG.currency` accordingly.

2. **Time unit normalization**: Convert all time references to weeks:
   - "a month" → 4 weeks
   - "6 months" → 24 weeks
   - "a quarter" → 13 weeks
   - "end of the year" → calculate from current context

3. **Ambiguous numbers**: When a number could map to multiple fields (e.g., "$500" could be price or cost), pick the interpretation that fits context and note it in the output comment.

4. **Missing critical value**: If `pricePerUser` or `pricePerCustomer` is completely absent and you cannot infer it, output the chart but prompt the user:
   > "I used $49/month as a placeholder price — what are you planning to charge?"

5. **Estimates label**: In the output comment block, always distinguish:
   ```tsx
   // From conversation: fixedCost ($5,000), weeksToLaunch (8)
   // Estimated:         variableCostPerUser ($5), pricePerUser ($29)
   ```
