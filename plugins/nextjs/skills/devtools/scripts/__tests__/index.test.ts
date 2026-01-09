import { describe, it, expect, afterAll } from 'vitest'
import { callMcp, extractText, closeMcp } from '../mcp-client.js'

describe('index script - server discovery', () => {
  afterAll(() => {
    closeMcp()
  })

  it('calls nextjs_index tool and returns parseable response', async () => {
    const result = await callMcp('nextjs_index', {})
    expect(result).toBeDefined()
    const text = extractText(result)
    expect(typeof text).toBe('string')
  })
})
