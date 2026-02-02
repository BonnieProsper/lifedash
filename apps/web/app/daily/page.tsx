import { api } from "@/app/lib/api"
import { DateNavigator } from "./components/DateNavigator"
import { HabitList } from "./components/HabitList"
import { MITList } from "./components/MITList"
import { MetricsForm } from "./components/MetricsForm"
import { NotesEditor } from "./components/NotesEditor"
import TopInsightCard from "./components/TopInsightCard"
import { DailyPayload } from "./types"

export default async function DailyPage({
  searchParams,
}: {
  searchParams?: { date?: string }
}) {
  const date = searchParams?.date
  const daily = await api(
    date ? `daily?date=${date}` : "daily"
  ) as DailyPayload

  return (
    <main style={{ maxWidth: 700, margin: "0 auto" }}>
      <DateNavigator
        date={daily.date}
        onChange={d => {
          window.location.href = `/daily?date=${d}`
        }}
      />

      <TopInsightCard insight={daily.topInsight} />

      <HabitList habits={daily.habits} />

      <MITList mits={daily.mits} />

      <MetricsForm inputs={daily.inputs} />

      <NotesEditor note={daily.inputs.note} />
    </main>
  )
}


// add here or somehwere else: 
if (date > today) throw error;
if (date < today - 30) throw error;
if (day.is_closed) throw error;
