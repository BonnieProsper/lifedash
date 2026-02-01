import { FastifyInstance } from "fastify"
import { db } from "../db/db"

export default async function metricsRoutes(app: FastifyInstance) {
  app.get("/range", async (req, reply) => {
    if (!req.user) {
      reply.code(401).send({ error: "Unauthorized" })
      return
    }

    const { from, to } = req.query as { from: string; to: string }

    const metrics = await db
      .selectFrom("daily_metrics")
      .selectAll()
      .where("user_id", "=", req.user.id)
      .where("date", ">=", from)
      .where("date", "<=", to)
      .orderBy("date", "asc")
      .execute()

    reply.send(metrics)
  })
}
