import { create } from 'zustand';
import type { MenuItem } from '@/types/menu';

interface MenuOverlayState {
  hiddenItems: Record<number, MenuItem>;
  remember: (item: MenuItem) => void;
  forget: (id: number) => void;
}

export const useMenuOverlayStore = create<MenuOverlayState>((set) => ({
  hiddenItems: {},
  remember: (item: MenuItem) => set((state) => ({
    hiddenItems: { ...state.hiddenItems, [item.id]: item },
  })),
  forget: (id: number) => set((state) => {
    const next = { ...state.hiddenItems };
    delete next[id];
    return { hiddenItems: next };
  }),
}));
