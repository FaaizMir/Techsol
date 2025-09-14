import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface OnboardingState {
  step: number;
  data: Record<string, any>;
  setStep: (step: number) => void;
  updateData: (data: Record<string, any>) => void;
  reset: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      step: 1,
      data: {},
      setStep: (step) => set({ step }),
      updateData: (newData) => set((state) => ({ data: { ...state.data, ...newData } })),
      reset: () => set({ step: 1, data: {} }),
    }),
    { name: 'onboarding-storage' }
  )
);