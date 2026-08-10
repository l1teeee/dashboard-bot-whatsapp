import { isValidElement } from 'react';
import type { ReactNode, Ref } from 'react';
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
    GridLayout: ({
      children,
      dragConfig,
      resizeConfig,
      layout,
      onResizeStop,
    }: {
      children: ReactNode;
      dragConfig?: { enabled?: boolean };
      layout: Array<{ i: string; x: number; y: number; w: number; h: number }>;
      resizeConfig?: {
        enabled?: boolean;
        handles?: Array<'n' | 'e' | 's' | 'w'>;
        handleComponent?: (axis: 'n' | 'e' | 's' | 'w', ref: Ref<HTMLElement>) => ReactNode;
      };
      onResizeStop?: (
        nextLayout: Array<{ i: string; x: number; y: number; w: number; h: number }>,
        oldItem: { i: string; x: number; y: number; w: number; h: number } | null,
        newItem: { i: string; x: number; y: number; w: number; h: number } | null,
      ) => void;
    }) => (
      <div
        data-testid="editable-grid"
        data-drag-enabled={String(dragConfig?.enabled)}
        data-resize-enabled={String(resizeConfig?.enabled)}
        data-resize-handles={resizeConfig?.handles?.join(',')}
        data-native-resize-handles={String(resizeConfig?.handles?.every((axis) => {
          const handle = resizeConfig.handleComponent?.(axis, { current: null });
          return isValidElement(handle) && typeof handle.type === 'string';
        }))}
      >
        {children}
        {resizeConfig?.handles?.map((axis) => resizeConfig.handleComponent?.(axis, { current: null }))}
        {resizeConfig?.enabled && (
          <button
            type="button"
            data-testid="mock-resize-revenue"
            onPointerUp={() => {
              const oldItem = layout.find((item) => item.i === 'revenue');
              if (!oldItem) return;
              const newItem = { ...oldItem, w: oldItem.w + 1, h: oldItem.h + 1 };
              onResizeStop?.(
                layout.map((item) => item.i === oldItem.i ? newItem : item),
                oldItem,
                newItem,
              );
            }}
          >
            Finalizar redimensionamiento
          </button>
        )}
      </div>
    ),
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

  it('mantiene los widgets bloqueados hasta editar, persiste y permite restablecer', async () => {
    render(<DashboardBento metrics={getDashboardMetrics([])} onSelect={vi.fn()} />);

    const edit = screen.getByRole('button', { name: 'Editar' });
    expect(edit).toBeEnabled();
    expect(screen.getByTestId('editable-grid')).toHaveAttribute('data-drag-enabled', 'false');
    expect(screen.queryByRole('button', { name: 'Restablecer' })).not.toBeInTheDocument();
    expect(screen.queryByRole('group', { name: 'Editar Ingresos completados' })).not.toBeInTheDocument();

    fireEvent.click(edit);

    expect(screen.getByText('Edici\u00f3n activa')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Listo' })).toBeInTheDocument();
    const reset = screen.getByRole('button', { name: 'Restablecer' });
    expect(reset).toBeDisabled();
    expect(screen.getByTestId('editable-grid')).toHaveAttribute('data-drag-enabled', 'true');
    expect(screen.getByTestId('editable-grid')).toHaveAttribute('data-resize-enabled', 'true');
    expect(screen.getByTestId('editable-grid')).toHaveAttribute('data-resize-handles', 'n,e,s,w');
    expect(screen.getByTestId('editable-grid')).toHaveAttribute('data-native-resize-handles', 'true');
    expect(screen.getAllByTestId(/resize-handle-/)).toHaveLength(4);
    expect(screen.getByRole('group', { name: 'Editar Ingresos completados' })).toHaveClass('dashboard-widget-frame-selected');
    expect(screen.getByRole('group', { name: 'Editar Ingresos completados' })).toHaveAttribute('aria-keyshortcuts', 'ArrowLeft ArrowRight ArrowUp ArrowDown Shift+ArrowLeft Shift+ArrowRight Shift+ArrowUp Shift+ArrowDown');

    fireEvent.pointerDown(screen.getByRole('group', { name: 'Editar Flujo de pedidos' }));
    expect(screen.getByRole('group', { name: 'Editar Flujo de pedidos' })).toHaveClass('dashboard-widget-frame-selected');

    fireEvent.keyDown(screen.getByRole('group', { name: 'Editar Ingresos completados' }), {
      key: 'ArrowRight',
      shiftKey: true,
    });

    expect(await screen.findByRole('status')).toHaveTextContent('Tama\u00f1o actualizado: Ingresos completados.');
    expect(reset).toBeEnabled();
    await waitFor(() => {
      const stored = JSON.parse(window.localStorage.getItem(DASHBOARD_LAYOUT_STORAGE_KEY) ?? '{}') as {
        items?: Array<{ i: string; w: number }>;
      };
      expect(stored.items?.find((item) => item.i === 'revenue')?.w).toBe(8);
    });

    fireEvent.click(reset);
    expect(reset).toBeDisabled();
    expect(screen.getByRole('status')).toHaveTextContent('Se restaur\u00f3 la distribuci\u00f3n original');

    fireEvent.click(screen.getByRole('button', { name: 'Listo' }));
    expect(screen.getByRole('button', { name: 'Editar' })).toBeInTheDocument();
    expect(screen.getByTestId('editable-grid')).toHaveAttribute('data-drag-enabled', 'false');
  });

  it('apila los widgets y deshabilita la edici\u00f3n en m\u00f3vil', () => {
    viewport.width = 480;
    render(<DashboardBento metrics={getDashboardMetrics([])} onSelect={vi.fn()} />);

    expect(screen.queryByTestId('editable-grid')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Editar' })).toBeDisabled();
    expect(screen.queryByRole('group', { name: /Editar/ })).not.toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Estados del lote' })).toHaveAttribute('data-widget-id', 'status-mix');
    expect(screen.getByText(/widgets se muestran apilados/i)).toBeInTheDocument();
  });

  it('persiste ancho y alto al finalizar un gesto de redimensionamiento', async () => {
    render(<DashboardBento metrics={getDashboardMetrics([])} onSelect={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: 'Editar' }));
    const handle = screen.getByTestId('mock-resize-revenue');
    fireEvent.pointerDown(handle);
    fireEvent.pointerUp(handle);

    expect(await screen.findByRole('status')).toHaveTextContent('Tama\u00f1o actualizado: Ingresos completados.');
    await waitFor(() => {
      const stored = JSON.parse(window.localStorage.getItem(DASHBOARD_LAYOUT_STORAGE_KEY) ?? '{}') as {
        items?: Array<{ i: string; w: number; h: number }>;
      };
      expect(stored.items?.find((item) => item.i === 'revenue')).toMatchObject({ w: 8, h: 10 });
    });
  });
});
