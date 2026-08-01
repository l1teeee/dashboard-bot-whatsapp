import type { FilterState } from './OrderFilters';
import type { Order } from '@/types/order';

/** Parses an HTML date value as a boundary in the user's local timezone. */
export function parseLocalDateBoundary(value: string, endOfDay = false): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day, endOfDay ? 23 : 0, endOfDay ? 59 : 0, endOfDay ? 59 : 0, endOfDay ? 999 : 0);

  // Reject values such as 2026-02-31 instead of allowing Date to roll them over.
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null;
  return date;
}

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
