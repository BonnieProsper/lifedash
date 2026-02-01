import { FastifyInstance } from "fastify"
import { db } from "../../db/db"
import crypto from "node:crypto"

export default async function feedbackRoutes(app: FastifyInstance) {
  app.post("/insights/feedback", async (req, reply) => {
    if (!req.user) return reply.code(401).send({ error: "Unauthorized" })

    const {
      insightKey,
      actionTaken,
      outcomeDelta,
      date,
    } = req.body as {
      insightKey: string
      actionTaken: boolean
      outcomeDelta?: number | null
      date?: string
    }

    const feedbackDate = date ?? new Date().toISOString().slice(0, 10)

    await db.insertInto("insight_feedback").values({
      id: crypto.randomUUID(),
      user_id: req.user.id,
      insight_key: insightKey,
      date: feedbackDate,
      action_taken: actionTaken,
      outcome_delta: outcomeDelta ?? null,
      created_at: new Date(),
    }).execute()

    reply.send({ ok: true })
  })
}
