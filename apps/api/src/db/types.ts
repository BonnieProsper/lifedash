import { Generated } from "kysely"

export type HabitLogStatus = "completed" | "skipped" | "intentional_skip"
export type HabitCategory = "non_negotiable" | "optional"
export type GoalMetric = "habit_score" | "momentum_7d" | "streak" | "count"
export type GoalStatus = "active" | "completed" | "abandoned"

export interface UsersTable {
  id: string
  email: string
  created_at: Generated<Date>
}

export interface DaysTable {
  id: Generated<string>
  user_id: string
  date: string
  sleep_hours: number | null
  sleep_quality: number | null
  mood: number | null
  energy: number | null
  note: string | null
  closed_at: Date | null
}

export interface HabitsTable {
  id: string
  user_id: string
  name: string
  impact_weight: number
  category: HabitCategory
  is_active: boolean
  created_at: Date
}

export interface HabitLogsTable {
  id: string
  habit_id: string
  date: string
  status: HabitLogStatus
  value: number | null
  skip_reason: string | null
  created_at: Date
}

export interface TodosTable {
  id: string
  user_id: string
  title: string
  completed: boolean
  created_at: Date
}

export interface MitSelectionsTable {
  id: string
  user_id: string
  date: string
  todo_id: string
}

export interface DailyMetricsTable {
  id: string
  user_id: string
  date: string
  habit_score: number
  mit_completed: boolean
  momentum_7d: number | null
  created_at: Generated<Date>
}

export interface InsightEventsTable {
  id: string
  user_id: string
  insight_key: string
  created_at: Date
}

export interface InsightFeedbackTable {
  id: string
  user_id: string
  insight_key: string
  date: string
  action_taken: boolean | null
  outcome_delta: number | null
  created_at: Date
}

export interface GoalsTable {
  id: Generated<string>
  user_id: string
  title: string
  description: string | null
  metric: GoalMetric
  target_value: number
  start_date: string
  end_date: string | null
  status: GoalStatus
  created_at: Generated<Date>
  completed_at: Date | null
}

export interface Database {
  users: UsersTable
  days: DaysTable
  habits: HabitsTable
  habit_logs: HabitLogsTable
  todos: TodosTable
  mit_selections: MitSelectionsTable
  daily_metrics: DailyMetricsTable
  insight_events: InsightEventsTable
  insight_feedback: InsightFeedbackTable
  goals: GoalsTable
}



/*
TO ADD
type LatentState = {
  date: string
  motivation: number        // inferred
  fatigue: number           // inferred
  momentum: number          // inferred
  confidence: number        // uncertainty
}
*/