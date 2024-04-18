import { PrismaClient } from '@prisma/client'
import { describe, expect, it } from 'vitest'
import { prisma } from './prisma'

describe('Prisma client', () => {
  it('should be able init prisma', async () => {
    expect(prisma).toBeInstanceOf(PrismaClient)
  })
})
