import { describe, it, expect, afterAll } from 'vitest'
import { callMcp, extractText, closeMcp } from '../mcp-client.js'

describe('errors script', () => {
  afterAll(() => {
    closeMcp()
  })

  it('calls nextjs_call with get_errors and extracts text', async () => {
    const result = await callMcp('nextjs_call', {
      port: '3000',
      toolName: 'get_errors',
    })
    expect(result).toBeDefined()
    const text = extractText(result)
    expect(typeof text).toBe('string')
  })
})
