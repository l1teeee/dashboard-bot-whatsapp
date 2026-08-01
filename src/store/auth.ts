import { create } from 'zustand';

interface AuthState {
  apiKey: string | null;
  setApiKey: (key: string) => void;
  clearApiKey: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  apiKey: null,
  setApiKey: (key: string) => set({ apiKey: key }),
  clearApiKey: () => set({ apiKey: null }),
}));
