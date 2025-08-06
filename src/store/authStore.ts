import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AuthState {
  isAuthenticated: boolean;
  user: { id: string; phoneNumber: string } | null;
  login: (phoneNumber: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      login: (phoneNumber: string) => {
        set({ isAuthenticated: true, user: { id: 'user-123', phoneNumber } });
      },
      logout: () => {
        set({ isAuthenticated: false, user: null });
      },
    }),
    {
      name: 'gemini-auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);