import { create } from "zustand"
import type { DailyResponse, DailyHabit, HabitStatus } from "@/types/daily"

interface DailyState {
  day?: DailyResponse
  setDay: (data: DailyResponse) => void
  updateHabit: (habitId: string, status: HabitStatus) => void
}

export const useDailyStore = create<DailyState>((set) => ({
  day: undefined,
  setDay: (data) => set({ day: data }),
  updateHabit: (habitId, status) =>
    set((state) => {
      if (!state.day) return state
      const updatedHabits = state.day.habits.map((h) =>
        h.id === habitId ? { ...h, log: { status } } : h
      )
      return { day: { ...state.day, habits: updatedHabits } }
    }),
}))
