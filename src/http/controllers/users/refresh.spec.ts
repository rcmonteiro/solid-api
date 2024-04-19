import { app } from '@/app'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Refresh Token (e2e)', async () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })

  it('should be able to refresh a valid token', async () => {
    const responseSignup = await request(app.server).post('/users').send({
      name: 'John Doe',
      email: 'john@doe.com',
      password: '123456',
    })
    expect(responseSignup.statusCode).toEqual(201)

    const responseSignin = await request(app.server).post('/sessions').send({
      email: 'john@doe.com',
      password: '123456',
    })

    const cookies = responseSignin.get('Set-Cookie') ?? []

    const response = await request(app.server)
      .patch('/token/refresh')
      .set('Cookie', cookies)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual({
      token: expect.any(String),
    })
    expect(response.get('Set-Cookie')).toEqual([
      expect.stringContaining('refreshToken='),
    ])
  })
})
