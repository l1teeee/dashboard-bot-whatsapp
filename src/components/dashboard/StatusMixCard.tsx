import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
import { STATUS_META } from '@/lib/orderStatus';
import type { OrderStatus } from '@/types/order';

const colors: Record<OrderStatus, string> = {
  pending: 'var(--color-pending)',
  processing: 'var(--color-processing)',
  completed: 'var(--color-completed)',
  cancelled: 'var(--color-cancelled)',
};

export function StatusMixCard({ counts, rate }: { counts: Record<OrderStatus, number>; rate: number }) {
  const data = (Object.keys(counts) as OrderStatus[]).map((status) => ({
    name: STATUS_META[status].label,
    value: counts[status],
    status,
  }));

  return (
    <section className="flex h-full flex-col rounded-[30px] border border-ink-dark bg-mint p-5 text-ink-dark neo-shadow">
      <p className="kicker">Estados del lote</p>
      <div className="mt-1 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-2">
        <h2 className="font-display text-2xl font-bold uppercase">Mezcla actual</h2>
        <span className="max-w-20 text-right text-[10px] font-bold uppercase leading-tight">
          Éxito entre cerrados<br />{Math.round(rate * 100)}%
        </span>
      </div>
      <div className="mt-2 min-h-32 flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius="42%"
              outerRadius="70%"
              paddingAngle={3}
              isAnimationActive={false}
            >
              {data.map((item) => <Cell key={item.status} fill={colors[item.status]} />)}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="grid grid-cols-2 gap-2">
        {data.map((item) => (
          <li key={item.status} className="flex items-center gap-2 text-xs font-bold">
            <span
              className="h-2.5 w-2.5 rounded-full border border-ink-dark"
              style={{ backgroundColor: colors[item.status] }}
            />
            {item.name} <span className="ml-auto">{item.value}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
