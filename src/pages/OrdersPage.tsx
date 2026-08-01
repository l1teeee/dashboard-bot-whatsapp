import { useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button, EmptyState, ErrorState, PageHeader } from '@/components/ui';
import { OrderFilters, type FilterState } from '@/components/orders/OrderFilters';
import { OrderList } from '@/components/orders/OrderList';
import { OrderDetail } from '@/components/orders/OrderDetail';
import { filterOrders } from '@/components/orders/filterOrders';
import { useOrders } from '@/hooks/useOrders';

const initial: FilterState = { status: 'all', phone: '', from: '', to: '' };

export function OrdersPage() {
  const { orders, total, isLoading, isError, error, refetch } = useOrders();
  const [params, setParams] = useSearchParams();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [filters, setFilters] = useState<FilterState>(initial);

  useEffect(() => {
    const value = params.get('order');
    setSelectedId(value && /^\d+$/.test(value) ? Number(value) : null);
  }, [params]);

  const selectOrder = (id: number) => {
    const next = new URLSearchParams(params);
    next.set('order', String(id));
    setParams(next, { replace: true });
  };
  const closeOrder = () => {
    const next = new URLSearchParams(params);
    next.delete('order');
    setParams(next, { replace: true });
  };
  const filtered = useMemo(() => filterOrders(orders, filters), [orders, filters]);

  if (isError && !orders.length) return <><ErrorState message={error?.message || 'Error al cargar los pedidos'} onRetry={() => refetch()} /><OrderDetail orderId={selectedId} onClose={closeOrder} /></>;
  return <div className="space-y-6"><PageHeader kicker="Registro" title="Todos los pedidos" description={`Mostrando ${filtered.length} de ${orders.length} cargados · ${total} totales`}/><OrderFilters value={filters} onChange={setFilters} onReset={() => setFilters(initial)}/>{!isLoading && !filtered.length ? <EmptyState title="Sin pedidos" description="No hay pedidos que coincidan con los filtros" action={<Button variant="secondary" onClick={() => setFilters(initial)}>Limpiar filtros</Button>}/> : <OrderList orders={filtered} onSelectOrder={selectOrder} isLoading={isLoading}/>}<OrderDetail orderId={selectedId} onClose={closeOrder}/></div>;
}
