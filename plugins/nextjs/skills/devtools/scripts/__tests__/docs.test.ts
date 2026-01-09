import { describe, it, expect, afterAll } from 'vitest'
import { callMcp, extractText, readResource, closeMcp } from '../mcp-client.js'

describe('docs script', () => {
  afterAll(() => {
    closeMcp()
  })

  it('reads llms-index resource with documentation links', async () => {
    const index = await readResource('nextjs-docs://llms-index')
    expect(typeof index).toBe('string')
    expect(index.length).toBeGreaterThan(0)
    expect(index).toContain('/docs/')
  })

  it('fetches documentation by path and returns content', async () => {
    const result = await callMcp('nextjs_docs', {
      path: '/docs/app/building-your-application/routing',
    })
    expect(result).toBeDefined()
    const text = extractText(result)
    expect(text.length).toBeGreaterThan(0)
  })
})
