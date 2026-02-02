import { FastifyPluginAsync } from "fastify"
import fastifyJwt from "@fastify/jwt"
import type { AuthUser } from "./auth"

declare module "fastify" {
  interface FastifyRequest {
    user?: AuthUser
  }
}

export const jwtPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.register(fastifyJwt, {
    secret: process.env.SUPABASE_JWT_SECRET!,
  })

  fastify.addHook("preHandler", async (req, reply) => {
    const authHeader = req.headers.authorization
    if (!authHeader) {
      req.user = undefined
      return
    }

    const token = authHeader.replace("Bearer ", "")

    try {
      const payload: any = await fastify.jwt.verify(token)
      req.user = { id: payload.sub, isPro: false } // add any required AuthUser fields
    } catch (err) {
      req.user = undefined
    }
  })
}
