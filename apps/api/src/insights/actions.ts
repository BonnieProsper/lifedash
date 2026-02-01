export type InsightAction = {
  label: string
  hint?: string
}

export function actionForInsight(
  insightKey: string
): InsightAction | null {
  // -------------------------
  // Correlation-based insights
  // -------------------------
  if (insightKey.startsWith("corr_sleep")) {
    return {
      label: "Protect your sleep window tonight",
      hint: "Consistency matters more than total hours.",
    }
  }

  if (insightKey.startsWith("corr_energy")) {
    return {
      label: "Schedule demanding work earlier",
      hint: "Use high-energy hours for deep work.",
    }
  }

  // -------------------------
  // Today system insights
  // -------------------------
  if (insightKey === "low_habit_score") {
    return {
      label: "Plan a reset day",
      hint: "Strip habits back to the essentials.",
    }
  }

  if (insightKey === "high_momentum") {
    return {
      label: "Lock tomorrow’s plan",
      hint: "Avoid adding new commitments.",
    }
  }

  if (insightKey === "mit_missed") {
    return {
      label: "Set tomorrow’s MIT",
      hint: "One task that makes tomorrow successful.",
    }
  }

  // -------------------------
  // Weekly system insights
  // -------------------------
  if (insightKey.startsWith("weekly_momentum")) {
    return {
      label: "Adjust next week’s workload",
      hint: "Momentum changes are system signals, not motivation issues.",
    }
  }

  return null
}
