import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: number;
  email: string;
  username?: string;
  isOnboardingCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (token: string, user: User) => void;
  clearAuth: () => void;
  setUser: (user: User) => void;
  updateOnboardingStatus: (completed: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (token, user) => set({ user, token, isAuthenticated: true }),
      clearAuth: () => set({ user: null, token: null, isAuthenticated: false }),
      setUser: (user) => set({ user }),
      updateOnboardingStatus: (completed) => set((state) => ({
        user: state.user ? { ...state.user, isOnboardingCompleted: completed } : null
      })),
    }),
    { name: 'auth-storage' }
  )
);