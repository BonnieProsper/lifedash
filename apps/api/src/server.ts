import { buildApp } from "./app"

const start = async () => {
  const app = buildApp()

  try {
    await app.listen({ port: Number(process.env.PORT) || 3000 })
    console.log("LifeDash backend running")
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()
