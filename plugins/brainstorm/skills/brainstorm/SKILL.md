---
name: brainstorm
description: This skill should be used when the user asks to "brainstorm", "generate
  ideas", "help me think of", "let's brainstorm", "I need ideas for", "ideate",
  "come up with ideas", or wants to explore creative possibilities for any topic,
  product, feature, campaign, or challenge.
version: 1.0.0
---

# Brainstorm

Guided idea generation that produces structured, categorized lists of actionable ideas for any topic or challenge.

## When to Use

- User says "brainstorm [topic]"
- User asks "help me think of ideas for X"
- User wants to "ideate" or "come up with ideas"
- User needs creative options for a feature, campaign, name, or problem
- User says "let's brainstorm" or "I need ideas"

## Workflow

1. **Clarify the topic** — If not provided, ask: "What would you like to brainstorm about?"
2. **Gather context** — Ask one follow-up question to understand scope:
   - Who is the audience?
   - Are there constraints (time, budget, tech stack)?
   - What's the goal or desired outcome?
3. **Define 3–5 categories** — Identify themed clusters relevant to the topic (e.g., Quick Wins, Long-Term Plays, Unconventional, User Experience, Growth)
4. **Generate ideas** — Under each category, produce 3–5 concrete, specific, actionable ideas
5. **Present as structured list** — Format: Category heading → bulleted ideas beneath it
6. **Offer to go deeper** — Ask: "Want me to expand on any of these categories or ideas?"

## Output Format

```
## [Category 1]
- Idea A: brief description
- Idea B: brief description
- Idea C: brief description

## [Category 2]
- Idea D: brief description
...
```

## Guidelines

- Ideas should be **specific and actionable**, not vague ("add analytics" → "add a weekly email digest showing top 3 user actions")
- Aim for variety across categories — avoid repeating the same idea in different words
- Match the tone to the context (startup → punchy; enterprise → measured)
- Default to 4 categories × 4 ideas unless the user specifies otherwise

## Examples

**User**: "Brainstorm feature ideas for Brainshop"
**Claude**: Asks about the target user and goal, then produces categories like: Onboarding, Collaboration, AI Assistance, Retention, and Monetization — each with 4 specific feature ideas.

**User**: "I need ideas for a product launch campaign"
**Claude**: Asks about the audience and budget, then produces: Pre-Launch Buzz, Launch Day, Community Activation, Press & Influencers, Post-Launch Follow-up.
