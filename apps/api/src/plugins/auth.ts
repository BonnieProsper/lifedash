import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"
import { createClient } from "@supabase/supabase-js"

export type AuthUser = {
  id: string
  email: string
  isPro: boolean
}

declare module "fastify" {
  interface FastifyRequest {
    user?: AuthUser
  }
}

const PUBLIC_PREFIXES = [
  "/health",
  "/api/insights/top",
  "/api/insights/today",
  "/api/insights/weekly",
]

export async function authPlugin(app: FastifyInstance) {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  )

  app.addHook("preHandler", async (req, reply) => {
    const url = req.raw.url ?? ""

    if (PUBLIC_PREFIXES.some((p) => url.startsWith(p))) return

    const header = req.headers.authorization
    if (!header?.startsWith("Bearer ")) {
      reply.code(401).send({ error: "Unauthorized" })
      return
    }

    const token = header.slice("Bearer ".length)

    const { data, error } = await supabase.auth.getUser(token)

    if (error || !data.user) {
      reply.code(401).send({ error: "Invalid token" })
      return
    }

    req.user = {
      id: data.user.id,
      email: data.user.email ?? "",
      isPro: data.user.user_metadata?.plan === "pro",
    }
  })
}
