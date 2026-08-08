import type { OrdersQuery } from '@/types/order';
import type { ReservationsQuery } from '@/types/reservation';

export const queryKeys = {
  orders: (query: OrdersQuery = {}) => ['orders', query] as const,
  order: (id: number) => ['order', id] as const,
  reservations: (query: ReservationsQuery = {}) => ['reservations', query] as const,
  reservation: (id: number) => ['reservation', id] as const,
  menu: () => ['menu'] as const,
  googleIntegration: () => ['googleIntegration'] as const,
};
