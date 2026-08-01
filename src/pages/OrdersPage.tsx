import { useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button, EmptyState, ErrorState } from '@/components/ui';
import { OrderFilters, type FilterState } from '@/components/orders/OrderFilters';
import { OrderList } from '@/components/orders/OrderList';
import { OrderDetail } from '@/components/orders/OrderDetail';
import { useOrders } from '@/hooks/useOrders';

export function OrdersPage() {
  const { orders, isLoading, isError, error, refetch } = useOrders();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    status: 'all',
    phone: '',
    from: '',
    to: '',
  });

  useEffect(() => {
    const orderId = searchParams.get('order');
    if (orderId && /^\d+$/.test(orderId)) {
      setSelectedId(Number(orderId));
    }
  }, [searchParams]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      if (filters.status !== 'all' && order.status !== filters.status) {
        return false;
      }
      if (filters.phone && !order.phone_number.toLowerCase().includes(filters.phone.toLowerCase())) {
        return false;
      }
      if (filters.from) {
        const orderDate = new Date(order.created_at);
        const fromDate = new Date(filters.from);
        if (orderDate < fromDate) {
          return false;
        }
      }
      if (filters.to) {
        const orderDate = new Date(order.created_at);
        const toDate = new Date(filters.to);
        toDate.setHours(23, 59, 59, 999);
        if (orderDate > toDate) {
          return false;
        }
      }
      return true;
    });
  }, [orders, filters]);

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
      <h1 className="text-2xl font-bold text-ink">Todos los pedidos</h1>

      <OrderFilters
        value={filters}
        onChange={setFilters}
        onReset={() => setFilters({ status: 'all', phone: '', from: '', to: '' })}
      />

      <div className="text-sm text-ink-soft">
        Mostrando {filteredOrders.length} de {orders.length} pedidos
      </div>

      {filteredOrders.length === 0 && !isLoading ? (
        <EmptyState
          title="Sin pedidos"
          description="No hay pedidos que coincidan con los filtros"
          action={
            <Button
              variant="secondary"
              onClick={() => setFilters({ status: 'all', phone: '', from: '', to: '' })}
            >
              Limpiar filtros
            </Button>
          }
        />
      ) : (
        <OrderList
          orders={filteredOrders}
          onSelectOrder={setSelectedId}
          isLoading={isLoading}
        />
      )}

      <OrderDetail
        orderId={selectedId}
        onClose={() => {
          setSelectedId(null);
          setSearchParams({}, { replace: true });
        }}
      />
    </div>
  );
}
