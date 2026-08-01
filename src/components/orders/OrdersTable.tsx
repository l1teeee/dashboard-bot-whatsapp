import { ArrowUpRight } from 'lucide-react';
import { IconButton } from '@/components/ui';
import { formatCurrency, formatDateTime, formatPhone } from '@/lib/format';
import { StatusBadge } from './StatusBadge';
import type { Order } from '@/types/order';

export function OrdersTable({ orders, onSelectOrder }: { orders: Order[]; onSelectOrder: (id: number) => void }) {
  return <div className="overflow-x-auto rounded-[28px] border border-border bg-surface-raised scrollbar-subtle">
    <table className="w-full min-w-[760px] border-collapse text-left">
      <caption className="sr-only">Pedidos cargados</caption>
      <thead className="border-b border-border bg-surface"><tr className="text-xs font-extrabold uppercase tracking-wider text-ink-soft">
        <th scope="col" className="px-5 py-4">Pedido</th><th scope="col" className="px-5 py-4">Estado</th><th scope="col" className="px-5 py-4">Cliente y detalle</th><th scope="col" className="px-5 py-4">Fecha</th><th scope="col" className="px-5 py-4 text-right">Total</th><th scope="col" className="w-16 px-3 py-4"><span className="sr-only">Acción</span></th>
      </tr></thead>
      <tbody>{orders.map((order) => {
        const items = order.items.slice(0, 3).map((item) => `${item.quantity}× ${item.name}`).join(' · ');
        return <tr key={order.id} tabIndex={0} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onSelectOrder(order.id); } }} className="group border-b border-border/80 last:border-0 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-[-3px] focus-visible:outline-yellow hover:bg-surface transition-colors">
          <th scope="row" className="whitespace-nowrap px-5 py-4 font-display text-3xl font-bold">#{order.id}</th><td className="px-5 py-4 align-middle"><StatusBadge status={order.status} size="sm" /></td><td className="min-w-0 px-5 py-4"><p className="max-w-[18rem] truncate font-bold">{formatPhone(order.phone_number)}</p><p className="mt-1 max-w-[22rem] truncate text-xs text-ink-soft">{items || 'Sin artículos'}</p></td><td className="whitespace-nowrap px-5 py-4 text-xs text-ink-soft">{formatDateTime(order.created_at)}</td><td className="whitespace-nowrap px-5 py-4 text-right font-display text-2xl font-bold">{formatCurrency(order.total)}</td><td className="px-3 py-4"><IconButton aria-label={`Ver detalle del pedido ${order.id}`} onClick={() => onSelectOrder(order.id)}><ArrowUpRight className="h-4 w-4" /></IconButton></td>
        </tr>;
      })}</tbody>
    </table>
  </div>;
}
