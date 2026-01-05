# Skill Development

## SKILL.md Format

```yaml
---
name: skill-name
description: This skill should be used when the user asks to "trigger phrase 1",
  "trigger phrase 2", "trigger phrase 3", or wants to accomplish specific goal.
version: 1.0.0
---

# Skill Title

Brief description of what this skill does.

## When to Use

- User asks to "specific phrase"
- User wants to accomplish X
- User mentions keyword Y

## Workflow

1. Step one
2. Step two
3. Step three

## Script Reference

| Script | Purpose | Usage |
|--------|---------|-------|
| `script.ts` | Description | `npx tsx ${CLAUDE_PLUGIN_ROOT}/skills/skill-name/scripts/script.ts [args]` |
```

## Frontmatter Fields

| Field | Required | Description |
|-------|----------|-------------|
| `name` | Yes | Skill identifier (lowercase, hyphenated) |
| `description` | Yes | Trigger patterns and use cases |
| `version` | Yes | Semantic version (e.g., 1.0.0) |

## Description Best Practices

Start with: `This skill should be used when the user asks to...`

Include:
- Quoted trigger phrases users might say
- Action verbs (create, generate, convert, add)
- Specific contexts (e.g., "from PRD", "for Next.js")

## Supporting Directories

| Directory | Purpose |
|-----------|---------|
| `scripts/` | TypeScript scripts executed via `npx tsx` |
| `references/` | Pattern docs, extraction rules, knowledge base |
| `assets/` | HTML templates, static files, configs |

## Content Sections

1. **Title** - Matches skill name
2. **Brief description** - 1-2 sentences
3. **When to Use** - Bullet list of use cases
4. **Workflow** - Step-by-step instructions
5. **Script Reference** - Table of available scripts
6. **Examples** - Usage demonstrations
