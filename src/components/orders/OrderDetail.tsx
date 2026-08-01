import { useEffect, useState } from 'react';
import { Modal, Skeleton, ErrorState, Textarea, Button, ConfirmDialog } from '@/components/ui';
import { StatusBadge } from './StatusBadge';
import { useOrder } from '@/hooks/useOrder';
import { useUpdateOrderStatus } from '@/hooks/useUpdateOrderStatus';
import { ORDER_STATUS_TRANSITIONS, type OrderStatusUpdate } from '@/types/order';
import { STATUS_META } from '@/lib/orderStatus';
import { formatCurrency, formatDateTime, formatPhone } from '@/lib/format';
import { cn } from '@/lib/cn';

export function OrderDetail({ orderId, onClose }: { orderId: number | null; onClose: () => void }) {
  // Radix needs this component to stay mounted after `open` becomes false so it
  // can play its exit animation. Keep the last id/query alive for that frame.
  const [lastOrderId, setLastOrderId] = useState<number | null>(orderId);
  const displayedOrderId = orderId ?? lastOrderId;
  const isOpen = orderId !== null;
  const { order, isLoading, isError, error, refetch } = useOrder(displayedOrderId);
  const update = useUpdateOrderStatus();
  const [notes, setNotes] = useState('');
  const [confirmTarget, setConfirmTarget] = useState<OrderStatusUpdate>('processing');
  const [isConfirmOpen, setConfirmOpen] = useState(false);
  useEffect(() => {
    if (orderId === null) {
      setConfirmOpen(false);
      return;
    }
    setLastOrderId(orderId);
    setNotes('');
    setConfirmOpen(false);
  }, [orderId]);
  const terminal = order && ORDER_STATUS_TRANSITIONS[order.status].length === 0;
  const bg = order?.status === 'pending' ? 'bg-yellow' : order?.status === 'processing' ? 'bg-lilac' : order?.status === 'completed' ? 'bg-mint' : 'bg-coral';
  const footer = order && !terminal ? (
    <div className="grid min-w-0 gap-2 sm:grid-cols-2">
      {ORDER_STATUS_TRANSITIONS[order.status].map((target) => (
        <Button key={target} fullWidth variant={target === 'cancelled' ? 'danger' : target === 'completed' ? 'success' : 'primary'} onClick={() => { setConfirmTarget(target); setConfirmOpen(true); }} isLoading={update.isPending}>
          {STATUS_META[target].actionLabel}
        </Button>
      ))}
    </div>
  ) : undefined;

  return <Modal open={isOpen} onClose={onClose} title={order ? `Pedido #${order.id}` : displayedOrderId ? `Pedido #${displayedOrderId}` : 'Detalle de pedido'} size="lg" footer={footer}>
    {isLoading && <div className="space-y-4"><Skeleton className="h-12" /><Skeleton className="h-40" /></div>}
    {isError && <ErrorState message={error?.message || 'Error al cargar el pedido'} onRetry={() => refetch()} />}
    {order && <div className="min-w-0 space-y-6">
      <div className={cn('min-w-0 rounded-[22px] border border-ink-dark p-5 text-ink-dark', bg)}>
        <div className="flex min-w-0 flex-wrap items-start justify-between gap-4"><div className="min-w-0"><p className="kicker opacity-70">Total del pedido</p><p className="font-display mt-2 break-words text-5xl font-bold leading-none">{formatCurrency(order.total)}</p></div><StatusBadge status={order.status} /></div>
        <div className="mt-5 grid gap-3 text-sm font-bold sm:grid-cols-2"><div className="min-w-0"><span className="block text-xs opacity-70">Teléfono</span><span className="break-all">{formatPhone(order.phone_number)}</span></div><div className="min-w-0"><span className="block text-xs opacity-70">Creado</span><span className="break-words">{formatDateTime(order.created_at)}</span></div></div>
      </div>
      <div className="grid min-w-0 gap-6 md:grid-cols-[minmax(0,1.1fr)_minmax(0,.9fr)]">
        <div className="min-w-0"><h3 className="font-display text-2xl font-bold uppercase">Items</h3><div className="mt-3 space-y-2">{order.items.map((item, i) => <div key={i} className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-border bg-surface p-3"><div className="min-w-0"><p className="break-words text-sm font-bold">{item.name}</p><p className="text-xs text-ink-soft">{item.quantity} × {formatCurrency(item.unit_price)}</p></div><p className="whitespace-nowrap font-bold">{formatCurrency(item.quantity * item.unit_price)}</p></div>)}</div>{order.notes && <div className="mt-4 min-w-0 rounded-2xl border border-ink-dark bg-yellow p-4 text-ink-dark"><p className="kicker opacity-70">Notas</p><p className="mt-1 break-words text-sm font-semibold">{order.notes}</p></div>}</div>
        <div className="min-w-0"><h3 className="font-display text-2xl font-bold uppercase">Historial</h3><div className="mt-3">{[...(order.logs || [])].sort((a, b) => new Date(a.changed_at).getTime() - new Date(b.changed_at).getTime()).map((log, index, logs) => <div key={log.id} className="relative flex min-w-0 gap-3 pb-5"><div className="relative z-10 mt-1 h-3 w-3 shrink-0 rounded-full border border-ink-dark bg-lilac" />{index < logs.length - 1 && <span className="absolute left-[5px] top-4 h-full w-px bg-border" />}<div className="min-w-0"><p className="break-words text-sm font-bold">{log.status_change}</p><p className="break-words text-xs text-ink-soft">{formatDateTime(log.changed_at)}</p>{log.notes && <p className="mt-1 break-words text-xs text-ink-soft">{log.notes}</p>}</div></div>)}{!order.logs?.length && <p className="text-sm text-ink-soft">Sin movimientos registrados.</p>}</div></div>
      </div>
      {terminal ? <p className="rounded-xl bg-surface p-3 text-sm text-ink-soft">Este pedido está en un estado final.</p> : <div className="border-t border-border pt-5"><Textarea label="Notas del cambio (opcional)" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Agrega contexto para el equipo..." /></div>}
    </div>}
    <ConfirmDialog open={isConfirmOpen} title={`Cambiar a ${STATUS_META[confirmTarget].label}`} description={`Cambiar el estado del pedido #${displayedOrderId ?? ''}?`} confirmLabel={STATUS_META[confirmTarget].actionLabel} tone={confirmTarget === 'cancelled' ? 'danger' : 'default'} isLoading={update.isPending} onConfirm={() => { if (displayedOrderId === null) return; update.mutate({ id: displayedOrderId, status: confirmTarget, notes: notes || undefined }); setNotes(''); setConfirmOpen(false); }} onCancel={() => setConfirmOpen(false)} />
  </Modal>;
}
