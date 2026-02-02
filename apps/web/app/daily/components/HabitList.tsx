"use client"

import HabitItem from "./HabitItem"
import { useDailyStore } from "./store/useDailyStore"
import { DailyResponse } from "@/types/daily"

type Props = {
  habits: DailyResponse["habits"]
  date: string
}

export function HabitList({ habits, date }: Props) {
  const { updateHabitOptimistic } = useDailyStore()

  return (
    <div>
      <h3>Habits</h3>
      {habits.map(h => (
        <HabitItem
          key={h.id}
          habit={h}
          date={date}
          onUpdate={(status) => {
            updateHabitOptimistic(h.id, status)
            fetch(`/api/habits/${h.id}/log/${date}`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ status }),
            }).catch(() => {
              // optionally rollback or refetch
            })
          }}
        />
      ))}
    </div>
  )
}
