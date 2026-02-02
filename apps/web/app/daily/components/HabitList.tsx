"use client"

type Habit = {
  id: string
  name: string
  log: {
    status: "completed" | "skipped" | "failed"
  } | null
}

type Props = {
  habits: Habit[]
}

export function HabitList({ habits }: Props) {
  async function updateHabit(habitId: string, status: string) {
    await fetch("/api/day/habit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ habitId, status }),
    })
  }

  return (
    <div>
      <h3>Habits</h3>
      {habits.map(h => (
        <label key={h.id} style={{ display: "block" }}>
          <input
            type="checkbox"
            checked={h.log?.status === "completed"}
            onChange={e =>
              updateHabit(
                h.id,
                e.target.checked ? "completed" : "skipped"
              )
            }
          />
          {h.name}
        </label>
      ))}
    </div>
  )
}

updateHabitOptimistic(habit.id, "completed");

fetch(`/api/habits/${habit.id}/log/${date}`, { method: "POST" })
  .catch(() => refetchDaily());
