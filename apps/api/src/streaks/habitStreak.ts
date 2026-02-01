import { db } from "../db/db"

export async function computeHabitStreak(
  habitId: string,
  upToDate: string
): Promise<number> {
  const logs = await db
    .selectFrom("habit_logs")
    .select(["date", "status"])
    .where("habit_id", "=", habitId)
    .where("date", "<=", upToDate)
    .orderBy("date", "desc")
    .execute()

  let streak = 0

  for (const log of logs) {
    if (log.status !== "completed") break
    streak++
  }

  return streak
}
