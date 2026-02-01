import { FastifyInstance } from "fastify"
import { computeHabitSystemLeverage } from "../../insights/leverage"

export default async function leverageRoutes(app: FastifyInstance) {
  app.get("/leverage/:date", async (req, reply) => {
    if (!req.user) {
      reply.code(401).send({ error: "Unauthorized" })
      return
    }

    const { date } = req.params as { date: string }

    return computeHabitSystemLeverage(req.user.id, date)
  })
}
