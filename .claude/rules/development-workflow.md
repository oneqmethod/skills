# Development Workflow

## Plugin-Dev Skills

Use these skills for guided development:

| Skill | When to Use |
|-------|-------------|
| `/plugin-dev:create-plugin` | Start new plugin from scratch |
| `/plugin-dev:skill-development` | Create/modify skills |
| `/plugin-dev:command-development` | Create slash commands |
| `/plugin-dev:hook-development` | Add event hooks |
| `/plugin-dev:mcp-integration` | Wrap MCP servers |
| `/plugin-dev:agent-development` | Create autonomous agents |
| `/plugin-dev:plugin-structure` | Understand layout |
| `/plugin-dev:plugin-settings` | Configuration patterns |

## New Plugin Workflow

1. **Plan**: Define plugin purpose and skills needed
2. **Create**: Run `/plugin-dev:create-plugin` or create manually
3. **Develop**: Add skills, scripts, references
4. **Test**: Validate with test project
5. **Register**: Add to marketplace.json
6. **Document**: Update README.md

## Adding Features

### New Skill
```
/plugin-dev:skill-development
```

### New Command
```
/plugin-dev:command-development
```

### New Hook
```
/plugin-dev:hook-development
```

### MCP Integration
```
/plugin-dev:mcp-integration
```

## Post-Development Checklist

- [ ] Skill triggers correctly on expected phrases
- [ ] Scripts execute without errors
- [ ] Output is valid JSON or readable text
- [ ] Token usage is reasonable
- [ ] Documentation is complete
- [ ] Registered in marketplace.json
- [ ] README.md updated
