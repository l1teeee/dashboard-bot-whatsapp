import { useState } from 'react';
import { motion } from 'framer-motion';
import { ErrorState, PageHeader, SkeletonCard } from '@/components/ui';
import { DashboardBento } from '@/components/dashboard/DashboardBento';
import { OrderDetail } from '@/components/orders/OrderDetail';
import { useDashboardMetrics } from '@/hooks/useDashboardMetrics';
import { useOrders } from '@/hooks/useOrders';
import { fadeUp, staggerContainer } from '@/lib/motion';

/** Métricas derivadas de la misma consulta de pedidos que usa la operación en vivo. */
export function AnalyticsPage() {
  const { orders, isLoading, isError, error, refetch } = useOrders();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const metrics = useDashboardMetrics(orders);

  return (
    <>
    {isError && !orders.length ? <ErrorState message={error?.message || 'Error al cargar las analíticas'} onRetry={() => refetch()} /> : <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-7">
      <motion.div variants={fadeUp}>
        <PageHeader kicker="Analíticas" title="Resumen operativo" description="Indicadores del lote actual y el desempeño reciente." />
      </motion.div>
      <motion.section variants={fadeUp} aria-label="Indicadores operativos">
        {isLoading ? (
          <div className="grid gap-4 lg:grid-cols-12" aria-busy="true" aria-label="Cargando indicadores">
            <SkeletonCard className="min-h-52 lg:col-span-7" />
            <SkeletonCard className="min-h-52 lg:col-span-5" />
            <SkeletonCard className="min-h-56 lg:col-span-4" />
            <SkeletonCard className="min-h-56 lg:col-span-4" />
            <SkeletonCard className="min-h-56 lg:col-span-4" />
          </div>
        ) : (
          <DashboardBento metrics={metrics} onSelect={setSelectedId} />
        )}
      </motion.section>
    </motion.div>}
      <OrderDetail orderId={selectedId} onClose={() => setSelectedId(null)} />
    </>
  );
}
