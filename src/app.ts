import { checkInRoutes } from '@/http/controllers/check-ins/routes'
import { gymRoutes } from '@/http/controllers/gyms/routes'
import { userRoutes } from '@/http/controllers/users/routes'
import fastifyCookie from '@fastify/cookie'
import fastifyCors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUI from '@fastify/swagger-ui'
import fastify from 'fastify'
import { ZodError } from 'zod'
import { env } from './env'

export const app = fastify()

app.register(fastifyCookie)

app.register(fastifyCors, {
  origin: '*', // TODO: fix me (can be better, maybe env vars?)
})

app.register(fastifySwagger, {
  swagger: {
    consumes: ['application/json'],
    produces: ['application/json'],
    info: {
      title: 'SOLID API',
      description:
        'Especificações das rotas HTTP da SOLID API, uma API de exemplo para treinar Clean Architecture e TDD. 🚀',
      version: '1.0.0',
    },
  },
})
app.register(fastifySwaggerUI, {
  routePrefix: '/docs',
})

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: 'refreshToken',
    signed: false,
  },
  sign: {
    expiresIn: '10m',
  },
})

app.get('/health', () => ({ status: 'ok' }))
app.register(userRoutes)
app.register(gymRoutes)
app.register(checkInRoutes)

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Validation error',
      issues: error.format(),
    })
  }

  if (process.env.NODE_ENV !== 'production') {
    console.error(error)
  } else {
    // TODO: Here we should log to an external tool like DataDog/NewRelic/Sentry
  }
  return reply.status(500).send({ message: 'Internal server error' })
})
