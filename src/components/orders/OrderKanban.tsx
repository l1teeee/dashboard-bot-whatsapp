import { useState } from 'react';
import { KanbanBoard } from '@/components/ui';
import { OrderCard } from './OrderCard';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useMoveOrderStatus } from '@/hooks/useMoveOrderStatus';
import { useReorderOrder } from '@/hooks/useReorderOrder';
import { useDeleteOrder } from '@/hooks/useDeleteOrder';
import { STATUS_ORDER, STATUS_META } from '@/lib/orderStatus';
import { ORDER_STATUS_TRANSITIONS } from '@/types/order';
import { EmptyState, SkeletonCard } from '@/components/ui';
import type { Order, OrderStatusUpdate } from '@/types/order';

interface OrderKanbanProps {
  orders: Order[];
  isLoading: boolean;
  onSelectOrder: (id: number) => void;
}

interface PendingMove {
  order: Order;
  target: OrderStatusUpdate;
}

export function OrderKanban({ orders, isLoading, onSelectOrder }: OrderKanbanProps) {
  const { mutate: moveStatus } = useMoveOrderStatus();
  const { mutate: reorder } = useReorderOrder();
  const { mutate: deleteOrder } = useDeleteOrder();
  const [pendingMove, setPendingMove] = useState<PendingMove | null>(null);

  const columns = STATUS_ORDER.map((status) => ({
    id: status,
    title: STATUS_META[status].label,
    accentClass: STATUS_META[status].column,
    dotClass: STATUS_META[status].dot,
  }));

  const handleDrop = (order: Order, columnId: string) => {
    const target = columnId as OrderStatusUpdate;

    if (target === 'cancelled') {
      setPendingMove({ order, target });
      return;
    }

    moveStatus({ id: order.id, status: target });
  };

  const handleReorder = (order: Order, _columnId: string, toIndex: number) => {
    reorder({ id: order.id, position: toIndex, status: order.status });
  };

  const handleDeleteDrop = (order: Order) => {
    deleteOrder({ id: order.id });
  };

  const handleConfirmCancel = () => {
    if (pendingMove) {
      moveStatus({ id: pendingMove.order.id, status: pendingMove.target });
    }
    setPendingMove(null);
  };

  return (
    <>
      <KanbanBoard<Order>
        columns={columns}
        items={orders}
        getItemId={(o) => String(o.id)}
        getItemColumn={(o) => o.status}
        renderItem={(order) => (
          <OrderCard order={order} onClick={onSelectOrder} />
        )}
        isDraggable={(o) => ORDER_STATUS_TRANSITIONS[o.status].length > 0}
        canDrop={(o, columnId) =>
          (ORDER_STATUS_TRANSITIONS[o.status] as string[]).includes(columnId)
        }
        onDrop={handleDrop}
        onReorder={handleReorder}
        onDeleteDrop={handleDeleteDrop}
        renderEmpty={() => <EmptyState title="Sin pedidos" />}
        renderSkeleton={() => <SkeletonCard />}
        isLoading={isLoading}
        deleteZoneLabel="Soltar aqui para archivar el pedido"
      />

      <ConfirmDialog
        open={pendingMove !== null}
        title="Cancelar pedido"
        description={`El pedido #${pendingMove?.order.id} sera cancelado. Esta accion no se puede deshacer.`}
        confirmLabel="Cancelar pedido"
        tone="danger"
        onConfirm={handleConfirmCancel}
        onCancel={() => setPendingMove(null)}
      />
    </>
  );
}
