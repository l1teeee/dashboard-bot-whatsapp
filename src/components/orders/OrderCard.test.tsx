import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { OrderCard } from './OrderCard';
import type { Order } from '@/types/order';

const completed: Order = {
  id: 19, status: 'completed', position: 0, total: 12, phone_number: '5037000000',
  items: [], notes: null, created_at: '2026-08-01T12:00:00Z', updated_at: '2026-08-01T12:00:00Z',
  business_day: null, daily_number: null,
};

describe('OrderCard', () => {
  it('uses its own keyboard-accessible detail control instead of a clickable card container', async () => {
    const onOpen = vi.fn();
    const user = userEvent.setup();
    render(<OrderCard order={completed} onClick={onOpen} onDelete={vi.fn()} />);
    const detail = screen.getByRole('button', { name: /ver detalle del pedido 19/i });
    detail.focus();
    await user.keyboard('{Enter}');
    expect(onOpen).toHaveBeenCalledWith(19);
    expect(screen.getByRole('button', { name: /eliminar pedido/i })).toBeInTheDocument();
  });

  it('keeps two mobile status actions inside a responsive grid', () => {
    const pending: Order = { ...completed, status: 'pending' };
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
    const { container } = render(<QueryClientProvider client={queryClient}><OrderCard order={pending} onClick={vi.fn()} variant="list" /></QueryClientProvider>);
    const actionContainer = container.querySelector('.grid.min-w-0.grid-cols-1');
    expect(actionContainer).toHaveClass('sm:grid-cols-2');
    expect(actionContainer?.querySelectorAll('button')).toHaveLength(2);
  });
});
