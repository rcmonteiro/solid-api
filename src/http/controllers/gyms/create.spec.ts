import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Create Gym (e2e)', async () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a gym', async () => {
    const { token } = await createAndAuthenticateUser(app, 'ADMIN')
    const response = await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Gym Test',
        description: 'Testing...',
        phone: '123456123',
        latitude: -26.9958203,
        longitude: -48.666327,
      })
    expect(response.statusCode).toEqual(201)
  })
})
