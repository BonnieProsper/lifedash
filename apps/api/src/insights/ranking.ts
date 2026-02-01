import type { CorrelationResult } from "./correlations"

export type RankedInsight = CorrelationResult & {
  score: number
}

export function rankInsights(
  correlations: CorrelationResult[]
): RankedInsight[] {
  return correlations
    .map(c => ({
      ...c,
      score: Math.abs(c.value) * c.confidence,
    }))
    .sort((a, b) => b.score - a.score)
}

// TODO: 
// Effectiveness weighting should be applied later, per user, not globally yet.
// keep pure for now