import { describe, it, expect, afterAll } from 'vitest'
import { callMcp, extractText, closeMcp } from '../mcp-client.js'

describe('call script', () => {
  afterAll(() => {
    closeMcp()
  })

  it('calls nextjs_call with tool name and extracts text', async () => {
    const result = await callMcp('nextjs_call', {
      port: '3000',
      toolName: 'get_errors',
    })
    expect(result).toBeDefined()
    const text = extractText(result)
    expect(typeof text).toBe('string')
  })

  it('passes object args correctly', async () => {
    const result = await callMcp('nextjs_call', {
      port: '3000',
      toolName: 'get_errors',
      args: { type: 'all' },
    })
    expect(result).toBeDefined()
  })
})
