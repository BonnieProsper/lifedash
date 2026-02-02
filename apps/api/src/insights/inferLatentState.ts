export function inferLatentState(stats: {
  habit_completion_7d: number[]
  mit_completion_7d: number[]
  sleep_quality_7d: number[]
  overcommitment_7d: number[]
}) {
  const motivation =
    stats.habit_completion_7d.reduce((a, b) => a + b, 0) / stats.habit_completion_7d.length * 0.6 +
    stats.mit_completion_7d.reduce((a, b) => a + b, 0) / stats.mit_completion_7d.length * 0.4

  const fatigue =
    (1 - stats.sleep_quality_7d.reduce((a, b) => a + b, 0) / stats.sleep_quality_7d.length) * 0.7 +
    stats.overcommitment_7d.reduce((a, b) => a + b, 0) / stats.overcommitment_7d.length * 0.3

  return { motivation, fatigue }
}
