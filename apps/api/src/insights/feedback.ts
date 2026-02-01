import { db } from "../db/db"
import crypto from "node:crypto"

export async function recordInsightFeedback(
  userId: string,
  insightKey: string,
  date: string,
  actionTaken: boolean
) {
  const [today, tomorrow] = await Promise.all([
    db
      .selectFrom("daily_metrics")
      .select("habit_score")
      .where("user_id", "=", userId)
      .where("date", "=", date)
      .executeTakeFirst(),

    db
      .selectFrom("daily_metrics")
      .select("habit_score")
      .where("user_id", "=", userId)
      .where("date", "=", addDays(date, 1))
      .executeTakeFirst(),
  ])

  let outcomeDelta: number | null = null

  if (today && tomorrow) {
    outcomeDelta = Number(
      (tomorrow.habit_score - today.habit_score).toFixed(3)
    )
  }

  await db
    .insertInto("insight_feedback")
    .values({
      id: crypto.randomUUID(),
      user_id: userId,
      insight_key: insightKey,
      date,
      action_taken: actionTaken,
      outcome_delta: outcomeDelta,
      created_at: new Date(),
    })
    .execute()
}

function addDays(date: string, days: number): string {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}
