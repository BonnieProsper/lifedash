export type HabitStatus = "completed" | "skipped" | "failed";

export interface DailyHabit {
  id: string
  name: string
  log: { status: HabitStatus } | null
}

export interface DailyResponse {
  date: string
  habits: DailyHabit[]
  metrics: { habit_score: number; mit_completed: number; momentum_7d: number }
  inputs: {
    sleep: { hours: number | null; quality: number | null }
    mood: number | null
    energy: number | null
    note: string
  }
  topInsight: {
    key: string
    text: string
    because: string[]
    confidence: number
    actionable?: boolean
    advice?: string
  } | null
}
