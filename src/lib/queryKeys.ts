import type { OrdersQuery } from '@/types/order';

export const queryKeys = {
  orders: (query: OrdersQuery = {}) => ['orders', query] as const,
  order: (id: number) => ['order', id] as const,
  menu: () => ['menu'] as const,
};
