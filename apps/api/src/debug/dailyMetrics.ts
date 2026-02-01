// TODO: remove or guard debug/

import { computeDailyMetrics } from '../metrics/dailyMetrics'

computeDailyMetrics(
  'c876d1bc-243f-47fb-b4f4-aa0befe5a289',
  '2026-01-21'
).then(() => {
  console.log('Daily metrics computed')
  process.exit(0)
})
