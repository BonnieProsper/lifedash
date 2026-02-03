import { FastifyReply, FastifyRequest } from "fastify"

export function requirePro(
  req: FastifyRequest,
  reply: FastifyReply,
  done: () => void
) {
  if (!req.user) {
    reply.code(401).send({ error: "Unauthorized" })
    return
  }

  if (!req.user.isPro) {
    reply.code(402).send({ error: "Upgrade required" }) // change to 403
    return
  }

  done()
}
