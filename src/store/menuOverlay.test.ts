import { beforeEach, describe, expect, it } from 'vitest';
import { useMenuOverlayStore } from './menuOverlay';
import type { MenuItem } from '@/types/menu';

const item: MenuItem = { id: 7, name: 'Sopa', description: null, price: 4, category: null, available: false, created_at: '2026-08-01' };

describe('menuOverlay', () => {
  beforeEach(() => useMenuOverlayStore.getState().reset());
  it('keeps an unavailable item available for session reactivation and can reset account state', () => {
    useMenuOverlayStore.getState().remember(item);
    expect(useMenuOverlayStore.getState().hiddenItems[7]).toEqual(item);
    useMenuOverlayStore.getState().reset();
    expect(useMenuOverlayStore.getState().hiddenItems).toEqual({});
  });
  it('updates the retained snapshot and removes it when the item becomes active', () => {
    useMenuOverlayStore.getState().remember(item);
    useMenuOverlayStore.getState().remember({ ...item, name: 'Sopa del día' });
    expect(useMenuOverlayStore.getState().hiddenItems[7]?.name).toBe('Sopa del día');
    useMenuOverlayStore.getState().forget(7);
    expect(useMenuOverlayStore.getState().hiddenItems[7]).toBeUndefined();
  });
});
