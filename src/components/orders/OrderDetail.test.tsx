import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import type React from 'react';
import { OrderDetail } from './OrderDetail';
import type { OrderWithLogs } from '@/types/order';

const { useOrderMock } = vi.hoisted(() => ({ useOrderMock: vi.fn() }));

vi.mock('@/hooks/useOrder', () => ({ useOrder: useOrderMock }));
vi.mock('@/hooks/useUpdateOrderStatus', () => ({ useUpdateOrderStatus: () => ({ mutate: vi.fn(), isPending: false }) }));
vi.mock('@/components/orders/StatusBadge', () => ({ StatusBadge: () => <span>estado</span> }));
vi.mock('@/components/ui', () => ({
  Modal: ({ open, title, children, footer }: { open: boolean; title: string; children: React.ReactNode; footer?: React.ReactNode }) => <div data-testid="order-detail-modal" data-open={String(open)}><h2>{title}</h2>{children}{footer}</div>,
  Skeleton: () => <div />,
  ErrorState: () => <div />,
  Textarea: () => <textarea />,
  Button: ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => <button onClick={onClick}>{children}</button>,
  ConfirmDialog: ({ open }: { open: boolean }) => <div data-testid="status-confirmation" data-open={String(open)} />,
}));

const order: OrderWithLogs = {
  id: 42,
  status: 'processing',
  position: 0,
  total: 12.5,
  phone_number: '5037000000',
  items: [],
  notes: null,
  logs: [],
  created_at: '2026-08-01T12:00:00Z',
  updated_at: '2026-08-01T12:00:00Z',
};

describe('OrderDetail presence', () => {
  it('keeps its modal root and last order id after the parent closes it', () => {
    useOrderMock.mockReturnValue({ order, isLoading: false, isError: false, error: null, refetch: vi.fn() });
    const { rerender } = render(<OrderDetail orderId={42} onClose={vi.fn()} />);

    rerender(<OrderDetail orderId={null} onClose={vi.fn()} />);

    expect(screen.getByTestId('order-detail-modal')).toHaveAttribute('data-open', 'false');
    expect(screen.getByRole('heading', { name: /pedido #42/i })).toBeInTheDocument();
    expect(useOrderMock).toHaveBeenLastCalledWith(42);
  });

  it('closes a child confirmation when the detail is closed externally', async () => {
    useOrderMock.mockReturnValue({ order, isLoading: false, isError: false, error: null, refetch: vi.fn() });
    const { rerender } = render(<OrderDetail orderId={42} onClose={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: /marcar completado/i }));
    expect(screen.getByTestId('status-confirmation')).toHaveAttribute('data-open', 'true');

    rerender(<OrderDetail orderId={null} onClose={vi.fn()} />);
    await waitFor(() => expect(screen.getByTestId('status-confirmation')).toHaveAttribute('data-open', 'false'));
  });
});
