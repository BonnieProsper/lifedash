"use client"

import { useEffect } from "react"
import { HabitList } from "./components/HabitList"
import { useDailyStore } from "./store/useDailyStore"
import { DailyResponse } from "@/types/daily"
import TopInsightCard from "./components/TopInsightCard"

export default function DailyPage() {
  const { data, setData } = useDailyStore()

  useEffect(() => {
    fetch("/api/daily")
      .then((res) => res.json())
      .then((json: DailyResponse) => setData(json))
  }, [])

  if (!data) return <div>Loading...</div>

  return (
    <div>
      <h1>Daily Dashboard</h1>
      <HabitList habits={data.habits} date={data.date} />
      <TopInsightCard insight={data.topInsight} />
      {/* You can add sleep/mood/energy inputs here */}
    </div>
  )
}