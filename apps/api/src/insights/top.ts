import { computeCorrelations } from "./correlations"
import { rankInsights } from "./ranking"
import { insightToNarrative } from "./narratives"
import { computeInsightWeights } from "./effectiveness"
import { db } from "../db/db"
import type { NarrativeInsight } from "./narratives"

type GoalMetric = "habit_score" | "momentum_7d" | "streak" | "count"

export type TopInsightResult = {
  insight: NarrativeInsight
  goalAligned: boolean
}

function isGoalMetric(metric: string): metric is GoalMetric {
  return (
    metric === "habit_score" ||
    metric === "momentum_7d" ||
    metric === "streak" ||
    metric === "count"
  )
}

export async function getTopInsight(
  userId?: string
): Promise<TopInsightResult | null> {
  if (!userId) return null

  // 1. Correlations
  const correlations = await computeCorrelations(userId)
  if (correlations.length === 0) return null

  // 2. Rank
  const ranked = rankInsights(correlations)

  // 3. Effectiveness weights
  const weights = await computeInsightWeights(userId)

  const weighted = ranked
    .map(r => {
      const key = `corr_${r.from}_${r.to}`
      return {
        ...r,
        score: r.score * (weights[key] ?? 1),
      }
    })
    .sort((a, b) => b.score - a.score)

  if (weighted.length === 0) return null

  const top = weighted[0]

  // 4. Narrative
  const narrative = insightToNarrative(top)

  // 5. Goal alignment (ONLY if `to` is a goal metric)
  let goalAligned = false

  if (isGoalMetric(top.to)) {
    const goals = await db
      .selectFrom("goals")
      .select("metric")
      .where("user_id", "=", userId)
      .where("status", "=", "active")
      .execute()

    const goalMetrics = new Set(goals.map(g => g.metric))
    goalAligned = goalMetrics.has(top.to)
  }

  return {
    insight: narrative,
    goalAligned,
  }
}
