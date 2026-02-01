import { db } from "../db/db"

/**
 * Compute effectiveness score per user + insight
 * 0.0 = completely ineffective, 1.0 = fully effective
 */
export async function insightEffectiveness(
  userId: string,
  insightKey: string
): Promise<number> {
  const rows = await db.selectFrom("insight_feedback")
    .select(["action_taken", "outcome_delta"])
    .where("user_id", "=", userId)
    .where("insight_key", "=", insightKey)
    .execute()

  if (rows.length < 3) return 0.5 // neutral prior

  const acted = rows.filter(r => r.action_taken)
  if (acted.length === 0) return 0.2

  const avgDelta = acted.reduce((s, r) => s + (r.outcome_delta ?? 0), 0) / acted.length

  // clamp between 0 and 1
  return Math.max(0, Math.min(1, 0.5 + avgDelta))
}

/**
 * Compute per-user weights for all insights
 */
export async function computeInsightWeights(userId: string) {
  const feedbacks = await db.selectFrom("insight_feedback")
    .select(["insight_key", "action_taken", "outcome_delta"])
    .where("user_id", "=", userId)
    .execute()

  const weights: Record<string, number> = {}

  for (const f of feedbacks) {
    let score = 0
    if (f.action_taken) score += 1
    if (f.outcome_delta) score += f.outcome_delta ?? 0
    weights[f.insight_key] = (weights[f.insight_key] ?? 0) + score
  }

  return weights
}
