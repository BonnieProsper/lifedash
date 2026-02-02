type HabitStatus = "completed" | "skipped" | "failed";

interface DailyResponse {
  date: string;
  habits: {
    id: string;
    name: string;
    log: { status: HabitStatus } | null;
  }[];
  metrics: { habit_score: number; mit_completed: number; momentum_7d: number };
  inputs: {
    sleep: { hours: number | null; quality: number | null };
    mood: number | null;
    energy: number | null;
    note: string;
  };
  topInsight: {
    key: string;
    text: string;
    because: string[];
    confidence: number;
    actionable?: boolean;
    advice?: string;
  } | null;
}
