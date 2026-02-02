"use client"

type Props = {
  date: string
  onChange: (date: string) => void
}

export function DateNavigator({ date, onChange }: Props) {
  function shift(days: number) {
    const d = new Date(date)
    d.setDate(d.getDate() + days)
    onChange(d.toISOString().slice(0, 10))
  }

  return (
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      <button onClick={() => shift(-1)}>←</button>
      <strong>{date}</strong>
      <button onClick={() => shift(1)}>→</button>
    </div>
  )
}
