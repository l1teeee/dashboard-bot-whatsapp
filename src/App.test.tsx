import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { App } from './App';
import { useAuthStore } from '@/store/auth';

describe('public and protected routes', () => {
  beforeEach(() => {
    useAuthStore.getState().clearSession();
    window.history.replaceState({}, '', '/');
  });

  it('shows the public landing page at the root route', async () => {
    render(<App />);
    expect(await screen.findByRole('heading', { name: /pedidos claros.*cocina en movimiento/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /entrar al panel/i })).toHaveAttribute('href', '/login');
    expect(window.location.pathname).toBe('/');
  });

  it('keeps the operational dashboard protected', async () => {
    window.history.replaceState({}, '', '/dashboard');
    render(<App />);
    expect(await screen.findByRole('heading', { name: /acceso operativo/i })).toBeInTheDocument();
    expect(window.location.pathname).toBe('/login');
  });
});
