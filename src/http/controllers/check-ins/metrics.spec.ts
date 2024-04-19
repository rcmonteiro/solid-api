import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Check-in History (e2e)', async () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })

  it('should be able to list the user check in history', async () => {
    const { token } = await createAndAuthenticateUser()

    const { id: userId } = await prisma.user.findFirstOrThrow()

    const { id: gymId } = await prisma.gym.create({
      data: {
        title: 'Gym Test',
        description: 'Testing...',
        phone: '123456123',
        latitude: -26.9958203,
        longitude: -48.666327,
      },
    })

    await prisma.checkIn.createMany({
      data: [
        { gym_id: gymId, user_id: userId },
        { gym_id: gymId, user_id: userId },
        { gym_id: gymId, user_id: userId },
      ],
    })

    const response = await request(app.server)
      .get('/check-ins/metrics')
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual({ checkInsCount: 3 })
  })
})
