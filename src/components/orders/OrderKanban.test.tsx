import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { OrderKanban } from './OrderKanban';
import type { Order } from '@/types/order';

vi.mock('@/components/ui', () => ({
  KanbanBoard: ({ items, onDrop, className }: { items: Order[]; onDrop: (order: Order, column: string) => void; className?: string }) => <button className={className} onClick={() => onDrop(items[0], 'cancelled')}>Simular cancelación</button>,
  EmptyState: () => <div />,
  SkeletonCard: () => <div />,
}));
vi.mock('@/components/ui/ConfirmDialog', () => ({
  ConfirmDialog: ({ open, title, description, onCancel }: { open: boolean; title: string; description: string; onCancel: () => void }) => <section data-testid={`confirm-${title}`} data-open={String(open)}><p>{description}</p><button onClick={onCancel}>Cerrar {title}</button></section>,
}));
vi.mock('@/hooks/useMoveOrderStatus', () => ({ useMoveOrderStatus: () => ({ mutate: vi.fn() }) }));
vi.mock('@/hooks/useReorderOrder', () => ({ useReorderOrder: () => ({ mutate: vi.fn() }) }));
vi.mock('@/hooks/useDeleteOrder', () => ({ useDeleteOrder: () => ({ mutate: vi.fn() }) }));

const order: Order = {
  id: 7,
  status: 'pending',
  position: 0,
  total: 5,
  phone_number: '5037000000',
  items: [],
  notes: null,
  created_at: '2026-08-01T12:00:00Z',
  updated_at: '2026-08-01T12:00:00Z',
  business_day: null,
  daily_number: null,
};

describe('OrderKanban confirmation presence', () => {
  it('retains the cancellation payload while its dialog closes', () => {
    render(<OrderKanban orders={[order]} isLoading={false} onSelectOrder={vi.fn()} />);

    const board = screen.getByRole('button', { name: /simular cancelación/i });
    expect(board).toHaveClass('lg:h-full', 'lg:min-h-0');
    fireEvent.click(board);
    const confirmation = screen.getByTestId('confirm-Cancelar pedido');
    expect(confirmation).toHaveAttribute('data-open', 'true');
    expect(confirmation).toHaveTextContent(/pedido #7/i);

    fireEvent.click(screen.getByRole('button', { name: /cerrar cancelar pedido/i }));
    expect(confirmation).toHaveAttribute('data-open', 'false');
    expect(confirmation).toHaveTextContent(/pedido #7/i);
  });
});
