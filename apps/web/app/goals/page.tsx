import { api } from "@/app/lib/api"

export default async function GoalsPage() {
  const goals = await api("goals")

  return (
    <main style={{ padding: 24 }}>
      <h1>Goals</h1>

      {goals.length === 0 && <p>No active goals.</p>}

      {goals.map((g: any) => (
        <section key={g.id} style={{ marginBottom: 16 }}>
          <h3>{g.title}</h3>
          <p>{g.description}</p>

          <p>
            Metric: <strong>{g.metric}</strong><br />
            Progress: <strong>{g.progress ?? "—"}</strong> / {g.target_value}
          </p>
        </section>
      ))}
    </main>
  )
}
