import { FastifyInstance } from "fastify"
import { getTopInsight } from "../../insights/top"

export default async function topInsightRoutes(app: FastifyInstance) {
  app.get("/top", async (req, reply) => {
    if (!req.user) {
      return reply.code(401).send({ error: "Unauthorized" })
    }

    return getTopInsight(req.user.id)
  })
}
