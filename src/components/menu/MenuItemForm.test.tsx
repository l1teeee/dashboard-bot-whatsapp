import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { MenuItemForm } from './MenuItemForm';

const create = vi.fn();
vi.mock('@/hooks/useMenu', () => ({ useMenu: () => ({ items: [], isLoading: false, isError: false, error: null, refetch: vi.fn() }) }));
vi.mock('@/hooks/useMenuMutations', () => ({ useCreateMenuItem: () => ({ mutateAsync: create, isPending: false }), useUpdateMenuItem: () => ({ mutateAsync: vi.fn(), isPending: false }) }));
describe('MenuItemForm', () => {
  it('requires a name and a positive price', () => { render(<MenuItemForm open item={null} onClose={vi.fn()} />); fireEvent.click(screen.getByRole('button', { name: /guardar/i })); expect(screen.getByText(/nombre es obligatorio/i)).toBeInTheDocument(); expect(screen.getByText(/precio es obligatorio/i)).toBeInTheDocument(); fireEvent.change(screen.getByLabelText(/^precio$/i), { target: { value: '-1' } }); fireEvent.click(screen.getByRole('button', { name: /guardar/i })); expect(screen.getByText(/numero positivo/i)).toBeInTheDocument(); });
});
