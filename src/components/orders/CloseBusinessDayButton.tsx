import { useState } from 'react';
import { Button, ConfirmDialog, Badge } from '@/components/ui';
import { useAuthStore } from '@/store/auth';
import { useBusinessDay } from '@/hooks/useBusinessDay';
import { useCloseBusinessDay } from '@/hooks/useCloseBusinessDay';

export function CloseBusinessDayButton() {
  const account = useAuthStore((state) => state.account);
  const [isConfirmOpen, setConfirmOpen] = useState(false);
  const { businessDay } = useBusinessDay();
  const close = useCloseBusinessDay();

  if (account?.role !== 'owner') return null;

  const isClosed = Boolean(businessDay?.closed_at);

  return (
    <>
      <div className="flex items-center gap-2">
        {businessDay && (
          <Badge tone={isClosed ? 'cancelled' : 'completed'} size="sm">
            {isClosed ? 'Jornada cerrada' : `${businessDay.order_count} pedidos hoy`}
          </Badge>
        )}
        <Button variant="secondary" size="sm" onClick={() => setConfirmOpen(true)} isLoading={close.isPending}>
          Cerrar día
        </Button>
      </div>
      <ConfirmDialog
        open={isConfirmOpen}
        title="Cerrar la jornada"
        description="Se va a cerrar el dia actual. Los pedidos que lleguen despues van a empezar a numerarse de nuevo desde el 1. Ningun pedido se borra ni se oculta, todos siguen visibles en el historial."
        confirmLabel="Cerrar día"
        isLoading={close.isPending}
        onConfirm={() => { close.mutate(); setConfirmOpen(false); }}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}
