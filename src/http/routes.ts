import { FastifyInstance } from 'fastify'
import { register } from './controllers/register'

export const routes = async (app: FastifyInstance) => {
  app.post('/users', register)
}
