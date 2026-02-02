import { FastifyPluginAsync } from "fastify"

const jwtPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.register(require("@fastify/jwt"), {
    secret: process.env.SUPABASE_JWT_SECRET!,
    decode: { complete: true },
  })

  // PreHandler to attach user to req.user
  fastify.addHook("preHandler", async (req, reply) => {
    try {
      const authHeader = req.headers.authorization
      if (!authHeader) {
        req.user = null
        return
      }

      const token = authHeader.replace("Bearer ", "")
      const payload = await req.jwtVerify(token)
      req.user = { id: payload.sub } // attach user id
    } catch (err) {
      req.user = null
    }
  })
}

export default jwtPlugin
