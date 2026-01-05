# Marketplace Registration

## Registration Steps

1. **Add to marketplace.json**

   Edit `.claude-plugin/marketplace.json`:

   ```json
   {
     "plugins": [
       {
         "name": "plugin-name",
         "description": "Brief description",
         "source": "./plugins/plugin-name",
         "category": "development"
       }
     ]
   }
   ```

2. **Update README.md**

   Add plugin to root `README.md` with:
   - Plugin name and description
   - Features list
   - Prerequisites (if any)
   - Skills table

## marketplace.json Fields

| Field | Required | Description |
|-------|----------|-------------|
| `name` | Yes | Plugin identifier |
| `description` | Yes | Brief description |
| `source` | Yes | Relative path from marketplace root |
| `category` | Yes | Category (development, productivity, etc.) |

## Categories

- `development` - Dev tools, frameworks, code generation
- `productivity` - Automation, workflows, utilities
- `content` - Documentation, presentations, media

## README Structure

Follow existing plugin patterns:

```markdown
## Plugin Name

Brief description.

### Features

- Feature 1
- Feature 2

### Prerequisites

- Requirement 1

### Skills

| Skill | Description |
|-------|-------------|
| `skill-name` | What it does |
```

## Checklist Before Registration

- [ ] `plugin.json` has name, description, author
- [ ] `README.md` documents all features
- [ ] At least one skill with valid SKILL.md
- [ ] Scripts tested and working
- [ ] No hardcoded paths (use `${CLAUDE_PLUGIN_ROOT}`)
