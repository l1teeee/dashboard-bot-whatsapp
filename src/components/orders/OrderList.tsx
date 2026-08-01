import { AnimatePresence, motion } from 'framer-motion';
import { SkeletonCard, EmptyState } from '@/components/ui';
import { fadeUp, staggerContainer } from '@/lib/motion';
import { OrderCard } from './OrderCard';
import { OrdersTable } from './OrdersTable';
import type { Order } from '@/types/order';

export function OrderList({ orders, onSelectOrder, isLoading }: { orders: Order[]; onSelectOrder: (id: number) => void; isLoading: boolean }) {
  if (isLoading) return <div className="space-y-3"><SkeletonCard /><SkeletonCard /></div>;
  if (!orders.length) return <EmptyState title="Sin pedidos" description="No hay pedidos que mostrar" />;

  return <>
    <div className="hidden md:block"><OrdersTable orders={orders} onSelectOrder={onSelectOrder} /></div>
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-3 md:hidden">
      <AnimatePresence initial={false} mode="popLayout">
        {orders.map((order) => (
          <motion.div key={order.id} layout variants={fadeUp}>
            <OrderCard order={order} onClick={onSelectOrder} variant="list" />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  </>;
}
