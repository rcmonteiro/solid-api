import { FastifyReply, FastifyRequest } from 'fastify'

export const refresh = async (request: FastifyRequest, reply: FastifyReply) => {
  await request.jwtVerify({
    onlyCookie: true,
  })

  const token = await reply.jwtSign(
    {
      role: request.user.role,
    },
    {
      sign: {
        sub: request.user.sub,
      },
    },
  )

  const refreshToken = await reply.jwtSign(
    {
      role: request.user.role,
    },
    {
      sign: {
        sub: request.user.sub,
        expiresIn: '7d',
      },
    },
  )

  return reply
    .status(200)
    .setCookie('refreshToken', refreshToken, {
      path: '/',
      secure: true,
      sameSite: true,
      httpOnly: true,
    })
    .send({ token })
}
