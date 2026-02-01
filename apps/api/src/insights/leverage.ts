import { computeCorrelations } from "./correlations"
import { computeHabitDailySignals } from "./habitSignals"

export type HabitSystemLeverage = {
  driver: keyof import("./types").DailyFact
  outcome: "habit_score"
  leverage: number
  correlation: number
  confidence: number
}

export async function computeHabitSystemLeverage(
  userId: string,
  date: string
): Promise<HabitSystemLeverage[]> {
  const correlations = await computeCorrelations(userId)
  const signals = await computeHabitDailySignals(userId, date)

  if (signals.length === 0) return []

  const systemMagnitude =
    signals.reduce((sum, s) => sum + Math.abs(s.contribution), 0) /
    signals.length

  const results: HabitSystemLeverage[] = []

  for (const c of correlations) {
    if (c.to !== "habit_score") continue

    const leverage =
      Math.abs(c.value) *
      c.confidence *
      systemMagnitude

    results.push({
      driver: c.from,
      outcome: "habit_score" as const, // literal locked
      leverage: Number(leverage.toFixed(3)),
      correlation: c.value,
      confidence: c.confidence,
    })
  }

  return results.sort((a, b) => b.leverage - a.leverage)
}
