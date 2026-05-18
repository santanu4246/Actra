import { create } from "zustand";

export type OnboardingData = {
  ageRange: string;
  topic: string;
  focus: string;
  difficulty: string;
  hours: number;
  minutes: number;
  frequency: string;
};

type OnboardingState = {
  data: Partial<OnboardingData>;
  set: (updates: Partial<OnboardingData>) => void;
  reset: () => void;
};

export const useOnboardingStore = create<OnboardingState>((set) => ({
  data: {},
  set: (updates) =>
    set((state) => ({ data: { ...state.data, ...updates } })),
  reset: () => set({ data: {} }),
}));
