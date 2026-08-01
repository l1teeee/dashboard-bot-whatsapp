import { create } from 'zustand';

interface ConnectionState {
  isOffline: boolean;
  setOffline: (offline: boolean) => void;
}

export const useConnectionStore = create<ConnectionState>((set) => ({
  isOffline: false,
  setOffline: (offline: boolean) => set({ isOffline: offline }),
}));
