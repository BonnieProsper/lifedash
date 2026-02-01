import { FastifyInstance } from "fastify"
import { getWeeklyDigest } from "../../insights/weekly"

export default async function weeklyInsightRoutes(app: FastifyInstance) {
  app.get("/weekly/:date", async (req, reply) => {
    if (!req.user) {
      return reply.code(401).send({ error: "Unauthorized" })
    }

    const { date } = req.params as { date: string }

    return getWeeklyDigest(req.user.id, date)
  })
}
