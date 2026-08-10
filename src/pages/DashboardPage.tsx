import { useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { Button, ErrorState } from '@/components/ui';
import { OrderDetail } from '@/components/orders/OrderDetail';
import { OrderKanban } from '@/components/orders/OrderKanban';
import { useOrders } from '@/hooks/useOrders';
import { cn } from '@/lib/cn';
import { softScale, staggerContainer } from '@/lib/motion';

export function DashboardPage() {
  const { orders, total, isLoading, isError, error, refetch, isFetching } = useOrders();
  const [selectedId, setSelectedId] = useState<number | null>(null);

  return (
    <>
      {isError && !orders.length ? (
        <ErrorState message={error?.message || 'Error al cargar los pedidos'} onRetry={() => refetch()} />
      ) : (
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="flex flex-col lg:min-h-0 lg:flex-1 lg:overflow-hidden">
          <motion.section variants={softScale} aria-labelledby="operational-flow-title" className="flex flex-col rounded-[30px] border border-border bg-surface p-4 neo-shadow sm:p-5 lg:min-h-0 lg:flex-1 lg:overflow-hidden">
            <div className="mb-4 flex shrink-0 flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="kicker text-yellow">Pedidos en vivo</p>
                <h1 id="operational-flow-title" className="font-display mt-1 text-3xl font-bold uppercase">Flujo operativo</h1>
                <p className="mt-2 text-sm text-ink-soft">Arrastra, reordena o utiliza los controles de cada pedido.</p>
                <p className="mt-1 text-xs font-bold text-brand-soft">{total} pedidos informados por el servidor</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="w-fit rounded-full border border-border bg-surface-raised px-3 py-2 text-xs font-bold text-ink-soft">Actualización cada 15 s</span>
                <Button variant="secondary" onClick={() => refetch()} isLoading={isFetching}>
                  <RefreshCw className={cn('h-4 w-4', isFetching && 'animate-spin')} />
                  Actualizar
                </Button>
              </div>
            </div>
            <div className="lg:min-h-0 lg:flex-1">
              <OrderKanban orders={orders} isLoading={isLoading} onSelectOrder={setSelectedId} />
            </div>
          </motion.section>
        </motion.div>
      )}
      <OrderDetail orderId={selectedId} onClose={() => setSelectedId(null)} />
    </>
  );
}
