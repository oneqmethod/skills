import { describe, it, expect, afterAll } from 'vitest'
import { callMcp, extractText, closeMcp } from '../mcp-client.js'

describe('routes script', () => {
  afterAll(() => {
    closeMcp()
  })

  it('calls nextjs_call with get_routes and extracts text', async () => {
    const result = await callMcp('nextjs_call', {
      port: '3000',
      toolName: 'get_routes',
    })
    expect(result).toBeDefined()
    const text = extractText(result)
    expect(typeof text).toBe('string')
  })
})
