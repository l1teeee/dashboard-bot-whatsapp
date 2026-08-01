import { Card, CardHeader, CardBody, SkeletonCard, EmptyState } from '@/components/ui';
import { OrderCard } from './OrderCard';
import { STATUS_META } from '@/lib/orderStatus';
import { cn } from '@/lib/cn';
import type { OrderStatus, Order } from '@/types/order';

interface KanbanColumnProps {
  status: OrderStatus;
  orders: Order[];
  onSelectOrder: (id: number) => void;
  isLoading: boolean;
}

export function KanbanColumn({ status, orders, onSelectOrder, isLoading }: KanbanColumnProps) {
  const meta = STATUS_META[status];

  return (
    <div className="flex flex-col h-full min-h-96">
      <Card className={cn('sticky top-0 z-10', meta.column)}>
        <CardHeader className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={cn('w-3 h-3 rounded-full', meta.dot)} />
            <span className="font-medium text-ink">{meta.label}</span>
          </div>
          <span className="inline-flex items-center justify-center min-w-6 h-6 rounded-full bg-border text-xs font-semibold text-ink">
            {orders.length}
          </span>
        </CardHeader>
      </Card>

      <CardBody className="flex-1 overflow-y-auto space-y-3 mt-3">
        {isLoading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : orders.length === 0 ? (
          <EmptyState title="Sin pedidos" />
        ) : (
          orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onClick={onSelectOrder}
            />
          ))
        )}
      </CardBody>
    </div>
  );
}
