import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { DashboardPage } from './DashboardPage';

const { refetchMock } = vi.hoisted(() => ({ refetchMock: vi.fn() }));

vi.mock('@/hooks/useOrders', () => ({
  useOrders: () => ({
    orders: [],
    total: 3,
    isLoading: false,
    isError: false,
    error: null,
    refetch: refetchMock,
    isFetching: false,
  }),
}));

vi.mock('@/hooks/useDashboardMetrics', () => ({
  useDashboardMetrics: () => ({
    activeOrders: 0,
    completedRevenue: 0,
    averageTicket: 0,
    last7Days: [],
    oldestPending: undefined,
    statusCounts: { pending: 0, processing: 0, completed: 0, cancelled: 0 },
    completionRate: 0,
    recentOrders: [],
  }),
}));

vi.mock('@/components/orders/OrderKanban', () => ({
  OrderKanban: () => <div data-testid="order-kanban">Kanban</div>,
}));

vi.mock('@/components/orders/OrderDetail', () => ({
  OrderDetail: () => null,
}));

describe('DashboardPage', () => {
  it('concentra el contador y la actualización dentro de Flujo operativo', () => {
    render(<DashboardPage />);

    expect(screen.getByTestId('order-kanban')).toBeInTheDocument();
    expect(screen.queryByText(/resumen operativo/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/operación en vivo/i)).not.toBeInTheDocument();

    const liveRegion = screen.getByRole('region', { name: /flujo operativo/i });
    expect(liveRegion).toHaveClass('lg:min-h-0', 'lg:flex-1', 'lg:overflow-hidden');
    expect(within(liveRegion).getByRole('heading', { level: 1, name: /flujo operativo/i })).toHaveClass('text-3xl');
    expect(within(liveRegion).getByText('3 pedidos informados por el servidor')).toBeInTheDocument();

    fireEvent.click(within(liveRegion).getByRole('button', { name: /actualizar/i }));
    expect(refetchMock).toHaveBeenCalledTimes(1);
  });
});
