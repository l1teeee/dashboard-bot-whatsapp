import type { ReactNode } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getDashboardMetrics } from '@/lib/dashboardMetrics';
import { DASHBOARD_LAYOUT_STORAGE_KEY } from './dashboardLayout';
import { DashboardBento } from './DashboardBento';

const { viewport } = vi.hoisted(() => ({ viewport: { width: 1200 } }));

vi.mock('react-grid-layout', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-grid-layout')>();
  return {
    ...actual,
    useContainerWidth: () => ({
      width: viewport.width,
      mounted: true,
      containerRef: { current: null },
      measureWidth: vi.fn(),
    }),
    GridLayout: ({ children }: { children: ReactNode }) => <div data-testid="editable-grid">{children}</div>,
  };
});

vi.mock('./RevenueOverviewCard', () => ({ RevenueOverviewCard: () => <section>Ingresos</section> }));
vi.mock('./OrderFlowCard', () => ({ OrderFlowCard: () => <section>Flujo</section> }));
vi.mock('./QueueSpotlightCard', () => ({ QueueSpotlightCard: () => <section>Cola</section> }));
vi.mock('./StatusMixCard', () => ({ StatusMixCard: () => <section>Estados</section> }));
vi.mock('./RecentOrdersCard', () => ({ RecentOrdersCard: () => <section>Recientes</section> }));

describe('DashboardBento', () => {
  beforeEach(() => {
    viewport.width = 1200;
    window.localStorage.clear();
  });

  it('ofrece edición por teclado, persiste y permite restablecer', async () => {
    render(<DashboardBento metrics={getDashboardMetrics([])} onSelect={vi.fn()} />);

    const reset = screen.getByRole('button', { name: 'Restablecer' });
    expect(reset).toBeDisabled();
    expect(screen.getByTestId('editable-grid')).toBeInTheDocument();

    fireEvent.keyDown(screen.getByRole('button', { name: 'Organizar Ingresos completados' }), {
      key: 'ArrowRight',
      shiftKey: true,
    });

    expect(await screen.findByRole('status')).toHaveTextContent('Tamaño actualizado: Ingresos completados.');
    expect(reset).toBeEnabled();
    await waitFor(() => {
      const stored = JSON.parse(window.localStorage.getItem(DASHBOARD_LAYOUT_STORAGE_KEY) ?? '{}') as {
        items?: Array<{ i: string; w: number }>;
      };
      expect(stored.items?.find((item) => item.i === 'revenue')?.w).toBe(8);
    });

    fireEvent.click(reset);
    expect(reset).toBeDisabled();
    expect(screen.getByRole('status')).toHaveTextContent('Se restauró la distribución original');
  });

  it('apila los widgets y oculta los controles de edición en móvil', () => {
    viewport.width = 480;
    render(<DashboardBento metrics={getDashboardMetrics([])} onSelect={vi.fn()} />);

    expect(screen.queryByTestId('editable-grid')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Organizar/ })).not.toBeInTheDocument();
    expect(screen.getByText(/widgets se muestran apilados/i)).toBeInTheDocument();
  });
});
