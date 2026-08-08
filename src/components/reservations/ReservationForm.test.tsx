import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReservationForm } from './ReservationForm';

describe('ReservationForm', () => {
  it('renders form fields for creating a new reservation', () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <ReservationForm open={true} onClose={vi.fn()} />
      </QueryClientProvider>,
    );

    expect(screen.getByLabelText(/nombre del cliente/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/numero de personas/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/fecha/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/hora/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/telefono/i)).toBeInTheDocument();
  });

  it('closes when cancel button is clicked', async () => {
    const onClose = vi.fn();
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    });
    const user = userEvent.setup();

    render(
      <QueryClientProvider client={queryClient}>
        <ReservationForm open={true} onClose={onClose} />
      </QueryClientProvider>,
    );

    const cancelButton = screen.getByRole('button', { name: /cancelar/i });
    await user.click(cancelButton);
    expect(onClose).toHaveBeenCalled();
  });
});
