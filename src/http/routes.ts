import { FastifyInstance } from 'fastify'
import { authenticate } from './controllers/authenticate'
import { register } from './controllers/register'

export const routes = async (app: FastifyInstance) => {
  app.post('/users', register)
  app.post('/sessions', authenticate)
}
