import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DashboardPage } from './DashboardPage';

vi.mock('@/hooks/useOrders', () => ({
  useOrders: () => ({
    orders: [],
    total: 0,
    isLoading: false,
    isError: false,
    error: null,
    refetch: vi.fn(),
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
  it('contains only the live operation, not analytics', () => {
    render(<DashboardPage />);

    expect(screen.getByTestId('order-kanban')).toBeInTheDocument();
    expect(screen.queryByText(/resumen operativo/i)).not.toBeInTheDocument();

    const pageTitle = screen.getByRole('heading', { level: 1, name: /operación en vivo/i });
    expect(pageTitle).toHaveClass('text-[clamp(1.9rem,3vw,2.75rem)]');

    const liveRegion = screen.getByRole('region', { name: /operación en vivo/i });
    expect(liveRegion).toHaveClass('lg:min-h-0', 'lg:flex-1', 'lg:overflow-hidden');
    expect(screen.getByRole('heading', { level: 2, name: /operación en vivo/i })).toHaveClass('text-2xl');
  });
});
