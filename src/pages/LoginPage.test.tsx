import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LoginPage } from './LoginPage';
import { useAuthStore } from '@/store/auth';
import { getOrders } from '@/api/orders';
import { ApiError } from '@/types/api';

vi.mock('@/api/orders', () => ({ getOrders: vi.fn() }));
const mockedGetOrders = vi.mocked(getOrders);
describe('LoginPage', () => {
  beforeEach(() => { useAuthStore.getState().clearApiKey(); mockedGetOrders.mockReset(); });
  it('rejects an empty key without calling the API', async () => { render(<MemoryRouter><LoginPage /></MemoryRouter>); fireEvent.click(screen.getByRole('button', { name: /entrar al panel/i })); expect(await screen.findByText(/ingresa la api key/i)).toBeInTheDocument(); expect(mockedGetOrders).not.toHaveBeenCalled(); });
  it('validates a key and clears it after a 401', async () => { mockedGetOrders.mockRejectedValue(new ApiError('UNAUTHORIZED', 'No autorizado', 401)); render(<MemoryRouter><LoginPage /></MemoryRouter>); fireEvent.change(screen.getByLabelText(/^api key$/i, { selector: 'input' }), { target: { value: 'bad-key' } }); fireEvent.click(screen.getByRole('button', { name: /entrar al panel/i })); await waitFor(() => expect(screen.getByText(/api key inválida/i)).toBeInTheDocument()); expect(useAuthStore.getState().apiKey).toBeNull(); });
});
