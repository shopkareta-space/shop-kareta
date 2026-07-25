import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  id: string;
  email: string;
  fullName: string;
  mobile?: string;
  avatarUrl?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      
      login: (user) => set({ user, isAuthenticated: true, isLoading: false }),
      
      logout: () => set({ user: null, isAuthenticated: false, isLoading: false }),
      
      updateProfile: (data) => set((state) => ({
        user: state.user ? { ...state.user, ...data } : null
      })),
    }),
    {
      name: "shopkareta-auth",
    }
  )
);
