import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Check-in (e2e)', async () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })

  it('should be able to check in', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const { id: gymId } = await prisma.gym.create({
      data: {
        title: 'Gym Test',
        description: 'Testing...',
        phone: '123456123',
        latitude: -26.9958203,
        longitude: -48.666327,
      },
    })

    const response = await request(app.server)
      .post(`/gyms/${gymId}/check-ins`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        latitude: -26.9958203,
        longitude: -48.666327,
      })
    expect(response.statusCode).toEqual(201)
  })
})
