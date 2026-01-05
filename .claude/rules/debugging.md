# Debugging

## Common Issues

### MCP Connection Failures

**Symptoms**: Script hangs or times out

**Solutions**:
- Check MCP server command is correct
- Verify `npx` can find the package
- Add timeout to MCP calls (30s recommended)
- Check stderr for error messages

```typescript
mcpProcess.stderr?.on("data", (data) => {
  console.error("MCP stderr:", data.toString());
});
```

### Script Timeouts

**Symptoms**: Script doesn't return

**Solutions**:
- Add explicit timeout wrapper
- Ensure `closeMcp()` is called in finally block
- Check for infinite loops in response handling

### Invalid JSON Output

**Symptoms**: Claude can't parse script output

**Solutions**:
- Use `JSON.stringify(result, null, 2)`
- Don't mix console.log with JSON output
- Check for unhandled Promise rejections

### Plugin Not Loading

**Symptoms**: Skill doesn't trigger

**Solutions**:
- Verify plugin.json is valid JSON
- Check SKILL.md frontmatter syntax
- Ensure description contains trigger phrases
- Run `/memory` to check loaded plugins

### Token Issues

**Symptoms**: Context too large

**Solutions**:
- Switch to code-mode scripts (98% savings)
- Limit output size in scripts
- Filter unnecessary data before return

## Debugging Steps

1. **Check plugin.json**
   ```bash
   cat plugins/name/.claude-plugin/plugin.json | jq .
   ```

2. **Validate SKILL.md frontmatter**
   ```bash
   head -10 plugins/name/skills/skill/SKILL.md
   ```

3. **Test script directly**
   ```bash
   npx tsx plugins/name/skills/skill/scripts/script.ts --help
   ```

4. **Check MCP server**
   ```bash
   npx mcp-server-name --version
   ```

## JSON-RPC Debugging

Add request/response logging:

```typescript
console.error("Request:", JSON.stringify(request));
// ... send request
console.error("Response:", JSON.stringify(response));
```

## Error Patterns

| Error | Cause | Fix |
|-------|-------|-----|
| `ENOENT` | Script not found | Check path, use `${CLAUDE_PLUGIN_ROOT}` |
| `TIMEOUT` | MCP not responding | Check server, add timeout |
| `SyntaxError` | Invalid JSON | Validate with `jq` |
| `YAML parse error` | Bad frontmatter | Check SKILL.md format |
