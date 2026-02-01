// src/debug/momentum.ts
import { getHabitMomentum } from "../insights/momentum"

async function run() {
  const value = await getHabitMomentum(
    "a5754227-1577-4d2b-beb0-e52eea423543"
  )
  console.log(value)
}

run()
