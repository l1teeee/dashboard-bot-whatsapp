import { SkeletonCard, EmptyState } from '@/components/ui';
import { OrderCard } from './OrderCard';
import type { Order } from '@/types/order';

interface OrderListProps {
  orders: Order[];
  onSelectOrder: (id: number) => void;
  isLoading: boolean;
}

export function OrderList({ orders, onSelectOrder, isLoading }: OrderListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <EmptyState
        title="Sin pedidos"
        description="No hay pedidos que mostrar"
      />
    );
  }

  return (
    <div className="space-y-3">
      {orders.map((order) => (
        <OrderCard
          key={order.id}
          order={order}
          onClick={onSelectOrder}
        />
      ))}
    </div>
  );
}
