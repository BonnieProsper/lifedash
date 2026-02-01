export type DailyFact = {
  sleep_hours: number | null
  sleep_quality: number | null
  mood: number | null
  energy: number | null
  habit_score: number
  mit_completed: number // 0 or 1
}

export type Insight = {
  key: string
  text: string
  because: string[]
  confidence: number
}

// TODO: impliment?

type EmittedInsight = {
  key: string
  message: string
  actionable: boolean
}

type TodayInsight = {
  key: string
  text: string
  action?: {
    label: string
    hint?: string
  }
}
