"use client"

import { useEffect } from "react"
import { useDailyStore } from "./store/useDailyStore"
import HabitList from "./components/HabitList"

export default function DailyPage() {
  const day = useDailyStore((s) => s.day)
  const setDay = useDailyStore((s) => s.setDay)

  useEffect(() => {
    fetch("/api/day/2026-02-02")
      .then((res) => res.json())
      .then(setDay)
      .catch(console.error)
  }, [setDay])

  if (!day) return <div>Loading...</div>

  return (
    <div>
      <h2>Daily Dashboard: {day.date}</h2>
      <HabitList habits={day.habits} date={day.date} />
    </div>
  )
}
