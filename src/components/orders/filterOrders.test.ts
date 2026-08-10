import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { filterOrders, parseLocalDateBoundary } from './filterOrders';
import type { FilterState } from './OrderFilters';
import type { Order } from '@/types/order';

beforeAll(() => {
  vi.stubEnv('TZ', 'America/El_Salvador');
});

afterAll(() => {
  vi.unstubAllEnvs();
});

const makeOrder = (id: number, created_at: string): Order => ({
  id,
  created_at,
  updated_at: created_at,
  status: 'pending',
  position: id,
  total: 1,
  phone_number: '+503 7000-0000',
  items: [],
  notes: null,
  business_day: null,
  daily_number: null,
});

describe('local order date filters', () => {
  it('constructs local start and end boundaries without UTC date parsing', () => {
    expect(Intl.DateTimeFormat().resolvedOptions().timeZone).toBe('America/El_Salvador');
    expect(parseLocalDateBoundary('2026-08-01')?.toISOString()).toBe('2026-08-01T06:00:00.000Z');
    expect(parseLocalDateBoundary('2026-08-01', true)?.toISOString()).toBe('2026-08-02T05:59:59.999Z');
  });

  it('includes the entire selected local day but not the previous or next day', () => {
    const orders = [
      makeOrder(1, '2026-08-01T05:59:59.999Z'),
      makeOrder(2, '2026-08-01T06:00:00.000Z'),
      makeOrder(3, '2026-08-02T05:59:59.999Z'),
      makeOrder(4, '2026-08-02T06:00:00.000Z'),
    ];
    const filters: FilterState = { status: 'all', phone: '', from: '2026-08-01', to: '2026-08-01' };

    expect(filterOrders(orders, filters).map((order) => order.id)).toEqual([2, 3]);
  });
});
