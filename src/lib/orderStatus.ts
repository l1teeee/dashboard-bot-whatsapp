import type { OrderStatus } from '@/types/order';

export const STATUS_META: Record<OrderStatus, {
  label: string;
  actionLabel: string;
  dot: string;
  badge: string;
  column: string;
  surface: string;
  text: string;
  border: string;
}> = {
  pending: {
    label: 'Pendiente',
    actionLabel: 'Marcar pendiente',
    dot: 'bg-pending',
    badge: 'bg-pending-soft text-pending',
    column: 'border-t-pending',
    surface: 'bg-yellow',
    text: 'text-ink-dark',
    border: 'border-yellow',
  },
  processing: {
    label: 'En proceso',
    actionLabel: 'Marcar en proceso',
    dot: 'bg-processing',
    badge: 'bg-processing-soft text-processing',
    column: 'border-t-processing',
    surface: 'bg-lilac',
    text: 'text-ink-dark',
    border: 'border-lilac',
  },
  completed: {
    label: 'Completado',
    actionLabel: 'Marcar completado',
    dot: 'bg-completed',
    badge: 'bg-completed-soft text-completed',
    column: 'border-t-completed',
    surface: 'bg-mint',
    text: 'text-ink-dark',
    border: 'border-mint',
  },
  cancelled: {
    label: 'Cancelado',
    actionLabel: 'Cancelar pedido',
    dot: 'bg-cancelled',
    badge: 'bg-cancelled-soft text-cancelled',
    column: 'border-t-cancelled',
    surface: 'bg-coral',
    text: 'text-ink-dark',
    border: 'border-coral',
  },
};

export const STATUS_ORDER: OrderStatus[] = ['pending', 'processing', 'completed', 'cancelled'];
