import { describe, expect, it } from 'vitest'
import { env } from '.'

describe('Env variables validation', () => {
  it('should be able read all env variables', async () => {
    expect(env.NODE_ENV).toBeDefined()
    expect(env.DATABASE_URL).toBeDefined()
    expect(env.PORT).toBeDefined()
  })
})
