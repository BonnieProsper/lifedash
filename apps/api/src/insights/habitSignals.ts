// src/insights/habitSignals.ts
import { db } from "../db/db"

export type HabitDailySignal = {
  habit_id: string
  date: string

  category: "non_negotiable" | "optional"
  impact_weight: number

  completed: boolean
  skipped: boolean

  contribution: number
}

export async function computeHabitDailySignals(
  userId: string,
  date: string
): Promise<HabitDailySignal[]> {
  const habits = await db
    .selectFrom("habits")
    .select(["id", "impact_weight", "category"])
    .where("user_id", "=", userId)
    .where("is_active", "=", true)
    .execute()

  if (habits.length === 0) return []

  const logs = await db
    .selectFrom("habit_logs")
    .select(["habit_id", "status"])
    .where("date", "=", date)
    .execute()

  const logMap = new Map(logs.map(l => [l.habit_id, l.status]))

  return habits.map(h => {
    const status = logMap.get(h.id)

    const completed = status === "completed"
    const skipped =
      status === "skipped" || status === "intentional_skip"

    const base = h.category === "non_negotiable" ? 1 : 0.5

    const contribution =
      completed
        ? base * h.impact_weight
        : skipped
          ? -0.5 * base * h.impact_weight
          : 0

    return {
      habit_id: h.id,
      date,
      category: h.category,
      impact_weight: h.impact_weight,
      completed,
      skipped,
      contribution,
    }
  })
}
