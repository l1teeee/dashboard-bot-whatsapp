import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { DailyMetric } from '@/lib/dashboardMetrics';

const tooltipContentStyle = {
  background: 'var(--color-shell)',
  color: 'var(--color-ink)',
  border: '1px solid var(--color-border)',
  borderRadius: 14,
};

const tooltipWrapperStyle = {
  pointerEvents: 'none' as const,
  transition: 'none',
};

function getSafeAxisMaximum(values: number[]) {
  return Math.max(1, ...values.filter((value) => Number.isFinite(value) && value > 0));
}

function formatOrderCount(value: number) {
  return `${value} ${value === 1 ? 'pedido' : 'pedidos'}`;
}

export function OrderFlowCard({ data, active }: { data: DailyMetric[]; active: number }) {
  const axisMaximum = getSafeAxisMaximum(data.map((day) => day.orders));

  return (
    <section className="relative flex h-full flex-col overflow-hidden rounded-[30px] border border-ink-dark bg-lilac p-5 text-ink-dark neo-shadow sm:p-6">
      <div className="pattern-radial pointer-events-none absolute inset-0 opacity-35" />
      <div className="relative flex min-h-0 flex-1 flex-col">
        <div className="flex items-start justify-between">
          <div>
            <p className="kicker">Flujo de pedidos</p>
            <h2 className="font-display mt-1 text-3xl font-bold uppercase">Últimos 7 días</h2>
          </div>
          <div className="rounded-2xl border border-ink-dark bg-warm px-3 py-2 text-center">
            <span className="block font-display text-3xl font-bold leading-none">{active}</span>
            <span className="text-[10px] font-bold uppercase">Activos ahora</span>
          </div>
        </div>
        <div className="mt-5 min-h-40 flex-1" aria-label="Pedidos diarios">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="flow" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0" stopColor="var(--color-yellow)" stopOpacity=".9" />
                  <stop offset="1" stopColor="var(--color-yellow)" stopOpacity=".05" />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'var(--color-ink-dark)', fontSize: 10, fontWeight: 800 }}
              />
              <YAxis hide domain={[0, axisMaximum]} />
              <Tooltip
                cursor={false}
                isAnimationActive={false}
                wrapperStyle={tooltipWrapperStyle}
                contentStyle={tooltipContentStyle}
                itemStyle={{ color: 'var(--color-ink)' }}
                labelStyle={{ color: 'var(--color-ink)', fontWeight: 800 }}
                labelFormatter={(label) => `Día ${String(label)}`}
                formatter={(value) => [formatOrderCount(Number(value)), 'Volumen']}
              />
              <Area
                type="monotone"
                dataKey="orders"
                name="Volumen"
                stroke="var(--color-ink-dark)"
                strokeWidth={2.5}
                fill="url(#flow)"
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <ul className="sr-only">
          {data.map((day) => (
            <li key={day.key}>
              {day.label}: {formatOrderCount(day.orders)}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
