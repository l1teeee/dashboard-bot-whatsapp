import { useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { Button, ErrorState, PageHeader } from '@/components/ui';
import { OrderDetail } from '@/components/orders/OrderDetail';
import { OrderKanban } from '@/components/orders/OrderKanban';
import { useOrders } from '@/hooks/useOrders';
import { cn } from '@/lib/cn';
import { fadeUp, softScale, staggerContainer } from '@/lib/motion';

export function DashboardPage() {
  const { orders, total, isLoading, isError, error, refetch, isFetching } = useOrders();
  const [selectedId, setSelectedId] = useState<number | null>(null);

  return (
    <>
    {isError && !orders.length ? <ErrorState message={error?.message || 'Error al cargar los pedidos'} onRetry={() => refetch()} /> : <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="flex flex-col gap-5 lg:min-h-0 lg:flex-1 lg:overflow-hidden">
      <motion.div variants={fadeUp} className="shrink-0">
        <PageHeader
          kicker="Operación"
          title="Operación en vivo"
          titleClassName="text-[clamp(1.9rem,3vw,2.75rem)]"
          description={<span>{total} pedidos informados por el servidor</span>}
          actions={<Button variant="secondary" onClick={() => refetch()} isLoading={isFetching}><RefreshCw className={cn('h-4 w-4', isFetching && 'animate-spin')} />Actualizar</Button>}
        />
      </motion.div>

      <motion.section variants={softScale} aria-labelledby="live-operations-title" className="flex flex-col rounded-[30px] border border-border bg-surface p-4 neo-shadow sm:p-5 lg:min-h-0 lg:flex-1 lg:overflow-hidden">
        <div className="mb-4 flex shrink-0 flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="kicker text-yellow">Flujo operativo</p>
            <h2 id="live-operations-title" className="font-display mt-1 text-2xl font-bold uppercase">Operación en vivo</h2>
            <p className="mt-2 text-sm text-ink-soft">Arrastra, reordena o utiliza los controles de cada pedido.</p>
          </div>
          <span className="w-fit rounded-full border border-border bg-surface-raised px-3 py-2 text-xs font-bold text-ink-soft">Actualización cada 15 s</span>
        </div>
        <div className="lg:min-h-0 lg:flex-1">
          <OrderKanban orders={orders} isLoading={isLoading} onSelectOrder={setSelectedId} />
        </div>
      </motion.section>
    </motion.div>}
      <OrderDetail orderId={selectedId} onClose={() => setSelectedId(null)} />
    </>
  );
}
