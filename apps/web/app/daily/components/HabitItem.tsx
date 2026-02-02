"use client"

type Props = {
  habit: { id: string; name: string; log: { status: "completed" | "skipped" | "failed" } | null }
  date: string
  onUpdate: (status: "completed" | "skipped" | "failed") => void
}

export default function HabitItem({ habit, date, onUpdate }: Props) {
  return (
    <div style={{ display: "flex", gap: 8 }}>
      <span>{habit.name}</span>
      <button onClick={() => onUpdate("completed")}>✓</button>
      <button onClick={() => onUpdate("skipped")}>✕</button>
    </div>
  )
}
