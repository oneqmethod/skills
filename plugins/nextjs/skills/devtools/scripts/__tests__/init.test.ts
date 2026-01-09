import { describe, it, expect, afterAll } from 'vitest'
import { callMcp, closeMcp } from '../mcp-client.js'

describe('init script', () => {
  afterAll(() => {
    closeMcp()
  })

  it('calls init MCP tool and returns response object', async () => {
    const result = await callMcp('init', {})
    expect(result).toBeDefined()
    expect(typeof result).toBe('object')
  })
})
