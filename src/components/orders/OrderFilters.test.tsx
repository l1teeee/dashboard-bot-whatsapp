import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { OrderFilters, type FilterState } from './OrderFilters';

const value: FilterState = { status: 'all', phone: '', from: '', to: '' };

describe('OrderFilters', () => {
  it('updates the phone search and supports clearing it', () => {
    const onChange = vi.fn();
    render(<OrderFilters value={{ ...value, phone: '+503 700' }} onChange={onChange} onReset={vi.fn()} />);
    fireEvent.change(screen.getByLabelText(/buscar pedido por teléfono/i), { target: { value: '503-700' } });
    expect(onChange).toHaveBeenCalledWith({ ...value, phone: '503-700' });
    fireEvent.click(screen.getByRole('button', { name: /borrar búsqueda/i }));
    expect(onChange).toHaveBeenCalledWith({ ...value, phone: '' });
  });

  it('only exposes reset when filters are active', () => {
    const { rerender } = render(<OrderFilters value={value} onChange={vi.fn()} onReset={vi.fn()} />);
    expect(screen.queryByRole('button', { name: /limpiar/i })).not.toBeInTheDocument();
    rerender(<OrderFilters value={{ ...value, status: 'pending' }} onChange={vi.fn()} onReset={vi.fn()} />);
    expect(screen.getByRole('button', { name: /limpiar/i })).toBeInTheDocument();
  });

  it('keeps the search clear control out of the DOM until it has a value', () => {
    const { rerender } = render(<OrderFilters value={value} onChange={vi.fn()} onReset={vi.fn()} />);
    expect(screen.queryByRole('button', { name: /borrar búsqueda/i })).not.toBeInTheDocument();
    rerender(<OrderFilters value={{ ...value, phone: '5037000000' }} onChange={vi.fn()} onReset={vi.fn()} />);
    expect(screen.getByRole('button', { name: /borrar búsqueda/i })).toBeInTheDocument();
  });
});
