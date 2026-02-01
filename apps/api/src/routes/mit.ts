
import { FastifyInstance } from "fastify"
import crypto from "node:crypto"
import { db } from "../db/db"
import { computeDailyMetrics } from "../metrics/dailyMetrics"
import { z } from "zod"

export default async function mitRoutes(app: FastifyInstance) {
  const mitSchema = z.object({
    todo_id: z.string().min(1),
  })

  app.post("/:date", async (req, reply) => {
    if (!req.user) {
      reply.code(401).send({ error: "Unauthorized" })
      return
    }

    const { date } = req.params as { date: string }
    const { todo_id } = mitSchema.parse(req.body)

    await db
      .insertInto("mit_selections")
      .values({
        id: crypto.randomUUID(),
        user_id: req.user.id,
        date,
        todo_id,
      })
      .onConflict(oc =>
        oc.columns(["user_id", "date"]).doUpdateSet({ todo_id })
      )
      .execute()

    await computeDailyMetrics(req.user.id, date)
    reply.send({ ok: true })
  })
}
