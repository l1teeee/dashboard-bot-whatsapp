import { useState } from 'react';
import { Button, ErrorState } from '@/components/ui';
import { OrderKanban } from '@/components/orders/OrderKanban';
import { OrderDetail } from '@/components/orders/OrderDetail';
import { useOrders } from '@/hooks/useOrders';

export function DashboardPage() {
  const { orders, total, isLoading, isError, error, refetch, isFetching } = useOrders();
  const [selectedId, setSelectedId] = useState<number | null>(null);

  if (isError && orders.length === 0) {
    return (
      <div className="p-4">
        <ErrorState
          message={error?.message || 'Error al cargar los pedidos'}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">Pedidos en curso</h1>
          <p className="text-sm text-ink-soft">Total: {total} pedidos</p>
          <p className="text-sm text-ink-soft pt-1">
            Arrastra una tarjeta a otra columna para cambiar su estado, o usa los botones de la tarjeta.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            onClick={() => refetch()}
            isLoading={isFetching}
          >
            Actualizar
          </Button>
          <p className="text-xs text-ink-soft">Actualizacion automatica cada 15 s</p>
        </div>
      </div>

      <OrderKanban
        orders={orders}
        isLoading={isLoading}
        onSelectOrder={setSelectedId}
      />

      <OrderDetail orderId={selectedId} onClose={() => setSelectedId(null)} />
    </div>
  );
}
