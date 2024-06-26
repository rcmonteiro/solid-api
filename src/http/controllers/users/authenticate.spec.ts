import { app } from '@/app'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Authenticate (e2e)', async () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })

  it('should be able to authenticate', async () => {
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
    expect(responseSignin.statusCode).toEqual(200)
    expect(responseSignin.body).toEqual({
      token: expect.any(String),
    })
  })
})
