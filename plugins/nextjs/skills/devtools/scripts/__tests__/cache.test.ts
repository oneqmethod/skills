import { describe, it, expect, afterAll } from 'vitest'
import { callMcp, extractText, closeMcp } from '../mcp-client.js'

describe('cache script', () => {
  afterAll(() => {
    closeMcp()
  })

  it('calls enable_cache_components and extracts text', async () => {
    const result = await callMcp('enable_cache_components', {
      project_path: '.',
    })
    expect(result).toBeDefined()
    const text = extractText(result)
    expect(typeof text).toBe('string')
  })
})
