// TODO: should be surfaced as insight
// src/insights/habitRisk.ts

import { db } from "../db/db"
import { sql } from "kysely"

export type AtRiskHabit = {
  habit_id: string
  name: string
  skipped_count: number
}

export async function getAtRiskHabits(
  userId: string,
  windowDays = 3,
  threshold = 2
): Promise<AtRiskHabit[]> {
  const result = await db.executeQuery(
    sql`
      select
        h.id as habit_id,
        h.name,
        count(*) filter (
          where hl.status = 'skipped'
        ) as skipped_count
      from habits h
      join habit_logs hl on hl.habit_id = h.id
      where h.user_id = ${userId}
        and hl.date >= current_date - interval '${sql.raw(
          String(windowDays)
        )} days'
      group by h.id
      having count(*) filter (
        where hl.status = 'skipped'
      ) >= ${threshold}
    `.compile(db)
  )

  return result.rows as AtRiskHabit[]
}
