import { FastifyReply, FastifyRequest } from 'fastify'

export const profile = async (request: FastifyRequest, reply: FastifyReply) => {
  await request.jwtVerify()

  const { sub } = request.user
  return reply.status(200).send(sub)
}
