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
      step: 0,
      data: {
        project: { title: "", description: "", category: "", deadline: "" },
        requirements: { notes: "", files: [] },
        milestones: [{ title: "", deliverable: "", deadline: "", amount: "" }],
        client: { name: "", email: "", company: "", country: "" },
      },
      setStep: (step) => set({ step }),
      updateData: (newData) => set((state) => ({ data: { ...state.data, ...newData } })),
      reset: () => set({ 
        step: 0, 
        data: {
          project: { title: "", description: "", category: "", deadline: "" },
          requirements: { notes: "", files: [] },
          milestones: [{ title: "", deliverable: "", deadline: "", amount: "" }],
          client: { name: "", email: "", company: "", country: "" },
        }
      }),
    }),
    { name: 'onboarding-storage' }
  )
);