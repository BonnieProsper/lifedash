"use client"

import { useDailyStore } from "../store/useDailyStore"
import type { DailyHabit, HabitStatus } from "@/types/daily"

type Props = {
  habit: DailyHabit
  date: string
}

export default function HabitItem({ habit, date }: Props) {
  const updateHabit = useDailyStore((s) => s.updateHabit)

  async function setStatus(status: HabitStatus) {
    await fetch(`/api/habits/${habit.id}/log/${date}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
    updateHabit(habit.id, status)
  }

  return (
    <div style={{ display: "flex", gap: 8 }}>
      <span>{habit.name}</span>
      <button onClick={() => setStatus("completed")}>✓</button>
      <button onClick={() => setStatus("skipped")}>✕</button>
    </div>
  )
}
