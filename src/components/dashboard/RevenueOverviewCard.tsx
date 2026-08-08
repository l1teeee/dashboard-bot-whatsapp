import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { MetricCard } from '@/components/ui';
import { formatCurrency } from '@/lib/format';
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

export function RevenueOverviewCard({
  revenue,
  averageTicket,
  data,
}: {
  revenue: number;
  averageTicket: number;
  data: DailyMetric[];
}) {
  const axisMaximum = getSafeAxisMaximum(data.map((day) => day.revenue));

  return (
    <section className="relative flex h-full flex-col overflow-hidden rounded-[30px] border border-ink-dark bg-cyan p-5 text-ink-dark neo-shadow sm:p-6">
      <div className="pattern-diagonal pointer-events-none absolute inset-0 opacity-40" />
      <div className="relative flex min-h-0 flex-1 flex-col">
        <p className="kicker">Ingresos completados</p>
        <div className="mt-2 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-display text-5xl font-bold leading-none sm:text-6xl">{formatCurrency(revenue)}</p>
            <p className="mt-2 max-w-xs text-xs font-semibold">Basado en el lote cargado de hasta 100 pedidos</p>
          </div>
          <MetricCard className="min-w-44 bg-yellow" label="Ticket promedio" value={formatCurrency(averageTicket)} />
        </div>
        <div className="mt-5 min-h-44 flex-1" aria-label="Ingresos completados por día">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'var(--color-ink-dark)', fontSize: 11, fontWeight: 800 }}
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
                formatter={(value) => [formatCurrency(Number(value)), 'Ingresos']}
              />
              <Bar
                dataKey="revenue"
                name="Ingresos"
                fill="var(--color-warm)"
                radius={[8, 8, 3, 3]}
                maxBarSize={34}
                isAnimationActive={false}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <ul className="sr-only">
          {data.map((day) => (
            <li key={day.key}>
              {day.label}: {formatCurrency(day.revenue)}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
