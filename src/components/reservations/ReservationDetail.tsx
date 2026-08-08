import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import {
  Modal,
  Skeleton,
  ErrorState,
  Textarea,
  Button,
  ConfirmDialog,
} from '@/components/ui';
import { ReservationStatusBadge } from './ReservationStatusBadge';
import { useReservation } from '@/hooks/useReservation';
import {
  useUpdateReservationStatus,
  useDeleteReservation,
} from '@/hooks/useReservationMutations';
import { RESERVATION_STATUS_TRANSITIONS, type ReservationStatusUpdate } from '@/types/reservation';
import { STATUS_META } from '@/lib/reservationStatus';
import { formatReservationDateTime, formatPhone } from '@/lib/format';
import { useAuthStore } from '@/store/auth';
import { cn } from '@/lib/cn';

export function ReservationDetail({
  reservationId,
  onClose,
}: {
  reservationId: number | null;
  onClose: () => void;
}) {
  const [lastReservationId, setLastReservationId] = useState<number | null>(reservationId);
  const displayedReservationId = reservationId ?? lastReservationId;
  const isOpen = reservationId !== null;
  const { reservation, isLoading, isError, error, refetch } = useReservation(displayedReservationId);
  const updateStatus = useUpdateReservationStatus();
  const deleteReservation = useDeleteReservation();
  const { account } = useAuthStore();
  const [notes, setNotes] = useState('');
  const [confirmTarget, setConfirmTarget] = useState<ReservationStatusUpdate>('confirmed');
  const [isConfirmOpen, setConfirmOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    if (reservationId === null) {
      setConfirmOpen(false);
      setDeleteOpen(false);
      return;
    }
    setLastReservationId(reservationId);
    setNotes('');
    setConfirmOpen(false);
    setDeleteOpen(false);
  }, [reservationId]);

  const terminal = reservation && RESERVATION_STATUS_TRANSITIONS[reservation.status].length === 0;
  const bg = reservation ? STATUS_META[reservation.status].surface : 'bg-yellow';

  const footer = reservation && !terminal ? (
    <div className="grid min-w-0 gap-2 sm:grid-cols-2">
      {RESERVATION_STATUS_TRANSITIONS[reservation.status].map((target) => (
        <Button
          key={target}
          fullWidth
          variant={
            target === 'cancelled' || target === 'no_show'
              ? 'danger'
              : target === 'completed'
                ? 'success'
                : 'primary'
          }
          onClick={() => {
            setConfirmTarget(target);
            setConfirmOpen(true);
          }}
          isLoading={updateStatus.isPending}
        >
          {STATUS_META[target].actionLabel}
        </Button>
      ))}
    </div>
  ) : undefined;

  const canDelete = account?.role === 'owner';

  return (
    <>
      <Modal
        open={isOpen}
        onClose={onClose}
        title={
          reservation
            ? `Reserva #${reservation.id}`
            : displayedReservationId
              ? `Reserva #${displayedReservationId}`
              : 'Detalle de reserva'
        }
        size="lg"
        footer={footer}
      >
        {isLoading && (
          <div className="space-y-4">
            <Skeleton className="h-12" />
            <Skeleton className="h-40" />
          </div>
        )}
        {isError && (
          <ErrorState
            message={error?.message || 'Error al cargar la reserva'}
            onRetry={() => refetch()}
          />
        )}
        {reservation && (
          <div className="min-w-0 space-y-6">
            <div className={cn('min-w-0 rounded-[22px] border border-ink-dark p-5 text-ink-dark', bg)}>
              <div className="flex min-w-0 flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="kicker opacity-70">Reserva para</p>
                  <p className="font-display mt-2 break-words text-5xl font-bold leading-none">
                    {reservation.party_size} pax
                  </p>
                </div>
                <ReservationStatusBadge status={reservation.status} />
              </div>
              <div className="mt-5 grid gap-3 text-sm font-bold sm:grid-cols-2">
                <div className="min-w-0">
                  <span className="block text-xs opacity-70">Nombre</span>
                  <span className="break-all">{reservation.customer_name}</span>
                </div>
                <div className="min-w-0">
                  <span className="block text-xs opacity-70">Telefono</span>
                  <span className="break-all">
                    {reservation.phone_number ? formatPhone(reservation.phone_number) : 'Sin teléfono'}
                  </span>
                </div>
                <div className="min-w-0">
                  <span className="block text-xs opacity-70">Reservada para</span>
                  <span className="break-words">{formatReservationDateTime(reservation.reserved_at)}</span>
                </div>
                <div className="min-w-0">
                  <span className="block text-xs opacity-70">Fuente</span>
                  <span className="break-all">
                    {reservation.source === 'whatsapp' ? 'WhatsApp' : 'Panel'}
                  </span>
                </div>
              </div>
            </div>

            {reservation.notes && (
              <div className="min-w-0 rounded-2xl border border-ink-dark bg-yellow p-4 text-ink-dark">
                <p className="kicker opacity-70">Notas</p>
                <p className="mt-1 break-words text-sm font-semibold">{reservation.notes}</p>
              </div>
            )}

            <div className="min-w-0">
              <h3 className="font-display text-2xl font-bold uppercase">Historial</h3>
              <div className="mt-3">
                {[...(reservation.logs || [])]
                  .sort(
                    (a, b) =>
                      new Date(a.changed_at).getTime() - new Date(b.changed_at).getTime(),
                  )
                  .map((log, index, logs) => (
                    <div key={log.id} className="relative flex min-w-0 gap-3 pb-5">
                      <div className="relative z-10 mt-1 h-3 w-3 shrink-0 rounded-full border border-ink-dark bg-lilac" />
                      {index < logs.length - 1 && (
                        <span className="absolute left-[5px] top-4 h-full w-px bg-border" />
                      )}
                      <div className="min-w-0">
                        <p className="break-words text-sm font-bold">{log.status_change}</p>
                        <p className="break-words text-xs text-ink-soft">{formatReservationDateTime(log.changed_at)}</p>
                        {log.notes && (
                          <p className="mt-1 break-words text-xs text-ink-soft">{log.notes}</p>
                        )}
                      </div>
                    </div>
                  ))}
                {!reservation.logs?.length && (
                  <p className="text-sm text-ink-soft">Sin movimientos registrados.</p>
                )}
              </div>
            </div>

            {terminal ? (
              <p className="rounded-xl bg-surface p-3 text-sm text-ink-soft">
                Esta reserva esta en un estado final.
              </p>
            ) : (
              <div className="border-t border-border pt-5">
                <Textarea
                  label="Notas del cambio (opcional)"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Agrega contexto para el equipo..."
                />
              </div>
            )}

            {canDelete && (
              <Button
                variant="danger"
                fullWidth
                onClick={() => setDeleteOpen(true)}
                isLoading={deleteReservation.isPending}
              >
                <Trash2 className="h-3.5 w-3.5" />
                Eliminar reserva
              </Button>
            )}
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={isConfirmOpen}
        title={`Cambiar a ${STATUS_META[confirmTarget].label}`}
        description={`Cambiar el estado de la reserva #${displayedReservationId ?? ''}?`}
        confirmLabel={STATUS_META[confirmTarget].actionLabel}
        tone={
          confirmTarget === 'cancelled' || confirmTarget === 'no_show' ? 'danger' : 'default'
        }
        isLoading={updateStatus.isPending}
        onConfirm={() => {
          if (displayedReservationId === null) return;
          updateStatus.mutate({
            id: displayedReservationId,
            status: confirmTarget,
            notes: notes || undefined,
          });
          setNotes('');
          setConfirmOpen(false);
        }}
        onCancel={() => setConfirmOpen(false)}
      />

      <ConfirmDialog
        open={isDeleteOpen}
        title="Eliminar reserva"
        description={`Eliminar la reserva #${displayedReservationId ?? ''}? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        tone="danger"
        isLoading={deleteReservation.isPending}
        onConfirm={() => {
          if (displayedReservationId === null) return;
          deleteReservation.mutate(displayedReservationId);
          setDeleteOpen(false);
          onClose();
        }}
        onCancel={() => setDeleteOpen(false)}
      />
    </>
  );
}
