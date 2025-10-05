import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { OnboardingFormData, INITIAL_ONBOARDING_DATA } from '@/types/onboarding';

interface OnboardingState {
  step: number;
  data: OnboardingFormData;
  setStep: (step: number) => void;
  updateData: (newData: Partial<OnboardingFormData>) => void;
  reset: () => void;
}

const initialData: OnboardingFormData = {
  project: { title: "", description: "", category: "", deadline: "" },
  requirements: { notes: "", files: [] },
  milestones: [],
  client: { name: "", email: "", company: "", country: "", phone: "", contactPerson: "" },
};

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      step: 0,
      data: initialData,
      setStep: (step) => set({ step }),
      updateData: (newData) => set((state) => ({ 
        data: { ...state.data, ...newData } 
      })),
      reset: () => set({ 
        step: 0, 
        data: initialData
      }),
    }),
    { name: 'onboarding-storage' }
  )
);