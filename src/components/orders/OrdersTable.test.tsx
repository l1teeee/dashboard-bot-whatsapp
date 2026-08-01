import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { OrdersTable } from './OrdersTable';
import type { Order } from '@/types/order';

const order: Order = { id: 7, status: 'processing', position: 0, total: 8.5, phone_number: '+503 7000-1234', items: [{ menu_item_id: 1, name: 'Pupusa', quantity: 2, unit_price: 4.25 }], notes: null, created_at: '2026-08-01T12:00:00Z', updated_at: '2026-08-01T12:00:00Z' };

describe('OrdersTable', () => {
  it('keeps status in its own column and opens a row through its detail action', () => {
    const onSelectOrder = vi.fn();
    render(<OrdersTable orders={[order]} onSelectOrder={onSelectOrder} />);
    expect(screen.getByRole('columnheader', { name: 'Estado' })).toBeInTheDocument();
    expect(screen.getByText('En proceso')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /ver detalle del pedido 7/i }));
    expect(onSelectOrder).toHaveBeenCalledWith(7);
  });
});
