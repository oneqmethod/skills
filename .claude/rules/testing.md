# Testing

## Test Project Setup

Create minimal test environment in plugin directory:

```
plugins/{plugin-name}/
├── test-project/          # or test-app/
│   └── config-file        # Minimal config for testing
```

### Examples

**shadcn**: `test-project/components.json`
```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true
}
```

**nextjs**: `test-app/` with full Next.js 16 setup

## Script Testing

Test each script with sample inputs:

```bash
# Search
npx tsx scripts/search.ts --query "button"

# List
npx tsx scripts/list.ts --limit 10

# View
npx tsx scripts/view.ts --name "component-name"
```

## Validation Checklist

### Scripts
- [ ] All scripts execute without errors
- [ ] Arguments parsed correctly
- [ ] Output is valid JSON
- [ ] MCP connections close properly
- [ ] Timeouts handled gracefully

### SKILL.md
- [ ] Frontmatter is valid YAML
- [ ] Name matches directory name
- [ ] Description contains trigger phrases
- [ ] Version follows semver

### Plugin
- [ ] plugin.json is valid JSON
- [ ] README documents all features
- [ ] No hardcoded absolute paths

## Manual Testing

1. Load plugin in Claude Code
2. Try trigger phrases from SKILL.md description
3. Verify skill activates correctly
4. Test each script command
5. Check output formatting

## Pre-Submission

- [ ] All scripts tested
- [ ] Skill triggers correctly
- [ ] Documentation complete
- [ ] No sensitive data in code
- [ ] Dependencies documented
