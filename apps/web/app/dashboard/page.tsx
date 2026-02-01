import { api } from "@/app/lib/api"
import TopInsightCard from "./top-insight-card"

export default async function Dashboard() {
  const today = new Date().toISOString().slice(0, 10)

  const [topResult, todayInsights] = await Promise.all([
    api("insights/top"),
    api(`insights/today/${today}`),
  ])

  return (
    <main style={{ padding: 32, maxWidth: 800 }}>
      <h1>LifeDash</h1>

      <section style={{ marginTop: 24 }}>
        <h2>Top Insight</h2>

        {!topResult ? (
          <p>No strong insights yet. Keep logging your days.</p>
        ) : (
          <TopInsightCard
            insight={topResult.insight}
            goalAligned={topResult.goalAligned}
          />
        )}
      </section>

      <section style={{ marginTop: 32 }}>
        <h2>Today</h2>
        <pre>{JSON.stringify(todayInsights, null, 2)}</pre>
      </section>

      <nav style={{ marginTop: 32 }}>
        <a href="/goals">Goals</a> ·{" "}
        <a href="/insights">Insights</a> ·{" "}
        <a href="/review">Weekly Review</a>
      </nav>
    </main>
  )
}
