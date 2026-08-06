import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { App } from './App';
import { useAuthStore } from '@/store/auth';
import type { SessionData } from '@/types/api';

const session = {
  access_token: 'token',
  account: { id: 1, email: 'ops@test.com', name: 'Ops', role: 'owner' },
  tenant: { id: 1, name: 'Restaurante' },
} as unknown as SessionData;

function renderApp() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>,
  );
}

describe('public and protected routes', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new Error('offline'))));
    useAuthStore.getState().clearSession();
    window.history.replaceState({}, '', '/');
  });

  it('shows the public landing page at the root route', async () => {
    renderApp();
    expect(await screen.findByRole('heading', { name: /pedidos claros.*cocina en movimiento/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /entrar al panel/i })).toHaveAttribute('href', '/login');
    expect(window.location.pathname).toBe('/');
  });

  it('keeps the operational dashboard protected', async () => {
    window.history.replaceState({}, '', '/dashboard');
    renderApp();
    expect(await screen.findByRole('heading', { name: /acceso operativo/i })).toBeInTheDocument();
    expect(window.location.pathname).toBe('/login');
  });

  it('offers a way back to the landing from the login form', async () => {
    window.history.replaceState({}, '', '/login');
    renderApp();
    expect(await screen.findByRole('link', { name: /volver al inicio/i })).toHaveAttribute('href', '/');
  });

  it('offers a way back to the landing from the register form', async () => {
    window.history.replaceState({}, '', '/register');
    renderApp();
    expect(await screen.findByRole('link', { name: /volver al inicio/i })).toHaveAttribute('href', '/');
  });

  it('does not send an authenticated visitor back to the login form', async () => {
    useAuthStore.getState().setSession(session);
    window.history.replaceState({}, '', '/login');
    renderApp();
    await vi.waitFor(() => expect(window.location.pathname).toBe('/dashboard'));
  });

  it('sends an authenticated visitor to the panel from an unknown route', async () => {
    useAuthStore.getState().setSession(session);
    window.history.replaceState({}, '', '/ruta-inexistente');
    renderApp();
    await vi.waitFor(() => expect(window.location.pathname).toBe('/dashboard'));
  });
});
