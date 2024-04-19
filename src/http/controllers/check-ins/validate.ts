import { makeValidateCheckInUseCase } from '@/use-cases/factories/make-validate-check-in-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export const validate = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const validateQuerySchema = z.object({
    checkInId: z.string().uuid(),
  })

  const { checkInId } = validateQuerySchema.parse(request.params)

  const validateCheckInUseCase = makeValidateCheckInUseCase()
  await validateCheckInUseCase.execute({
    checkInId,
  })

  return reply.status(204).send()
}
