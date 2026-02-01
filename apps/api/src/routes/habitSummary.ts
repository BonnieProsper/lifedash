import { FastifyInstance } from "fastify"
import { db } from "../db/db"

export default async function habitSummaryRoutes(app: FastifyInstance) {
  app.get("/:habitId/summary", async (req, reply) => {
    const { habitId } = req.params as { habitId: string }

    const logs = await db
      .selectFrom("habit_logs")
      .select(["status", "date"])
      .where("habit_id", "=", habitId)
      .execute()

    const completed = logs.filter(l => l.status === "completed").length
    const skipped = logs.filter(l => l.status === "skipped").length

    reply.send({
      total_logs: logs.length,
      completed,
      skipped,
      completion_rate:
        logs.length === 0 ? 0 : Number((completed / logs.length).toFixed(2)),
    })
  })
}
