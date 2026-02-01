import { FastifyInstance } from "fastify"
import { getTodayInsights } from "../../insights/today"

export default async function todayInsightRoutes(app: FastifyInstance) {
  app.get("/today/:date", async (req, reply) => {
    if (!req.user) {
      return reply.code(401).send({ error: "Unauthorized" })
    }

    const { date } = req.params as { date: string }

    return getTodayInsights(req.user.id, date)
  })
}
