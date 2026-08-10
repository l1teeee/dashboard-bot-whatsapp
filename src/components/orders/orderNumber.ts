import type { Order } from '@/types/order';

export function formatOrderNumber(order: Pick<Order, 'id' | 'daily_number'>): string {
  return `#${order.daily_number ?? order.id}`;
}
