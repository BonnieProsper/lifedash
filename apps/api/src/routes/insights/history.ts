import { FastifyInstance } from "fastify"
import { db } from "../../db/db"

export default async function historyRoutes(app: FastifyInstance) {
  app.get("/insights/history", async (req, reply) => {
    if (!req.user) return reply.code(401).send({ error: "Unauthorized" })

    const events = await db.selectFrom("insight_events")
      .selectAll()
      .where("user_id", "=", req.user.id)
      .orderBy("created_at", "desc")
      .execute()

    const feedbacks = await db.selectFrom("insight_feedback")
      .selectAll()
      .where("user_id", "=", req.user.id)
      .orderBy("date", "desc")
      .execute()

    reply.send({ events, feedbacks })
  })
}
