import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify"
import jwt from "jsonwebtoken"

type AuthUser = {
  id: string
  isPro: boolean
}

declare module "fastify" {
  interface FastifyRequest {
    user?: AuthUser
  }
}

const PUBLIC_PREFIXES = [
  "/api/insights/top",
  "/api/insights/today",
  "/api/insights/weekly",
  "/health",
]

export async function authPlugin(app: FastifyInstance) {
  app.addHook(
    "preHandler",
    async (req: FastifyRequest, reply: FastifyReply) => {
      const url = req.raw.url || ""

      if (PUBLIC_PREFIXES.some(p => url.startsWith(p))) {
        return
      }

      const header = req.headers.authorization
      if (!header) {
        reply.code(401)
        return reply.send({ error: "Unauthorized" })
      }

      try {
        const token = header.replace("Bearer ", "")
        const payload = jwt.verify(
          token,
          process.env.SUPABASE_JWT_SECRET!
        ) as any

        req.user = {
          id: payload.sub,
          isPro: payload.user_metadata?.plan === "pro",
        }
      } catch {
        reply.code(401)
        return reply.send({ error: "Invalid token" })
      }
    }
  )
}
