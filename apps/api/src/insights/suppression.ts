// src/insights/suppression.ts

import { db } from "../db/db"
import crypto from "node:crypto"

export async function shouldEmitInsight(
  userId: string,
  insightKey: string,
  cooldownDays: number
): Promise<boolean> {
  const since = new Date()
  since.setDate(since.getDate() - cooldownDays)

  const last = await db
    .selectFrom("insight_events")
    .select("created_at")
    .where("user_id", "=", userId)
    .where("insight_key", "=", insightKey)
    .orderBy("created_at", "desc")
    .executeTakeFirst()

  if (!last) return true
  return last.created_at < since
}

export async function recordInsightEvent(
  userId: string,
  insightKey: string
) {
  await db.insertInto("insight_events").values({
    id: crypto.randomUUID(),
    user_id: userId,
    insight_key: insightKey,
    created_at: new Date(),
  }).execute()
}
