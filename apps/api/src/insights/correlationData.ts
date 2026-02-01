// TODO: move to insights/data.ts
import { db } from "../db/db"

export async function getDailyFacts(userId: string, days = 30) {
  return db
    .selectFrom("days")
    .innerJoin(
      "daily_metrics",
      "days.date",
      "daily_metrics.date"
    )
    .select([
      "days.sleep_hours",
      "days.sleep_quality",
      "days.mood",
      "days.energy",
      "daily_metrics.habit_score",
      "daily_metrics.mit_completed",
    ])
    .where("days.user_id", "=", userId)
    .orderBy("days.date", "desc")
    .limit(days)
    .execute()
}
