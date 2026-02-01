import { api } from "../lib/api"

export default async function RewardsPage() {
  const rewards = await api("rewards")

  return (
    <main>
      <h1>Unlocked Rewards</h1>
      <ul>
        {rewards.map((r: any) => (
          <li key={r.id}>{r.type}</li>
        ))}
      </ul>
    </main>
  )
}
