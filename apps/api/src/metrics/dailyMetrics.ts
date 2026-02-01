import { db } from "../db/db"
import { getHabitMomentum } from "../insights/momentum"
import { computeHabitDailySignals } from "../insights/habitSignals"
import crypto from "node:crypto"

export async function computeDailyMetrics(
  userId: string,
  date: string
) {
  // --- Habit score via signals ---
  const signals = await computeHabitDailySignals(userId, date)

  const totalPossible = signals.reduce(
    (sum, s) => sum + Math.abs(s.impact_weight),
    0
  )

  const actual = signals.reduce(
    (sum, s) => sum + Math.max(0, s.contribution),
    0
  )

  const habitScore =
    totalPossible === 0
      ? 0
      : Number((actual / totalPossible).toFixed(3))

  // --- MIT completion ---
  const mitSelections = await db
    .selectFrom("mit_selections")
    .select("id")
    .where("user_id", "=", userId)
    .where("date", "=", date)
    .execute()

  const mitCompleted = mitSelections.length > 0

  // --- Momentum (7d avg across habits) ---
  const habits = await db
    .selectFrom("habits")
    .select("id")
    .where("user_id", "=", userId)
    .execute()

  let momentum7d: number | null = null

  if (habits.length > 0) {
    const scores = await Promise.all(
      habits.map(h => getHabitMomentum(h.id))
    )

    momentum7d = Number(
      (
        scores.reduce((sum, s) => sum + s, 0) /
        scores.length
      ).toFixed(3)
    )
  }

  // --- Upsert daily_metrics ---
  await db
    .insertInto("daily_metrics")
    .values({
      id: crypto.randomUUID(),
      user_id: userId,
      date,
      habit_score: habitScore,
      mit_completed: mitCompleted,
      momentum_7d: momentum7d,
    })
    .onConflict(oc =>
      oc.columns(["user_id", "date"]).doUpdateSet({
        habit_score: habitScore,
        mit_completed: mitCompleted,
        momentum_7d: momentum7d,
      })
    )
    .execute()
}
