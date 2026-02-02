"use client"

type Props = {
  inputs: {
    sleep: { hours: number | null; quality: number | null }
    mood: number | null
    energy: number | null
  }
}

export function MetricsForm({ inputs }: Props) {
  async function save(data: any) {
    await fetch("/api/day", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
  }

  return (
    <div>
      <h3>Metrics</h3>

      <input
        placeholder="Sleep hours"
        defaultValue={inputs.sleep.hours ?? ""}
        onBlur={e =>
          save({ sleep_hours: Number(e.target.value) })
        }
      />

      <input
        placeholder="Mood (1–5)"
        defaultValue={inputs.mood ?? ""}
        onBlur={e => save({ mood: Number(e.target.value) })}
      />

      <input
        placeholder="Energy (1–5)"
        defaultValue={inputs.energy ?? ""}
        onBlur={e => save({ energy: Number(e.target.value) })}
      />
    </div>
  )
}
