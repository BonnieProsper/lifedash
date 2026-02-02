import { create } from "zustand";

type DailyState = {
  data: DailyResponse | null;
  setData: (d: DailyResponse) => void;
  updateHabitOptimistic: (habitId: string, status: HabitStatus) => void;
};

export const useDailyStore = create<DailyState>((set) => ({
  data: null,
  setData: (data) => set({ data }),

  updateHabitOptimistic: (habitId, status) =>
    set((state) => {
      if (!state.data) return state;

      return {
        data: {
          ...state.data,
          habits: state.data.habits.map((h) =>
            h.id === habitId
              ? { ...h, log: { ...h.log, status } }
              : h
          ),
        },
      };
    }),
}));
