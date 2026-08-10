import { describe, expect, it } from 'vitest';
import { reorderOrdersInStatus } from './reorderOrders';
import type { Order } from '@/types/order';

const order = (id: number, position: number, status: Order['status'] = 'pending'): Order => ({
  id, position, status, total: 1, phone_number: '5037000000', items: [], notes: null,
  created_at: '2026-08-01T12:00:00Z', updated_at: '2026-08-01T12:00:00Z',
  business_day: null, daily_number: null,
});

describe('reorderOrdersInStatus', () => {
  it('moves the item at once and assigns stable positions only in its column', () => {
    const source = [order(1, 0), order(2, 1), order(3, 2), order(4, 0, 'processing')];
    const result = reorderOrdersInStatus(source, 'pending', 1, 2);
    expect(result.filter((item) => item.status === 'pending').sort((a, b) => a.position - b.position).map((item) => item.id)).toEqual([2, 3, 1]);
    expect(result.find((item) => item.id === 4)?.position).toBe(0);
    expect(source.map((item) => item.position)).toEqual([0, 1, 2, 0]);
  });
});
