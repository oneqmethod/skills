import { describe, it, expect, afterAll } from 'vitest'
import {
  startMcpServer,
  callMcp,
  extractText,
  parseJsonResponse,
  closeMcp,
} from '../mcp-client.js'

describe('mcp-client', () => {
  afterAll(() => {
    closeMcp()
  })

  describe('extractText', () => {
    it('extracts text from array content format', () => {
      const result = {
        content: [
          { type: 'text', text: 'Hello' },
          { type: 'text', text: 'World' },
        ],
      }
      expect(extractText(result)).toBe('Hello\nWorld')
    })

    it('extracts text from string content', () => {
      const result = { content: 'Direct string' }
      expect(extractText(result)).toBe('Direct string')
    })

    it('returns empty string for null/undefined', () => {
      expect(extractText(null)).toBe('')
      expect(extractText(undefined)).toBe('')
    })

    it('returns empty string for non-object', () => {
      expect(extractText('string')).toBe('')
      expect(extractText(123)).toBe('')
    })

    it('filters non-text content types', () => {
      const result = {
        content: [
          { type: 'text', text: 'Keep' },
          { type: 'image', text: 'Skip' },
          { type: 'text', text: 'This' },
        ],
      }
      expect(extractText(result)).toBe('Keep\nThis')
    })
  })

  describe('parseJsonResponse', () => {
    it('parses valid JSON string', () => {
      const json = '{"name": "test", "value": 123}'
      const result = parseJsonResponse<{ name: string; value: number }>(json)
      expect(result).toEqual({ name: 'test', value: 123 })
    })

    it('returns null for invalid JSON', () => {
      expect(parseJsonResponse('not json')).toBeNull()
      expect(parseJsonResponse('{invalid}')).toBeNull()
    })

    it('returns null for empty string', () => {
      expect(parseJsonResponse('')).toBeNull()
    })

    it('parses arrays', () => {
      const result = parseJsonResponse<number[]>('[1, 2, 3]')
      expect(result).toEqual([1, 2, 3])
    })
  })

  describe('closeMcp', () => {
    it('can be called multiple times safely', () => {
      closeMcp()
      closeMcp()
      closeMcp()
    })
  })

  describe('MCP server integration', () => {
    it('starts server and calls init tool', async () => {
      await startMcpServer()
      const result = await callMcp('init', {})
      expect(result).toBeDefined()
      expect(typeof result).toBe('object')
    })

    it('throws on unknown tool', async () => {
      await expect(callMcp('nonexistent_tool_12345', {})).rejects.toThrow()
    })
  })
})
