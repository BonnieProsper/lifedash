// TODO: logic to feed leverage
import { db } from "../db/db"

export async function getHabitMomentum(habitId: string) {
  const logs = await db
    .selectFrom("habit_logs")
    .select(["date", "status"])
    .where("habit_id", "=", habitId)
    .orderBy("date desc")
    .limit(7)
    .execute()

  let score = 0
  let weight = 1

  for (const log of logs) {
    if (log.status === "completed") score += weight
    if (log.status === "skipped") score -= weight * 0.5
    weight *= 0.85
  }

  return Number(score.toFixed(2))
}
