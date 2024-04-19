import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Search Gyms (e2e)', async () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })

  it('should be able to search gyms', async () => {
    const { token } = await createAndAuthenticateUser()

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Gym Test 01',
        description: 'Testing...',
        phone: '123456123',
        latitude: -26.9958203,
        longitude: -48.666327,
      })
    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Gym Test 02',
        description: 'Testing...',
        phone: '123456123',
        latitude: -26.9958203,
        longitude: -48.666327,
      })

    const response = await request(app.server)
      .get(`/gyms/search`)
      .query({
        query: 'test 01',
      })
      .set('Authorization', `Bearer ${token}`)
      .send()
    expect(response.statusCode).toEqual(200)
    expect(response.body.gyms).toHaveLength(1)
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: 'Gym Test 01',
      }),
    ])
  })

  it('should not be able to search gyms passing without query', async () => {
    const { token } = await createAndAuthenticateUser()

    const response = await request(app.server)
      .get(`/gyms/search`)
      .set('Authorization', `Bearer ${token}`)
      .send()
    expect(response.statusCode).toEqual(400)
  })
})
