import type { OrderStatus } from '@/types/order';

export const STATUS_META: Record<OrderStatus, {
  label: string;
  actionLabel: string;
  dot: string;
  badge: string;
  column: string;
}> = {
  pending: {
    label: 'Pendiente',
    actionLabel: 'Marcar pendiente',
    dot: 'bg-pending',
    badge: 'bg-pending-soft text-pending',
    column: 'border-t-pending',
  },
  processing: {
    label: 'En proceso',
    actionLabel: 'Marcar en proceso',
    dot: 'bg-processing',
    badge: 'bg-processing-soft text-processing',
    column: 'border-t-processing',
  },
  completed: {
    label: 'Completado',
    actionLabel: 'Marcar completado',
    dot: 'bg-completed',
    badge: 'bg-completed-soft text-completed',
    column: 'border-t-completed',
  },
  cancelled: {
    label: 'Cancelado',
    actionLabel: 'Cancelar pedido',
    dot: 'bg-cancelled',
    badge: 'bg-cancelled-soft text-cancelled',
    column: 'border-t-cancelled',
  },
};

export const STATUS_ORDER: OrderStatus[] = ['pending', 'processing', 'completed', 'cancelled'];
