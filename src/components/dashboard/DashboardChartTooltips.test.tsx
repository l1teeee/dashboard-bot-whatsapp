import type { ComponentProps, ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Area, Bar, Tooltip, YAxis } from 'recharts';
import { formatCurrency } from '@/lib/format';
import type { DailyMetric } from '@/lib/dashboardMetrics';
import { OrderFlowCard } from './OrderFlowCard';
import { RevenueOverviewCard } from './RevenueOverviewCard';

const rechartsSpies = vi.hoisted(() => ({
  tooltip: vi.fn(),
  yAxis: vi.fn(),
  bar: vi.fn(),
  area: vi.fn(),
}));

vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  BarChart: ({ children }: { children: ReactNode }) => <svg>{children}</svg>,
  AreaChart: ({ children }: { children: ReactNode }) => <svg>{children}</svg>,
  XAxis: () => null,
  YAxis: (props: unknown) => {
    rechartsSpies.yAxis(props);
    return null;
  },
  Tooltip: (props: unknown) => {
    rechartsSpies.tooltip(props);
    return null;
  },
  Bar: (props: unknown) => {
    rechartsSpies.bar(props);
    return null;
  },
  Area: (props: unknown) => {
    rechartsSpies.area(props);
    return null;
  },
}));

const zeroDay: DailyMetric = {
  key: '2026-08-08',
  label: 'SÁB',
  revenue: 0,
  orders: 0,
};

type TooltipComponentProps = ComponentProps<typeof Tooltip>;
type YAxisComponentProps = ComponentProps<typeof YAxis>;
type BarComponentProps = ComponentProps<typeof Bar>;
type AreaComponentProps = ComponentProps<typeof Area>;

describe('tooltips de las gráficas del dashboard', () => {
  beforeEach(() => {
    rechartsSpies.tooltip.mockClear();
    rechartsSpies.yAxis.mockClear();
    rechartsSpies.bar.mockClear();
    rechartsSpies.area.mockClear();
  });

  it('elimina los artefactos sin ocultar ingresos de valor cero', () => {
    render(<RevenueOverviewCard revenue={0} averageTicket={0} data={[zeroDay]} />);

    const tooltipProps = rechartsSpies.tooltip.mock.calls[0][0] as TooltipComponentProps;
    const yAxisProps = rechartsSpies.yAxis.mock.calls[0][0] as YAxisComponentProps;
    const barProps = rechartsSpies.bar.mock.calls[0][0] as BarComponentProps;

    expect(tooltipProps.cursor).toBe(false);
    expect(tooltipProps.isAnimationActive).toBe(false);
    expect(tooltipProps.wrapperStyle).toMatchObject({ pointerEvents: 'none', transition: 'none' });
    expect(tooltipProps.contentStyle).toMatchObject({
      background: 'var(--color-shell)',
      color: 'var(--color-ink)',
      border: '1px solid var(--color-border)',
    });
    expect(tooltipProps.formatter?.(0, 'revenue', {} as never, 0, [])).toEqual([
      formatCurrency(0),
      'Ingresos',
    ]);
    expect(tooltipProps.labelFormatter?.('SÁB', [])).toBe('Día SÁB');
    expect(yAxisProps.domain).toEqual([0, 1]);
    expect(barProps).toMatchObject({ fill: 'var(--color-warm)', isAnimationActive: false });
    expect(screen.getByText('Ingresos completados').closest('section')).toHaveClass('bg-cyan', 'h-full');
    expect(screen.getByLabelText('Ingresos completados por día')).toHaveClass('min-h-0', 'flex-1');
    expect(screen.getByText(`SÁB: ${formatCurrency(0)}`)).toBeInTheDocument();
  });

  it('elimina los artefactos y conserva un tooltip legible para cero pedidos', () => {
    render(<OrderFlowCard active={0} data={[zeroDay]} />);

    const tooltipProps = rechartsSpies.tooltip.mock.calls[0][0] as TooltipComponentProps;
    const yAxisProps = rechartsSpies.yAxis.mock.calls[0][0] as YAxisComponentProps;
    const areaProps = rechartsSpies.area.mock.calls[0][0] as AreaComponentProps;

    expect(tooltipProps.cursor).toBe(false);
    expect(tooltipProps.isAnimationActive).toBe(false);
    expect(tooltipProps.wrapperStyle).toMatchObject({ pointerEvents: 'none', transition: 'none' });
    expect(tooltipProps.contentStyle).toMatchObject({
      background: 'var(--color-shell)',
      color: 'var(--color-ink)',
      border: '1px solid var(--color-border)',
    });
    expect(tooltipProps.formatter?.(0, 'orders', {} as never, 0, [])).toEqual(['0 pedidos', 'Volumen']);
    expect(tooltipProps.labelFormatter?.('SÁB', [])).toBe('Día SÁB');
    expect(yAxisProps.domain).toEqual([0, 1]);
    expect(areaProps).toMatchObject({ stroke: 'var(--color-ink-dark)', isAnimationActive: false });
    expect(screen.getByText('Flujo de pedidos').closest('section')).toHaveClass('h-full');
    expect(screen.getByLabelText('Pedidos diarios')).toHaveClass('min-h-0', 'flex-1');
    expect(screen.getByText('SÁB: 0 pedidos')).toBeInTheDocument();
  });
});
