"use client"

import { create } from "zustand"
import { DailyResponse, HabitStatus } from "@/types/daily"

interface DailyStore {
  data: DailyResponse | null
  updateHabitOptimistic: (habitId: string, status: HabitStatus) => void
  setData: (data: DailyResponse) => void
}

export const useDailyStore = create<DailyStore>((set) => ({
  data: null,
  setData: (data) => set({ data }),
  updateHabitOptimistic: (habitId, status) =>
    set((state) => ({
      data: state.data
        ? {
            ...state.data,
            habits: state.data.habits.map(h =>
              h.id === habitId ? { ...h, log: { status } } : h
            ),
          }
        : null,
    })),
}))
