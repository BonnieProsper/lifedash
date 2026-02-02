"use client"

type Insight = {
  key: string
  text: string
  because: string[]
  confidence: number
  actionable?: boolean
  advice?: string
}

type Props = {
  insight: Insight | null
}

export default function TopInsightCard({ insight }: Props) {
  if (!insight) {
    return <p>No strong insight yet. Keep logging.</p>
  }

  const { key, text, because, actionable, advice } = insight

  async function sendFeedback(actionTaken: boolean) {
    await fetch("/api/insights/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        insightKey: key,
        actionTaken,
      }),
    })
  }

  return (
    <div style={{ padding: 16, border: "1px solid #ddd" }}>
      <strong>{text}</strong>

      <ul>
        {because.map((b, i) => (
          <li key={i}>{b}</li>
        ))}
      </ul>

      {actionable && advice && (
        <p>
          <em>Suggestion: {advice}</em>
        </p>
      )}

      <div style={{ marginTop: 12 }}>
        <button onClick={() => sendFeedback(true)}>
          I did this
        </button>
        <button onClick={() => sendFeedback(false)}>
          I didn’t
        </button>
      </div>
    </div>
  )
}
