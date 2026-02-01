import { FastifyInstance } from "fastify"

import topInsightRoutes from "./top"
import todayInsightRoutes from "./today"
import weeklyInsightRoutes from "./weekly"
import feedbackRoutes from "./feedback"
import correlationInsightRoutes from "./correlations"
import leverageRoutes from "./leverage"
import historyRoutes from "./history" 

export default async function insightRoutes(app: FastifyInstance) {
  // Public, read-only insights (no auth required)
  app.register(topInsightRoutes)
  app.register(todayInsightRoutes)
  app.register(weeklyInsightRoutes)

  // Auth-required learning loop
  app.register(feedbackRoutes)
  app.register(historyRoutes)

  // Deep analysis (auth required, pro-gated later)
  app.register(correlationInsightRoutes)
  app.register(leverageRoutes)
}
