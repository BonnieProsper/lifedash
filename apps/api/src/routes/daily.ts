import { FastifyInstance } from "fastify"
import { getTodayInsights } from "../insights/today"

export default async function dailyRoutes(app: FastifyInstance) {
  app.get("/daily", async (req, reply) => {
    if (!req.user) {
      reply.code(401).send({ error: "Unauthorized" })
      return
    }

    const userId = req.user.id

    const { date: queryDate } = req.query as { date?: string }
    const date =
      queryDate ?? new Date().toISOString().slice(0, 10)

    const db = app.db

    // ─────────────────────────────────────────────
    // Day inputs
    // ─────────────────────────────────────────────
    const day = await db
      .selectFrom("days")
      .select([
        "sleep_hours",
        "sleep_quality",
        "mood",
        "energy",
        "note",
        "closed_at",
      ])
      .where("user_id", "=", userId)
      .where("date", "=", date)
      .executeTakeFirst()

    // ─────────────────────────────────────────────
    // Habits + logs for this date
    // ─────────────────────────────────────────────
    const habits = await db
      .selectFrom("habits")
      .leftJoin(
        "habit_logs",
        "habit_logs.habit_id",
        "habits.id"
      )
      .select([
        "habits.id",
        "habits.name",
        "habits.category",
        "habits.impact_weight",
        "habit_logs.status",
        "habit_logs.value",
        "habit_logs.skip_reason",
      ])
      .where("habits.user_id", "=", userId)
      .where("habits.is_active", "=", true)
      .where(qb =>
        qb.or([
          qb("habit_logs.date", "=", date),
          qb("habit_logs.date", "is", null),
        ])
      )
      .orderBy("habits.created_at", "asc")
      .execute()

    // ─────────────────────────────────────────────
    // MITs
    // ─────────────────────────────────────────────
    const mits = await db
      .selectFrom("mit_selections")
      .innerJoin(
        "todos",
        "todos.id",
        "mit_selections.todo_id"
      )
      .select([
        "todos.id",
        "todos.title",
        "todos.completed",
      ])
      .where("mit_selections.user_id", "=", userId)
      .where("mit_selections.date", "=", date)
      .execute()

    // ─────────────────────────────────────────────
    // Daily metrics snapshot
    // ─────────────────────────────────────────────
    const metrics =
      (await db
        .selectFrom("daily_metrics")
        .select([
          "habit_score",
          "mit_completed",
          "momentum_7d",
        ])
        .where("user_id", "=", userId)
        .where("date", "=", date)
        .executeTakeFirst()) ?? {
        habit_score: 0,
        mit_completed: 0,
        momentum_7d: 0,
      }

    // ─────────────────────────────────────────────
    // Top insight
    // ─────────────────────────────────────────────
    const insights = await getTodayInsights(userId, date)
    const topInsight = insights[0] ?? null

    reply.send({
      date,
      isClosed: Boolean(day?.closed_at),

      inputs: {
        sleep: {
          hours: day?.sleep_hours ?? null,
          quality: day?.sleep_quality ?? null,
        },
        mood: day?.mood ?? null,
        energy: day?.energy ?? null,
        note: day?.note ?? "",
      },

      habits: habits.map(h => ({
        id: h.id,
        name: h.name,
        category: h.category,
        impactWeight: h.impact_weight,
        log: h.status
          ? {
              status: h.status,
              value: h.value,
              skipReason: h.skip_reason,
            }
          : null,
      })),

      mits,
      metrics,
      topInsight,
    })
  })
}
