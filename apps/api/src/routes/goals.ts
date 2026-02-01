import { FastifyInstance } from "fastify"
import { db } from "../db/db"
import { computeGoalProgress } from "../goals/metrics"

export default async function goalRoutes(app: FastifyInstance) {
  app.get("/", async (req, reply) => {
    if (!req.user) {
      return reply.code(401).send({ error: "Unauthorized" })
    }

    const userId = req.user.id

    const goals = await db
      .selectFrom("goals")
      .selectAll()
      .where("user_id", "=", userId)
      .where("status", "=", "active")
      .execute()

    const enriched = await Promise.all(
      goals.map(async g => ({
        ...g,
        progress: await computeGoalProgress(userId, g),
      }))
    )

    reply.send(enriched)
  })

  app.post("/", async (req, reply) => {
    if (!req.user) {
      return reply.code(401).send({ error: "Unauthorized" })
    }

    const userId = req.user.id

    const body = req.body as {
      title: string
      description?: string
      metric: "habit_score" | "momentum_7d" | "streak" | "count"
      target_value: number
      start_date: string
      end_date?: string
    }

    await db.insertInto("goals").values({
      user_id: userId,
      title: body.title,
      description: body.description ?? null,
      metric: body.metric,
      target_value: body.target_value,
      start_date: body.start_date,
      end_date: body.end_date ?? null,
      status: "active",
    }).execute()

    reply.send({ ok: true })
  })

  app.post("/:id/complete", async (req, reply) => {
    if (!req.user) {
      return reply.code(401).send({ error: "Unauthorized" })
    }

    const userId = req.user.id
    const { id } = req.params as { id: string }

    await db
      .updateTable("goals")
      .set({
        status: "completed",
        completed_at: new Date(),
      })
      .where("id", "=", id)
      .where("user_id", "=", userId)
      .execute()

    reply.send({ ok: true })
  })
}
