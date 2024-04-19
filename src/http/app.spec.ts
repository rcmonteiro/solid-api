import { app } from '@/app'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('General routes (e2e)', async () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })

  it('should be able to get a valid route', async () => {
    const responseSignin = await request(app.server).get('/health').send()
    expect(responseSignin.statusCode).toEqual(200)
    expect(responseSignin.body).toEqual({
      status: 'ok',
    })
  })

  it('should not be able to get a invalid route', async () => {
    const responseSignin = await request(app.server).get('/invalid').send()
    expect(responseSignin.statusCode).toEqual(404)
  })
})
