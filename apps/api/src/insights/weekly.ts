import { db } from "../db/db"
import { getTopInsight } from "./top"
import { shouldEmitInsight, recordInsightEvent } from "./suppression"

export async function getWeeklyDigest(
  userId?: string,
  endDate?: string
) {
  if (!userId || !endDate) return null

  const startDate = shift(endDate, -6)

  const metrics = await db
    .selectFrom("daily_metrics")
    .selectAll()
    .where("user_id", "=", userId)
    .where("date", ">=", startDate)
    .where("date", "<=", endDate)
    .orderBy("date", "asc")
    .execute()

  if (metrics.length === 0) return null

  const coreScore = average(metrics.map(m => m.habit_score))

  const first = metrics[0]
  const last = metrics[metrics.length - 1]

  const momentumDelta =
    (last.momentum_7d ?? 0) - (first.momentum_7d ?? 0)

  const insights: {
    momentum?: {
      direction: "up" | "down"
      delta: number
    }
    system?: any
  } = {}

  // -------------------------
  // Weekly momentum insight
  // -------------------------
  if (Math.abs(momentumDelta) >= 0.15) {
    const key =
      momentumDelta > 0
        ? "weekly_momentum_up"
        : "weekly_momentum_down"

    const ok = await shouldEmitInsight(userId, key, 7)

    if (ok) {
      await recordInsightEvent(userId, key)

      insights.momentum = {
        direction: momentumDelta > 0 ? "up" : "down",
        delta: round(momentumDelta),
      }
    }
  }

  // -------------------------
  // Top system insight
  // -------------------------
  const top = await getTopInsight(userId)

  if (top) {
    const ok = await shouldEmitInsight(userId, top.key, 7)

    if (ok) {
      await recordInsightEvent(userId, top.key)
      insights.system = top
    }
  }

  return {
    weekStart: startDate,
    weekEnd: endDate,
    coreHabitAdherence: round(coreScore),
    optionalHabitEngagement: null,
    insights,
  }
}

// -------------------------
// helpers
// -------------------------

function average(xs: number[]) {
  return xs.reduce((a, b) => a + b, 0) / xs.length
}

function round(n: number) {
  return Number(n.toFixed(2))
}

function shift(date: string, days: number) {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}
