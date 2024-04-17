import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { RegisterUseCase } from '@/use-cases/register'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export const register = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })
  const { name, email, password } = registerBodySchema.parse(request.body)

  try {
    const registerUseCase = new RegisterUseCase(new PrismaUsersRepository())
    await registerUseCase.execute({ name, email, password })
  } catch (error) {
    return reply.status(409).send({ message: 'User already exists' })
  }

  return reply.status(201).send()
}