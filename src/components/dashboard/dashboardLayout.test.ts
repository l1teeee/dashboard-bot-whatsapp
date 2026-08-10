import { describe, expect, it, vi } from 'vitest';
import { verticalCompactor } from 'react-grid-layout';
import {
  DASHBOARD_COLUMNS,
  DASHBOARD_LAYOUT_STORAGE_KEY,
  DEFAULT_DASHBOARD_LAYOUT,
  isDefaultDashboardLayout,
  loadDashboardLayout,
  resetDashboardLayout,
  saveDashboardLayout,
  updateDashboardLayout,
} from './dashboardLayout';

describe('dashboardLayout', () => {
  it('mantiene el layout inicial estable al compactarlo', () => {
    const compacted = verticalCompactor.compact(DEFAULT_DASHBOARD_LAYOUT, DASHBOARD_COLUMNS);
    expect(isDefaultDashboardLayout(compacted)).toBe(true);
    expect(compacted.find((item) => item.i === 'recent-orders')).toMatchObject({ y: 9, h: 9, minH: 6 });
  });

  it('restaura un layout válido conservando sus restricciones', () => {
    const custom = DEFAULT_DASHBOARD_LAYOUT.map((item) =>
      item.i === 'revenue' ? { ...item, w: 8 } : { ...item },
    );
    const storage = {
      getItem: vi.fn(() => JSON.stringify({
        version: 1,
        items: custom.map(({ i, x, y, w, h }) => ({ i, x, y, w, h })),
      })),
    };

    const restored = loadDashboardLayout(storage);

    expect(restored.find((item) => item.i === 'revenue')).toMatchObject({ w: 8, minW: 4, minH: 6 });
  });

  it('descarta datos corruptos o fuera de la cuadrícula', () => {
    const storage = {
      getItem: vi.fn(() => JSON.stringify({
        version: 1,
        items: DEFAULT_DASHBOARD_LAYOUT.map((item) =>
          item.i === 'revenue' ? { ...item, x: DASHBOARD_COLUMNS } : item,
        ),
      })),
    };

    expect(isDefaultDashboardLayout(loadDashboardLayout(storage))).toBe(true);
  });

  it('serializa únicamente posición y tamaño', () => {
    const storage = { setItem: vi.fn() };
    saveDashboardLayout(DEFAULT_DASHBOARD_LAYOUT, storage);

    expect(storage.setItem).toHaveBeenCalledWith(DASHBOARD_LAYOUT_STORAGE_KEY, expect.any(String));
    const payload = JSON.parse(storage.setItem.mock.calls[0][1]) as { items: Record<string, unknown>[] };
    expect(payload.items[0]).toEqual({ i: 'revenue', x: 0, y: 0, w: 7, h: 9 });
  });

  it('permite mover y redimensionar por teclado respetando límites', () => {
    const moved = updateDashboardLayout(DEFAULT_DASHBOARD_LAYOUT, 'revenue', { type: 'move', dx: -1, dy: 0 });
    expect(moved.find((item) => item.i === 'revenue')?.x).toBe(0);

    const wider = updateDashboardLayout(DEFAULT_DASHBOARD_LAYOUT, 'revenue', { type: 'resize', dw: 1, dh: 0 });
    expect(wider.find((item) => item.i === 'revenue')?.w).toBe(8);
    expect(isDefaultDashboardLayout(wider)).toBe(false);
    expect(isDefaultDashboardLayout(resetDashboardLayout())).toBe(true);
  });

  it('permite agrandar y achicar cada eje dentro de sus lÃ­mites', () => {
    const smaller = updateDashboardLayout(DEFAULT_DASHBOARD_LAYOUT, 'revenue', { type: 'resize', dw: -2, dh: -3 });
    expect(smaller.find((item) => item.i === 'revenue')).toMatchObject({ w: 5, h: 6 });

    const taller = updateDashboardLayout(smaller, 'revenue', { type: 'resize', dw: 0, dh: 5 });
    expect(taller.find((item) => item.i === 'revenue')?.h).toBe(11);

    const atMinimum = updateDashboardLayout(smaller, 'revenue', { type: 'resize', dw: -99, dh: -99 });
    expect(atMinimum.find((item) => item.i === 'revenue')).toMatchObject({ w: 4, h: 6 });
  });
});
