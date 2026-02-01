import type { RankedInsight } from "./ranking"
import type { DailyFact } from "./types"

export type NarrativeInsight = {
  key: string
  text: string
  because: string[]
  confidence: number
}

function label(key: keyof DailyFact): string {
  const map: Record<keyof DailyFact, string> = {
    sleep_hours: "sleep duration",
    sleep_quality: "sleep quality",
    mood: "mood",
    energy: "energy",
    habit_score: "habit completion",
    mit_completed: "MIT completion",
  }

  return map[key]
}

export function insightToNarrative(
  insight: RankedInsight
): NarrativeInsight {
  const direction = insight.value > 0 ? "improves" : "hurts"

  const strength =
    Math.abs(insight.value) >= 0.6
      ? "strongly"
      : Math.abs(insight.value) >= 0.4
      ? "moderately"
      : "slightly"

  return {
    key: `corr_${insight.from}_${insight.to}`,
    text: `${label(insight.from)} ${strength} ${direction} your ${label(
      insight.to
    )}.`,
    because: [
      `${label(insight.from)} correlated with ${label(insight.to)} (${insight.value.toFixed(
        2
      )})`,
      `Based on ${insight.sampleSize} days of data`,
    ],
    confidence: insight.confidence,
  }
}
