// delete??

"use client"

type Props = {
  habit: any
  date: string
}

export default function HabitItem({ habit, date }: Props) {
  async function setStatus(status: "completed" | "skipped") {
    await fetch("/api/habit_logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        habit_id: habit.id,
        date,
        status,
      }),
    })
  }

  return (
    <div style={{ display: "flex", gap: 8 }}>
      <span>{habit.name}</span>
      <button onClick={() => setStatus("completed")}>✓</button>
      <button onClick={() => setStatus("skipped")}>✕</button>
    </div>
  )
}
