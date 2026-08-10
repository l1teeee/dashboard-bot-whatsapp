import { ArrowUpRight } from 'lucide-react';
import { StatusBadge } from '@/components/orders/StatusBadge';
import { formatCurrency, formatPhone } from '@/lib/format';
import { formatOrderNumber } from '@/components/orders/orderNumber';
import type { Order } from '@/types/order';

export function RecentOrdersCard({ orders, onSelect }: { orders: Order[]; onSelect: (id: number) => void }) {
  return (
    <section className="flex h-full min-h-0 flex-col overflow-hidden rounded-[30px] border border-border bg-surface p-5 neo-shadow">
      <div className="flex shrink-0 items-start justify-between">
        <div>
          <p className="kicker text-ink-soft">Actividad</p>
          <h2 className="font-display mt-1 text-3xl font-bold uppercase">Recientes</h2>
        </div>
        <span className="rounded-full bg-surface-raised px-3 py-1 text-xs font-bold text-ink-soft">{orders.length} pedidos</span>
      </div>
      <div className="scrollbar-subtle mt-4 min-h-0 flex-1 divide-y divide-border overflow-y-auto">
        {orders.length ? orders.map((order) => (
          <button key={order.id} onClick={() => onSelect(order.id)} className="focus-ring flex w-full items-center gap-2 py-3 text-left">
            <span className="font-display text-xl font-bold">{formatOrderNumber(order)}</span>
            <span className="min-w-0 flex-1 truncate text-xs text-ink-soft">{formatPhone(order.phone_number)}</span>
            <StatusBadge status={order.status} size="sm" />
            <span className="hidden text-sm font-bold sm:inline">{formatCurrency(order.total)}</span>
            <ArrowUpRight className="h-4 w-4 text-ink-soft" />
          </button>
        )) : <p className="py-8 text-center text-sm text-ink-soft">Aún no hay pedidos cargados.</p>}
      </div>
    </section>
  );
}
