import { FastifyPluginAsync } from "fastify"
import { AuthUser } from "./auth"
import jwt from "jsonwebtoken"

declare module "fastify" {
  interface FastifyRequest {
    user?: AuthUser
  }
}

export const jwtPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.decorate("verifyJWT", async (req: any) => {
    const authHeader = req.headers.authorization
    if (!authHeader) {
      req.user = undefined
      return
    }

    const token = authHeader.replace("Bearer ", "")

    try {
      const payload: any = jwt.verify(token, process.env.SUPABASE_JWT_SECRET!)
      req.user = { id: payload.sub, isPro: false } // add fields if needed
    } catch {
      req.user = undefined
    }
  })
}
