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
  const [pendingDelete, setPendingDelete] = useState<Order | null>(null);
  const [isMoveConfirmOpen, setMoveConfirmOpen] = useState(false);
  const [isDeleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

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
      setMoveConfirmOpen(true);
      return;
    }

    moveStatus({ id: order.id, status: target });
  };

  const handleReorder = (order: Order, _columnId: string, toIndex: number) => {
    reorder({ id: order.id, position: toIndex, status: order.status });
  };

  const handleDeleteDrop = (order: Order) => {
    setPendingDelete(order);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmCancel = () => {
    if (pendingMove) {
      moveStatus({ id: pendingMove.order.id, status: pendingMove.target });
    }
    setMoveConfirmOpen(false);
  };

  return (
    <>
      <KanbanBoard<Order>
        className="lg:h-full lg:min-h-0"
        columns={columns}
        items={orders}
        getItemId={(o) => String(o.id)}
        getItemColumn={(o) => o.status}
        getItemPosition={(o) => o.position}
        renderItem={(order) => {
          const columnOrders = orders
            .filter((item) => item.status === order.status)
            .sort((a, b) => a.position - b.position || a.id - b.id);
          const index = columnOrders.findIndex((item) => item.id === order.id);
          return <OrderCard order={order} onClick={onSelectOrder} onDelete={() => handleDeleteDrop(order)} onMoveUp={index > 0 ? () => reorder({ id: order.id, position: index - 1, status: order.status }) : undefined} onMoveDown={index >= 0 && index < columnOrders.length - 1 ? () => reorder({ id: order.id, position: index + 1, status: order.status }) : undefined} />;
        }}
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
        deleteZoneLabel="Eliminar pedido"
      />

      <ConfirmDialog
        open={isMoveConfirmOpen}
        title="Cancelar pedido"
        description={pendingMove ? `El pedido #${pendingMove.order.id} sera cancelado. Esta accion no se puede deshacer.` : 'Confirma la cancelación del pedido.'}
        confirmLabel="Cancelar pedido"
        tone="danger"
        onConfirm={handleConfirmCancel}
        onCancel={() => setMoveConfirmOpen(false)}
      />
      <ConfirmDialog
        open={isDeleteConfirmOpen}
        title="Eliminar pedido"
        description={pendingDelete ? `El pedido #${pendingDelete.id} se eliminara de forma permanente.` : 'Confirma la eliminación del pedido.'}
        confirmLabel="Eliminar pedido"
        tone="danger"
        onConfirm={() => { if (pendingDelete) deleteOrder({ id: pendingDelete.id }); setDeleteConfirmOpen(false); }}
        onCancel={() => setDeleteConfirmOpen(false)}
      />
    </>
  );
}
