import { randomUUID } from "crypto"
import { db } from "../db/db"

const USERS = 10
const DAYS = 30

function clamp(n: number) {
  return Math.max(0, Math.min(1, n))
}

function isoDate(daysAgo: number) {
  const d = new Date()
  d.setDate(d.getDate() - daysAgo)
  return d.toISOString().slice(0, 10)
}

async function run() {
  for (let u = 0; u < USERS; u++) {
    const userId = randomUUID()

    // create user
    await db.insertInto("users").values({
      id: userId,
      email: `fake${u}@lifedash.dev`,
    }).execute()

    let habit = Math.random() * 0.4 + 0.3
    let momentum = 0

    for (let d = DAYS; d > 0; d--) {
      const date = isoDate(d)

      const sleepHours = 6 + Math.random() * 2
      const sleepQuality = Math.round(clamp((sleepHours - 5) / 3) * 5)
      const mood = Math.round(clamp(0.4 + Math.random() * 0.4) * 5)
      const energy = Math.round(clamp((sleepHours - 5.5) / 2.5) * 5)

      const mitCompleted = Math.random() < energy / 5

      habit = clamp(habit + (mitCompleted ? 0.05 : -0.04))
      momentum = clamp(momentum + (habit - 0.5) * 0.1)

      await db.insertInto("days").values({
        id: randomUUID(),
        user_id: userId,
        date,
        sleep_hours: sleepHours,
        sleep_quality: sleepQuality,
        mood,
        energy,
      }).execute()

      await db.insertInto("daily_metrics").values({
        id: randomUUID(),
        user_id: userId,
        date,
        habit_score: habit,
        mit_completed: mitCompleted,
        momentum_7d: momentum,
      }).execute()
    }
  }

  console.log("Fake users seeded correctly")
  process.exit(0)
}

run().catch(err => {
  console.error(err)
  process.exit(1)
})
