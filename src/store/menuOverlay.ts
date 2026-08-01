import { create } from 'zustand';
import type { MenuItem } from '@/types/menu';

interface MenuOverlayState {
  hiddenItems: Record<number, MenuItem>;
  remember: (item: MenuItem) => void;
  forget: (id: number) => void;
  reset: () => void;
}

export const useMenuOverlayStore = create<MenuOverlayState>((set) => ({
  hiddenItems: {},
  remember: (item) => set((state) => ({ hiddenItems: { ...state.hiddenItems, [item.id]: item } })),
  forget: (id) => set((state) => {
    const hiddenItems = { ...state.hiddenItems };
    delete hiddenItems[id];
    return { hiddenItems };
  }),
  reset: () => set({ hiddenItems: {} }),
}));
