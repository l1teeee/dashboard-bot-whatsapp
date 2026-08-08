import { Badge } from '@/components/ui';
import { STATUS_META } from '@/lib/reservationStatus';
import type { ReservationStatus } from '@/types/reservation';

interface ReservationStatusBadgeProps {
  status: ReservationStatus;
  size?: 'sm' | 'md';
}

export function ReservationStatusBadge({ status, size = 'md' }: ReservationStatusBadgeProps) {
  const meta = STATUS_META[status];
  // Map reservation status to available Badge tones
  const tonemap: Record<ReservationStatus, 'pending' | 'processing' | 'completed' | 'cancelled'> = {
    pending: 'pending',
    confirmed: 'processing',
    seated: 'processing',
    completed: 'completed',
    cancelled: 'cancelled',
    no_show: 'cancelled',
  };
  return (
    <Badge tone={tonemap[status]} size={size}>
      {meta.label}
    </Badge>
  );
}
