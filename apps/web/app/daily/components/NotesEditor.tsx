"use client"

export function NotesEditor({ note }: { note: string }) {
  async function save(note: string) {
    await fetch("/api/day", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ note }),
    })
  }

  return (
    <div>
      <h3>Notes</h3>
      <textarea
        defaultValue={note}
        onBlur={e => save(e.target.value)}
        rows={4}
        style={{ width: "100%" }}
      />
    </div>
  )
}
