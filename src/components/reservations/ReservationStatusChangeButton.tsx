import { useState } from 'react';
import { Button, ConfirmDialog } from '@/components/ui';
import { STATUS_META } from '@/lib/reservationStatus';
import { useUpdateReservationStatus } from '@/hooks/useReservationMutations';
import type { ReservationStatusUpdate } from '@/types/reservation';

interface ReservationStatusChangeButtonProps {
  reservationId: number;
  target: ReservationStatusUpdate;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export function ReservationStatusChangeButton({
  reservationId,
  target,
  size = 'md',
  fullWidth,
}: ReservationStatusChangeButtonProps) {
  const [open, setOpen] = useState(false);
  const mutation = useUpdateReservationStatus();

  const targetMeta = STATUS_META[target];

  const variantMap: Record<ReservationStatusUpdate, 'primary' | 'success' | 'danger'> = {
    confirmed: 'primary',
    seated: 'primary',
    completed: 'success',
    cancelled: 'danger',
    no_show: 'danger',
  };

  const handleConfirm = () => {
    mutation.mutate({ id: reservationId, status: target });
    setOpen(false);
  };

  return (
    <>
      <Button
        variant={variantMap[target]}
        size={size}
        fullWidth={fullWidth}
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
      >
        {targetMeta.actionLabel}
      </Button>
      <ConfirmDialog
        open={open}
        title={`Cambiar estado de reserva #${reservationId}`}
        description={`Cambiar a ${targetMeta.label}?`}
        confirmLabel={targetMeta.actionLabel}
        tone={target === 'cancelled' || target === 'no_show' ? 'danger' : 'default'}
        isLoading={mutation.isPending}
        onConfirm={handleConfirm}
        onCancel={() => setOpen(false)}
      />
    </>
  );
}
