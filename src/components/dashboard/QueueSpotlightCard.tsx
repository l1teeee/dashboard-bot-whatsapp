import { ArrowUpRight, Clock3 } from 'lucide-react';
import { formatCurrency, formatRelativeTime } from '@/lib/format';
import type { Order } from '@/types/order';

export function QueueSpotlightCard({ order, onSelect }: { order?: Order; onSelect: (id: number) => void }) {
  return (
    <button
      onClick={() => order && onSelect(order.id)}
      disabled={!order}
      className="relative h-full min-h-0 overflow-hidden rounded-[30px] border border-ink-dark bg-yellow p-5 text-left text-ink-dark neo-shadow focus-ring disabled:cursor-default"
    >
      <div className="pattern-dots pointer-events-none absolute inset-0 opacity-35" />
      <div className="relative flex h-full min-h-0 flex-col">
        <div className="flex items-center justify-between">
          <p className="kicker">Cola prioritaria</p>
          <Clock3 className="h-5 w-5" />
        </div>
        {order ? (
          <>
            <p className="font-display mt-6 text-5xl font-bold">#{order.id}</p>
            <p className="mt-1 text-sm font-bold">Pendiente {formatRelativeTime(order.created_at)}</p>
            <p className="mt-auto line-clamp-2 text-xs font-semibold">
              {order.items.map((item) => `${item.quantity}× ${item.name}`).join(' · ')}
            </p>
            <div className="mt-3 flex items-center justify-between">
              <span className="font-display text-3xl font-bold">{formatCurrency(order.total)}</span>
              <ArrowUpRight className="h-5 w-5" />
            </div>
          </>
        ) : (
          <div className="my-auto">
            <p className="font-display text-3xl font-bold uppercase">Sin espera pendiente</p>
            <p className="mt-2 text-sm font-semibold">La cola está al día.</p>
          </div>
        )}
      </div>
    </button>
  );
}
