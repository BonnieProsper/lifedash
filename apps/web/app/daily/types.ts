// apps/web/app/daily/types.ts
export type DailyPayload = {
  date: string
  isClosed: boolean

  inputs: {
    sleep: {
      hours: number | null
      quality: number | null
    }
    mood: number | null
    energy: number | null
    note: string
  }

  habits: {
    id: string
    name: string
    category: string | null
    impactWeight: number
    log: {
      status: "completed" | "skipped" | "failed"
      value: number | null
      skipReason: string | null
    } | null
  }[]

  mits: {
    id: string
    title: string
    completed: boolean
  }[]

  metrics: {
    habit_score: number
    mit_completed: number
    momentum_7d: number
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
