import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    include: ['plugins/**/*.test.ts'],
    testTimeout: 60000,  // MCP calls can be slow
  },
})
