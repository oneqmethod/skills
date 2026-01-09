import { describe, it, expect, afterAll } from 'vitest'
import { callMcp, extractText, closeMcp } from '../mcp-client.js'

describe('upgrade script', () => {
  afterAll(() => {
    closeMcp()
  })

  it('calls upgrade_nextjs_16 and extracts text', async () => {
    const result = await callMcp('upgrade_nextjs_16', {
      project_path: '.',
    })
    expect(result).toBeDefined()
    const text = extractText(result)
    expect(typeof text).toBe('string')
  })
})
