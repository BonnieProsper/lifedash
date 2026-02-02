"use client"

type MIT = {
  id: string
  title: string
  completed: boolean
}

export function MITList({ mits }: { mits: MIT[] }) {
  async function toggle(id: string, completed: boolean) {
    await fetch("/api/todos/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, completed }),
    })
  }

  return (
    <div>
      <h3>MITs</h3>
      {mits.map(m => (
        <label key={m.id} style={{ display: "block" }}>
          <input
            type="checkbox"
            checked={m.completed}
            onChange={e => toggle(m.id, e.target.checked)}
          />
          {m.title}
        </label>
      ))}
    </div>
  )
}
