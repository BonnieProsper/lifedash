// apps/api/src/types/fastify.d.ts
import "fastify"
import { Kysely } from "kysely"
import { Database } from "../db/types"

declare module "fastify" {
  interface FastifyInstance {
    db: Kysely<Database>
  }

  interface FastifyRequest {
    user?: {
      id: string
      isPro: boolean
    }
  }
}
