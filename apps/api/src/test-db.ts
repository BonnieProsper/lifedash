import { db } from "./db/db"

async function test() {
  const result = await db
    .selectFrom("habits")
    .select(["id", "name"])
    .limit(1)
    .execute()

  console.log(result)
}

test().finally(() => process.exit())
