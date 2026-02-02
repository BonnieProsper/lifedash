"use client"

import HabitItem from "./HabitItem"
import { DailyHabit } from "@/types/daily"

type Props = {
  habits: DailyHabit[]
  date: string
}

export default function HabitList({ habits, date }: Props) {
  return (
    <div>
      <h3>Habits</h3>
      {habits.map((h) => (
        <HabitItem key={h.id} habit={h} date={date} />
      ))}
    </div>
  )
}
