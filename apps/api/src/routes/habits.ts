import { FastifyInstance } from "fastify"
import crypto from "node:crypto"
import { db } from "../db/db"
import { computeDailyMetrics } from "../metrics/dailyMetrics"
import { z } from "zod"

const habitCategorySchema = z.enum(["non_negotiable", "optional"])

export default async function habitRoutes(app: FastifyInstance) {
  const habitCreateSchema = z.object({
    name: z.string().min(1),
    impact_weight: z.number().min(1).max(5),
    category: habitCategorySchema.default("optional"),
    is_active: z.boolean().default(true),
  })

  const habitUpdateSchema = habitCreateSchema.partial()

  const habitLogSchema = z.object({
    status: z.enum(["completed", "skipped"]),
    value: z.number().optional(),
    skip_reason: z.string().optional(),
  })

  app.post("/", async (req, reply) => {
    if (!req.user) {
      reply.code(401).send({ error: "Unauthorized" })
      return
    }

    const userId = req.user.id
    const body = habitCreateSchema.parse(req.body)
    const habitId = crypto.randomUUID()

    await db.insertInto("habits").values({
      id: habitId,
      user_id: userId,
      name: body.name,
      impact_weight: body.impact_weight,
      category: body.category,
      is_active: body.is_active,
      created_at: new Date(),
    }).execute()

    await computeDailyMetrics(userId, today())
    reply.send({ ok: true, id: habitId })
  })

  app.get("/", async (req, reply) => {
    if (!req.user) {
      reply.code(401).send({ error: "Unauthorized" })
      return
    }

    const habits = await db
      .selectFrom("habits")
      .selectAll()
      .where("user_id", "=", req.user.id)
      .orderBy("created_at", "asc")
      .execute()

    reply.send(habits)
  })

  app.put("/:id", async (req, reply) => {
    if (!req.user) {
      reply.code(401).send({ error: "Unauthorized" })
      return
    }

    const { id } = req.params as { id: string }
    const body = habitUpdateSchema.parse(req.body)

    await db
      .updateTable("habits")
      .set(body)
      .where("id", "=", id)
      .where("user_id", "=", req.user.id)
      .execute()

    await computeDailyMetrics(req.user.id, today())
    reply.send({ ok: true })
  })

  app.delete("/:id", async (req, reply) => {
    if (!req.user) {
      reply.code(401).send({ error: "Unauthorized" })
      return
    }

    const { id } = req.params as { id: string }

    await db
      .deleteFrom("habits")
      .where("id", "=", id)
      .where("user_id", "=", req.user.id)
      .execute()

    await computeDailyMetrics(req.user.id, today())
    reply.send({ ok: true })
  })

  app.post("/:habitId/log/:date", async (req, reply) => {
    if (!req.user) {
      reply.code(401).send({ error: "Unauthorized" })
      return
    }

    const { habitId, date } = req.params as { habitId: string; date: string }
    const body = habitLogSchema.parse(req.body)

    await db
      .insertInto("habit_logs")
      .values({
        id: crypto.randomUUID(),
        habit_id: habitId,
        date,
        status: body.status,
        value: body.value ?? null,
        skip_reason: body.skip_reason ?? null,
        created_at: new Date(),
      })
      .onConflict(oc =>
        oc.columns(["habit_id", "date"]).doUpdateSet({
          status: body.status,
          value: body.value ?? null,
          skip_reason: body.skip_reason ?? null,
        })
      )
      .execute()

    await computeDailyMetrics(req.user.id, date)
    reply.send({ ok: true })
  })
}

function today() {
  return new Date().toISOString().slice(0, 10)
}
