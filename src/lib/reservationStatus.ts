import type { ReservationStatus } from '@/types/reservation';

export const STATUS_META: Record<
  ReservationStatus,
  {
    label: string;
    actionLabel: string;
    dot: string;
    badge: string;
    surface: string;
    text: string;
    border: string;
  }
> = {
  pending: {
    label: 'Pendiente',
    actionLabel: 'Marcar pendiente',
    dot: 'bg-pending',
    badge: 'bg-pending-soft text-pending',
    surface: 'bg-yellow',
    text: 'text-ink-dark',
    border: 'border-yellow',
  },
  confirmed: {
    label: 'Confirmada',
    actionLabel: 'Confirmar',
    dot: 'bg-processing',
    badge: 'bg-processing-soft text-processing',
    surface: 'bg-lilac',
    text: 'text-ink-dark',
    border: 'border-lilac',
  },
  seated: {
    label: 'Sentada',
    actionLabel: 'Marcar sentada',
    dot: 'bg-seated',
    badge: 'bg-seated-soft text-seated',
    surface: 'bg-cyan',
    text: 'text-ink-dark',
    border: 'border-cyan',
  },
  completed: {
    label: 'Completada',
    actionLabel: 'Marcar completada',
    dot: 'bg-completed',
    badge: 'bg-completed-soft text-completed',
    surface: 'bg-mint',
    text: 'text-ink-dark',
    border: 'border-mint',
  },
  cancelled: {
    label: 'Cancelada',
    actionLabel: 'Cancelar',
    dot: 'bg-cancelled',
    badge: 'bg-cancelled-soft text-cancelled',
    surface: 'bg-coral',
    text: 'text-ink-dark',
    border: 'border-coral',
  },
  no_show: {
    label: 'No asistio',
    actionLabel: 'Marcar no asistio',
    dot: 'bg-noshow',
    badge: 'bg-noshow-soft text-noshow',
    surface: 'bg-coral-soft',
    text: 'text-ink-dark',
    border: 'border-coral-soft',
  },
};

export const STATUS_ORDER: ReservationStatus[] = [
  'pending',
  'confirmed',
  'seated',
  'completed',
  'cancelled',
  'no_show',
];
