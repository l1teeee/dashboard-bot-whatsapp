import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReservationCard } from './ReservationCard';
import type { Reservation } from '@/types/reservation';

const completed: Reservation = {
  id: 5,
  status: 'completed',
  customer_name: 'Juan Garcia',
  party_size: 4,
  phone_number: '5037000000',
  reserved_at: '2026-08-15T19:00:00Z',
  notes: null,
  source: 'dashboard',
  created_at: '2026-08-01T12:00:00Z',
  updated_at: '2026-08-01T12:00:00Z',
};

describe('ReservationCard', () => {
  it('uses its own keyboard-accessible detail control instead of a clickable card container', async () => {
    const onOpen = vi.fn();
    const user = userEvent.setup();
    render(<ReservationCard reservation={completed} onClick={onOpen} />);
    const detail = screen.getByRole('button', { name: /ver detalle de reserva 5/i });
    detail.focus();
    await user.keyboard('{Enter}');
    expect(onOpen).toHaveBeenCalledWith(5);
    expect(screen.getByText('Juan Garcia')).toBeInTheDocument();
  });

  it('displays reservation information correctly', () => {
    const pending: Reservation = { ...completed, status: 'pending' };
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    });
    render(
      <QueryClientProvider client={queryClient}>
        <ReservationCard reservation={pending} onClick={vi.fn()} variant="list" />
      </QueryClientProvider>,
    );
    expect(screen.getByText('Juan Garcia')).toBeInTheDocument();
    expect(screen.getByText(/pax/)).toBeInTheDocument();
  });
});
