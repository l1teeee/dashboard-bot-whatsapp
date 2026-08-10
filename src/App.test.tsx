import { StrictMode } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
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

function authResponse(data: unknown) {
  return new Response(JSON.stringify({ success: true, data }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
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

  it('rehydrates only once when StrictMode runs the startup effect twice', async () => {
    const fetchMock = vi.fn((url: string) => {
      if (url === '/api/auth/refresh') return Promise.resolve(authResponse(session));
      return Promise.resolve(authResponse({ orders: [], reservations: [], total: 0 }));
    });
    vi.stubGlobal('fetch', fetchMock);
    useAuthStore.getState().setStatus('idle');
    window.history.replaceState({}, '', '/dashboard');

    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    render(
      <StrictMode>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </StrictMode>,
    );

    await vi.waitFor(() => expect(useAuthStore.getState().status).toBe('authenticated'));
    expect(fetchMock.mock.calls.filter(([url]) => url === '/api/auth/refresh')).toHaveLength(1);
  });

  it('keeps the requested route recoverable when session refresh has a temporary outage', async () => {
    const fetchMock = vi
      .fn()
      .mockRejectedValueOnce(new Error('gateway unavailable'))
      .mockImplementation((url: string) =>
        Promise.resolve(authResponse(url === '/api/auth/refresh' ? session : { orders: [], reservations: [], total: 0 })),
      );
    vi.stubGlobal('fetch', fetchMock);
    useAuthStore.getState().setStatus('idle');
    window.history.replaceState({}, '', '/dashboard');
    renderApp();

    expect(await screen.findByRole('heading', { name: /no pudimos restaurar tu sesión/i })).toBeInTheDocument();
    expect(window.location.pathname).toBe('/dashboard');

    fireEvent.click(screen.getByRole('button', { name: 'Reintentar' }));

    await vi.waitFor(() => expect(useAuthStore.getState().status).toBe('authenticated'));
    expect(fetchMock.mock.calls.filter(([url]) => url === '/api/auth/refresh')).toHaveLength(2);
  });
});
