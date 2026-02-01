import { FastifyInstance } from "fastify"
import { computeHabitStreak } from "../streaks/habitStreak"

export default async function streakRoutes(app: FastifyInstance) {
  app.get("/habit/:habitId/:date", async (req, reply) => {
    const { habitId, date } = req.params as {
      habitId: string
      date: string
    }

    const streak = await computeHabitStreak(habitId, date)
    reply.send({ habitId, date, streak })
  })
}
