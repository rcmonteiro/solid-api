import { makeCreateGymUseCase } from '@/use-cases/factories/make-create-gym-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export const create = async (request: FastifyRequest, reply: FastifyReply) => {
  const createBodySchema = z.object({
    title: z.string(),
    description: z.string().nullable(),
    phone: z.string().nullable(),
    latitude: z.number().refine((value) => Math.abs(value) <= 90),
    longitude: z.number().refine((value) => Math.abs(value) <= 180),
  })
  const { title, description, phone, latitude, longitude } =
    createBodySchema.parse(request.body)

  const createGymUseCase = makeCreateGymUseCase()
  await createGymUseCase.execute({
    title,
    description,
    phone,
    latitude,
    longitude,
  })

  return reply.status(201).send()
}
