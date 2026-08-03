import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LoginPage } from './LoginPage';
import { useAuthStore } from '@/store/auth';
import * as authApi from '@/api/auth';
import { ApiError } from '@/types/api';

vi.mock('@/api/auth');
const mockedLogin = vi.mocked(authApi.login);
const mockedGetRegistrationStatus = vi.mocked(authApi.getRegistrationStatus);

describe('LoginPage', () => {
  beforeEach(() => {
    useAuthStore.getState().clearSession();
    mockedLogin.mockReset();
    mockedGetRegistrationStatus.mockResolvedValue({ open: false, requires_code: false });
  });

  it('rejects empty credentials without calling the API', async () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByRole('button', { name: /entrar al panel/i }));
    const errors = await screen.findAllByText(/ingresa email y contraseña/i);
    expect(errors.length).toBeGreaterThan(0);
    expect(mockedLogin).not.toHaveBeenCalled();
  });

  it('validates credentials and clears session after a 401', async () => {
    mockedLogin.mockRejectedValue(new ApiError('UNAUTHORIZED', 'No autorizado', 401));
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );
    fireEvent.change(screen.getByLabelText(/^email$/i, { selector: 'input' }), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/^contraseña$/i, { selector: 'input' }), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /entrar al panel/i }));
    const errors = await screen.findAllByText(/email o contraseña incorrectos/i);
    expect(errors.length).toBeGreaterThan(0);
    expect(useAuthStore.getState().accessToken).toBeNull();
  });
});
