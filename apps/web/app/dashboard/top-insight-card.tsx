"use client"

type Props = {
  insight: {
    key: string
    text: string
    because: string[]
    confidence: number
  }
  goalAligned: boolean
}

export default function TopInsightCard({ insight, goalAligned }: Props) {
  async function sendFeedback(actionTaken: boolean) {
    await fetch("/api/insights/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        insightKey: insight.key,
        actionTaken,
      }),
    })
  }

  return (
    <div style={{ padding: 16, border: "1px solid #ddd" }}>
      <p><strong>{insight.text}</strong></p>

      <ul>
        {insight.because.map((b, i) => (
          <li key={i}>{b}</li>
        ))}
      </ul>

      {goalAligned && (
        <p style={{ color: "green" }}>
          🎯 This supports one of your goals
        </p>
      )}

      <div style={{ marginTop: 12 }}>
        <button onClick={() => sendFeedback(true)}>
          I did this
        </button>{" "}
        <button onClick={() => sendFeedback(false)}>
          I didn’t
        </button>
      </div>
    </div>
  )
}
