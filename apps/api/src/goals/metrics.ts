import { db } from "../db/db"

export async function computeGoalProgress(
  userId: string,
  goal: {
    metric: string
    target_value: number
    start_date: string
    end_date?: string | null
  }
) {
  switch (goal.metric) {
    case "habit_score": {
      const rows = await db
        .selectFrom("daily_metrics")
        .select("habit_score")
        .where("user_id", "=", userId)
        .where("date", ">=", goal.start_date)
        .execute()

      if (rows.length === 0) return null

      const avg =
        rows.reduce((a, b) => a + b.habit_score, 0) / rows.length

      return avg
    }

    case "momentum": {
      const latest = await db
        .selectFrom("daily_metrics")
        .select("momentum_7d")
        .where("user_id", "=", userId)
        .orderBy("date", "desc")
        .executeTakeFirst()

      return latest?.momentum_7d ?? null
    }

    default:
      return null
  }
}
