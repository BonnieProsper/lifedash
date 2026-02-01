import { FastifyInstance } from "fastify"
import { computeCorrelations } from "../../insights/correlations"

export default async function correlationInsightRoutes(app: FastifyInstance) {
  app.get("/correlations", async (req, reply) => {
    if (!req.user) {
      reply.code(401).send({ error: "Unauthorized" })
      return
    }

    return computeCorrelations(req.user.id)
  })
}
