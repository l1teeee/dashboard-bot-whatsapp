import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CloseBusinessDayButton } from './CloseBusinessDayButton';
import { closeBusinessDay, getBusinessDay } from '@/api/orders';
import { useAuthStore } from '@/store/auth';

vi.mock('@/api/orders', () => ({
  getBusinessDay: vi.fn(),
  closeBusinessDay: vi.fn(),
}));

function renderWithClient(ui: React.ReactElement) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
}

const businessDay = { business_day: '2026-08-10', order_count: 5, total_revenue: 100, closed_at: null };

describe('CloseBusinessDayButton', () => {
  it('does not render for a non-owner user', () => {
    useAuthStore.setState({ account: { id: 1, email: 'a@a.com', name: 'Staff', role: 'staff', status: 'active', created_at: '2026-01-01' } });
    vi.mocked(getBusinessDay).mockResolvedValue(businessDay);
    renderWithClient(<CloseBusinessDayButton />);
    expect(screen.queryByRole('button', { name: /cerrar día/i })).not.toBeInTheDocument();
  });

  it('calls closeBusinessDay when confirming the dialog', async () => {
    useAuthStore.setState({ account: { id: 1, email: 'o@o.com', name: 'Owner', role: 'owner', status: 'active', created_at: '2026-01-01' } });
    vi.mocked(getBusinessDay).mockResolvedValue(businessDay);
    vi.mocked(closeBusinessDay).mockResolvedValue({ ...businessDay, closed_at: '2026-08-10T23:00:00Z' });
    const user = userEvent.setup();

    renderWithClient(<CloseBusinessDayButton />);

    await user.click(screen.getByRole('button', { name: /cerrar día/i }));
    const dialog = await screen.findByText('Cerrar la jornada');
    expect(dialog).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /^cerrar día$/i, hidden: false }));

    expect(closeBusinessDay).toHaveBeenCalled();
  });
});
