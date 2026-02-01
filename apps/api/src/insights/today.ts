import { db } from "../db/db"
import { shouldEmitInsight, recordInsightEvent } from "./suppression"

export type TodayInsight = {
  key: string
  text: string
  actionable: boolean
  action?: {
    label: string
    hint?: string
  }
}

export async function getTodayInsights(
  userId?: string,
  date?: string
): Promise<TodayInsight[]> {
  if (!userId || !date) return []

  const metrics = await db
    .selectFrom("daily_metrics")
    .selectAll()
    .where("user_id", "=", userId)
    .where("date", "=", date)
    .executeTakeFirst()

  if (!metrics) return []

  const candidates: TodayInsight[] = []

  // -------------------------
  // Low habit score
  // -------------------------
  if (metrics.habit_score < 0.4) {
    candidates.push({
      key: "low_habit_score",
      text: "Low habit completion today — consider a lighter reset day.",
      actionable: true,
      action: {
        label: "Plan reset day",
        hint: "Reduce tomorrow’s habits to the essentials only.",
      },
    })
  }

  // -------------------------
  // High momentum
  // -------------------------
  if (metrics.momentum_7d && metrics.momentum_7d > 0.75) {
    candidates.push({
      key: "high_momentum",
      text: "Strong momentum — protect this streak.",
      actionable: true,
      action: {
        label: "Lock tomorrow",
        hint: "Avoid adding new habits or commitments.",
      },
    })
  }

  // -------------------------
  // MIT missed
  // -------------------------
  if (!metrics.mit_completed) {
    candidates.push({
      key: "mit_missed",
      text: "MIT not completed — tomorrow’s priority may need adjusting.",
      actionable: true,
      action: {
        label: "Set tomorrow’s MIT",
        hint: "Pick one task that would make tomorrow successful.",
      },
    })
  }

  const emitted: TodayInsight[] = []

  for (const insight of candidates) {
    if (!insight.actionable) continue

    const ok = await shouldEmitInsight(userId, insight.key, 3)
    if (!ok) continue

    await recordInsightEvent(userId, insight.key)
    emitted.push(insight)
  }

  return emitted
}
