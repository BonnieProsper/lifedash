"use client"

import { DailyResponse } from "@/types/daily"

type Props = {
  insight: DailyResponse["topInsight"]
}

export default function TopInsightCard({ insight }: Props) {
  if (!insight) return null

  return (
    <div style={{ border: "1px solid #ccc", padding: 12, marginTop: 16 }}>
      <h3>Insight</h3>
      <p>{insight.text}</p>
      <ul>
        {insight.because.map((b, i) => (
          <li key={i}>{b}</li>
        ))}
      </ul>
      {insight.advice && <p><b>Advice:</b> {insight.advice}</p>}
    </div>
  )
}
