import { useState } from 'react';
import { Modal, Skeleton, ErrorState, Textarea, Button, ConfirmDialog } from '@/components/ui';
import { StatusBadge } from './StatusBadge';
import { useOrder } from '@/hooks/useOrder';
import { useUpdateOrderStatus } from '@/hooks/useUpdateOrderStatus';
import { ORDER_STATUS_TRANSITIONS } from '@/types/order';
import { STATUS_META } from '@/lib/orderStatus';
import { formatCurrency, formatDateTime, formatPhone } from '@/lib/format';
import type { OrderStatusUpdate } from '@/types/order';

interface OrderDetailProps {
  orderId: number | null;
  onClose: () => void;
}

export function OrderDetail({ orderId, onClose }: OrderDetailProps) {
  const { order, isLoading, isError, error, refetch } = useOrder(orderId);
  const updateMutation = useUpdateOrderStatus();
  const [notes, setNotes] = useState('');
  const [confirmOpen, setConfirmOpen] = useState<OrderStatusUpdate | null>(null);

  if (!orderId) return null;

  const isTerminal = order && ORDER_STATUS_TRANSITIONS[order.status].length === 0;

  const handleStatusChange = (target: OrderStatusUpdate) => {
    updateMutation.mutate({
      id: orderId,
      status: target,
      notes: notes || undefined,
    });
    setNotes('');
    setConfirmOpen(null);
  };

  return (
    <Modal
      open={orderId !== null}
      onClose={onClose}
      title={order ? `Pedido #${order.id}` : 'Cargando...'}
      size="lg"
    >
      {isLoading && (
        <div className="space-y-4">
          <Skeleton className="h-8" />
          <Skeleton className="h-32" />
          <Skeleton className="h-20" />
        </div>
      )}

      {isError && <ErrorState message={error?.message || 'Error al cargar el pedido'} onRetry={() => refetch()} />}

      {order && (
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-sm text-ink-soft">Telefono</p>
              <p className="font-semibold text-ink">{formatPhone(order.phone_number)}</p>
            </div>
            <div>
              <p className="text-sm text-ink-soft">Fecha</p>
              <p className="font-semibold text-ink">{formatDateTime(order.created_at)}</p>
            </div>
            <StatusBadge status={order.status} />
          </div>

          <div>
            <h4 className="font-semibold text-ink mb-3">Items</h4>
            <div className="space-y-2 mb-3">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="text-ink">{item.name}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-ink-soft">x{item.quantity}</span>
                    <span className="text-ink">{formatCurrency(item.unit_price)}</span>
                    <span className="font-semibold text-ink">{formatCurrency(item.quantity * item.unit_price)}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-end gap-4 pt-3 border-t border-border font-semibold text-ink">
              <span>Total</span>
              <span>{formatCurrency(order.total)}</span>
            </div>
          </div>

          {order.notes && (
            <div>
              <h4 className="font-semibold text-ink mb-2">Notas del pedido</h4>
              <p className="text-sm text-ink-soft">{order.notes}</p>
            </div>
          )}

          {order.logs && order.logs.length > 0 && (
            <div>
              <h4 className="font-semibold text-ink mb-3">Historial</h4>
              <div className="space-y-3">
                {order.logs
                  .sort((a, b) => new Date(a.changed_at).getTime() - new Date(b.changed_at).getTime())
                  .map((log) => (
                    <div key={log.id} className="flex gap-3">
                      <div className="w-2 h-2 rounded-full bg-brand mt-2 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-ink">{log.status_change}</p>
                        <p className="text-xs text-ink-soft">{formatDateTime(log.changed_at)}</p>
                        {log.notes && <p className="text-sm text-ink-soft mt-1">{log.notes}</p>}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {isTerminal ? (
            <div className="text-sm text-ink-soft italic">Este pedido esta en un estado final.</div>
          ) : (
            <div className="space-y-3 pt-3 border-t border-border">
              <Textarea
                label="Notas del cambio (opcional)"
                placeholder="Agregar notas sobre este cambio de estado..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
              <div className="flex gap-2">
                {ORDER_STATUS_TRANSITIONS[order.status].map((target) => (
                  <Button
                    key={target}
                    variant={target === 'cancelled' ? 'danger' : target === 'completed' ? 'success' : 'primary'}
                    fullWidth
                    isLoading={updateMutation.isPending}
                    onClick={() => setConfirmOpen(target)}
                  >
                    {STATUS_META[target].actionLabel}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {confirmOpen && (
        <ConfirmDialog
          open={true}
          title={`Cambiar a ${STATUS_META[confirmOpen].label}`}
          description={`Cambiar el estado del pedido #${orderId}?`}
          confirmLabel={STATUS_META[confirmOpen].actionLabel}
          tone={confirmOpen === 'cancelled' ? 'danger' : 'default'}
          isLoading={updateMutation.isPending}
          onConfirm={() => handleStatusChange(confirmOpen)}
          onCancel={() => setConfirmOpen(null)}
        />
      )}
    </Modal>
  );
}
