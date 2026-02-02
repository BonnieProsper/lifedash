import { FastifyInstance } from "fastify"
import crypto from "node:crypto"
import { db } from "../db/db"
import { computeDailyMetrics } from "../metrics/dailyMetrics"
import { z } from "zod"

export default async function dayRoutes(app: FastifyInstance) {
  const checkinSchema = z.object({
    sleep_hours: z.number().min(0).optional(),
    sleep_quality: z.number().min(0).optional(),
    mood: z.number().min(0).max(10).optional(),
    energy: z.number().min(0).max(10).optional(),
    note: z.string().optional(),
  })

  app.post("/:date/checkin", async (req, reply) => {
    if (!req.user) {
      reply.code(401).send({ error: "Unauthorized" })
      return
    }

    const userId = req.user.id
    const { date } = req.params as { date: string }
    const body = checkinSchema.parse(req.body)

    await db
      .insertInto("days")
      .values({
        id: crypto.randomUUID(),
        user_id: userId,
        date,
        sleep_hours: body.sleep_hours ?? null,
        sleep_quality: body.sleep_quality ?? null,
        mood: body.mood ?? null,
        energy: body.energy ?? null,
        note: body.note ?? null,
        closed_at: null,
      })
      .onConflict(oc =>
        oc.columns(["user_id", "date"]).doUpdateSet({
          sleep_hours: body.sleep_hours ?? null,
          sleep_quality: body.sleep_quality ?? null,
          mood: body.mood ?? null,
          energy: body.energy ?? null,
          note: body.note ?? null,
        })
      )
      .execute()

    await computeDailyMetrics(userId, date)
    reply.send({ ok: true })
  })

  app.get("/:date", async (req, reply) => {
    if (!req.user) {
      reply.code(401).send({ error: "Unauthorized" })
      return
    }

    const userId = req.user.id
    const { date } = req.params as { date: string }

    const day = await db
      .selectFrom("days")
      .leftJoin("daily_metrics", join =>
        join
          .onRef("days.user_id", "=", "daily_metrics.user_id")
          .onRef("days.date", "=", "daily_metrics.date")
      )
      .selectAll()
      .where("days.user_id", "=", userId)
      .where("days.date", "=", date)
      .executeTakeFirst()

    if (!day) {
      reply.code(404).send({ error: "Day not found" })
      return
    }

    reply.send(day)
  })
}


// add

const today = new Date().toISOString().slice(0, 10)
if (date > today) throw new Error("Cannot write future dates")
if (date < new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10))
  throw new Error("Cannot write older than 30 days")
if (day.is_closed) throw new Error("Day is closed")
