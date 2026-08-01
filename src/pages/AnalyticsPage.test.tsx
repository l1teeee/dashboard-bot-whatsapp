import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AnalyticsPage } from './AnalyticsPage';

const { useOrdersMock } = vi.hoisted(() => ({ useOrdersMock: vi.fn() }));

vi.mock('@/hooks/useOrders', () => ({ useOrders: useOrdersMock }));
vi.mock('@/hooks/useDashboardMetrics', () => ({ useDashboardMetrics: () => ({}) }));
vi.mock('@/components/dashboard/DashboardBento', () => ({ DashboardBento: () => <div data-testid="dashboard-bento">Bento</div> }));
vi.mock('@/components/orders/OrderDetail', () => ({ OrderDetail: () => null }));

describe('AnalyticsPage', () => {
  beforeEach(() => {
    useOrdersMock.mockReturnValue({ orders: [], isLoading: false, isError: false, error: null, refetch: vi.fn() });
  });

  it('keeps the operational metrics in their own route', () => {
    render(<AnalyticsPage />);
    expect(screen.getByRole('heading', { name: /resumen operativo/i })).toBeInTheDocument();
    expect(screen.getByTestId('dashboard-bento')).toBeInTheDocument();
  });

  it('shows placeholders instead of zero-value metrics during the initial load', () => {
    useOrdersMock.mockReturnValue({ orders: [], isLoading: true, isError: false, error: null, refetch: vi.fn() });

    render(<AnalyticsPage />);

    expect(screen.getByLabelText(/cargando indicadores/i)).toHaveAttribute('aria-busy', 'true');
    expect(screen.queryByTestId('dashboard-bento')).not.toBeInTheDocument();
  });
});
