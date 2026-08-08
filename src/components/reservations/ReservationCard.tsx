import { ArrowUpRight } from 'lucide-react';
import { Card, CardBody, IconButton } from '@/components/ui';
import { ReservationStatusBadge } from './ReservationStatusBadge';
import { ReservationStatusChangeButton } from './ReservationStatusChangeButton';
import { RESERVATION_STATUS_TRANSITIONS } from '@/types/reservation';
import { formatReservationDateTime, formatPhone } from '@/lib/format';
import type { Reservation } from '@/types/reservation';

interface Props {
  reservation: Reservation;
  onClick: (id: number) => void;
  variant?: 'list' | 'compact';
}

export function ReservationCard({
  reservation,
  onClick,
  variant = 'list',
}: Props) {
  const transitions = RESERVATION_STATUS_TRANSITIONS[reservation.status];
  const detailLabel = `Ver detalle de reserva ${reservation.id}`;

  if (variant === 'compact') {
    return (
      <button
        onClick={() => onClick(reservation.id)}
        className="focus-ring flex w-full items-center gap-2 rounded-xl px-2 py-2 text-left hover:bg-surface-raised"
        aria-label={detailLabel}
      >
        <span className="font-display text-xl font-bold">#{reservation.id}</span>
        <span className="min-w-0 flex-1 truncate text-xs text-ink-soft">
          {reservation.customer_name}
        </span>
        <ReservationStatusBadge status={reservation.status} size="sm" />
        <span className="text-sm font-bold">{reservation.party_size} pax</span>
      </button>
    );
  }

  return (
    <Card className="border-border bg-surface-raised">
      <CardBody className="grid gap-3 p-4 md:grid-cols-[100px_1fr_160px_130px_46px] md:items-center">
        <div className="flex items-center gap-2">
          <span className="font-display text-3xl font-bold">#{reservation.id}</span>
          <ReservationStatusBadge status={reservation.status} size="sm" />
        </div>
        <div className="min-w-0">
          <p className="font-bold">{reservation.customer_name}</p>
          <p className="mt-1 truncate text-xs text-ink-soft">
            {reservation.phone_number ? formatPhone(reservation.phone_number) : 'Sin teléfono'}
            {' · '}
            {reservation.party_size} pax
          </p>
        </div>
        <p className="text-xs text-ink-soft">{formatReservationDateTime(reservation.reserved_at)}</p>
        <p className="text-sm font-bold">
          {reservation.source === 'whatsapp' ? 'WhatsApp' : 'Panel'}
        </p>
        <IconButton aria-label={detailLabel} onClick={() => onClick(reservation.id)}>
          <ArrowUpRight className="h-4 w-4" />
        </IconButton>
        <div className="col-span-full grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-2 md:hidden">
          {transitions.map((target) => (
            <ReservationStatusChangeButton
              key={target}
              reservationId={reservation.id}
              target={target}
              size="sm"
              fullWidth
            />
          ))}
        </div>
      </CardBody>
    </Card>
  );
}
