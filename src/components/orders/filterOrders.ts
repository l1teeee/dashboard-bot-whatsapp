import type { FilterState } from './OrderFilters';
import type { Order } from '@/types/order';
import { parseLocalDateBoundary } from '@/lib/dateBoundary';

export { parseLocalDateBoundary };

export function filterOrders(orders: Order[], filters: FilterState, limit = 100): Order[] {
  const normalizedQuery = filters.phone.replace(/\D/g, '');
  const from = filters.from ? parseLocalDateBoundary(filters.from) : null;
  const to = filters.to ? parseLocalDateBoundary(filters.to, true) : null;

  return orders.slice(0, limit).filter((order) => {
    if (filters.status !== 'all' && order.status !== filters.status) return false;
    if (normalizedQuery && !order.phone_number.replace(/\D/g, '').includes(normalizedQuery)) return false;

    const createdAt = new Date(order.created_at).getTime();
    if (from && createdAt < from.getTime()) return false;
    if (to && createdAt > to.getTime()) return false;
    return true;
  });
}
