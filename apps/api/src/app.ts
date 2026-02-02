import Fastify from "fastify"

// Plugins
import { authPlugin } from "./plugins/auth"

// Routes
import dayRoutes from "./routes/day"
import habitRoutes from "./routes/habits"
import mitRoutes from "./routes/mit"
import metricsRoutes from "./routes/metrics"
import insightRoutes from "./routes/insights"
import streakRoutes from "./routes/streaks"
import debugRoutes from "./routes/debug"
import dailyRoutes from "./routes/daily"


export function buildApp() {
  const app = Fastify({ logger: true })

  // Global auth (can be made selective later)
  app.register(authPlugin)

  // Core write paths
  app.register(dayRoutes, { prefix: "/api/day" })
  app.register(habitRoutes, { prefix: "/api/habits" })
  app.register(mitRoutes, { prefix: "/api/mit" })
  app.register(dailyRoutes, { prefix: "/api" })


  // Analytics & insights
  app.register(metricsRoutes, { prefix: "/api/metrics" })
  app.register(insightRoutes, { prefix: "/api/insights" })
  app.register(streakRoutes, { prefix: "/api/streaks" })

  // Internal / dev only
  app.register(debugRoutes, { prefix: "/api/debug" })

  // Health check
  app.get("/health", async () => ({ status: "ok" }))

  return app
}
