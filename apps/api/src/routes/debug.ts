import { FastifyInstance } from "fastify"
import { computeDailyMetrics } from "../metrics/dailyMetrics"

export default async function debugRoutes(app: FastifyInstance) {
  app.get("/recompute/:date", async (req, reply) => {
    if (!req.user) {
      reply.code(401).send({ error: "Unauthorized" })
      return
    }

    const { date } = req.params as { date: string }
    await computeDailyMetrics(req.user.id, date)

    reply.send({ ok: true, date })
  })
}

