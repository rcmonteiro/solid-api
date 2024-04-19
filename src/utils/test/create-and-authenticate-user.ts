import { app } from '@/app'
import request from 'supertest'

export const createAndAuthenticateUser = async () => {
  await request(app.server).post('/users').send({
    name: 'John Doe',
    email: 'john@doe.com',
    password: '123456',
  })

  const responseSignin = await request(app.server).post('/sessions').send({
    email: 'john@doe.com',
    password: '123456',
  })

  const { token } = responseSignin.body

  return { token }
}
