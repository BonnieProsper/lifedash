import { getDailyFacts } from "./correlationData"
import { pearson } from "./correlationMath"
import type { DailyFact } from "./types"

export type CorrelationResult = {
  from: keyof DailyFact
  to: keyof DailyFact
  value: number
  sampleSize: number
  confidence: number
}

function computeConfidence(sampleSize: number) {
  return Math.min(1, sampleSize / 30)
}

export async function computeCorrelations(userId: string): Promise<CorrelationResult[]> {
  const rows = await getDailyFacts(userId)

  if (rows.length < 14) return []

  const extract = (key: keyof DailyFact) =>
    rows
      .map(r => r[key])
      .map(Number)
      .filter(v => !Number.isNaN(v))

  const pairs: Array<[keyof DailyFact, keyof DailyFact]> = [
    ["sleep_hours", "habit_score"],
    ["sleep_quality", "habit_score"],
    ["mood", "mit_completed"],
    ["energy", "habit_score"],
  ]

  const results: CorrelationResult[] = []

  for (const [from, to] of pairs) {
    const xs = extract(from)
    const ys = extract(to)

    const sampleSize = Math.min(xs.length, ys.length)
    const value = pearson(xs, ys)

    if (value === null) continue

    results.push({
      from,
      to,
      value,
      sampleSize,
      confidence: computeConfidence(sampleSize),
    })
  }

  return results
    .filter(r => r.confidence >= 0.4)
    .sort((a, b) => Math.abs(b.value) - Math.abs(a.value))
}
