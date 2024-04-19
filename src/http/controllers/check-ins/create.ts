import { makeCheckInUseCase } from '@/use-cases/factories/make-check-in-use-case'
import { Decimal } from '@prisma/client/runtime/library'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export const create = async (request: FastifyRequest, reply: FastifyReply) => {
  const createBodySchema = z.object({
    latitude: z.number().refine((value) => Math.abs(value) <= 90),
    longitude: z.number().refine((value) => Math.abs(value) <= 180),
  })
  const createQuerySchema = z.object({
    gymId: z.string().uuid(),
  })

  const { latitude, longitude } = createBodySchema.parse(request.body)
  const { gymId } = createQuerySchema.parse(request.params)

  const checkInUseCase = makeCheckInUseCase()
  await checkInUseCase.execute({
    gymId,
    userId: request.user.sub,
    userLatitude: new Decimal(latitude),
    userLongitude: new Decimal(longitude),
  })

  return reply.status(201).send()
}
