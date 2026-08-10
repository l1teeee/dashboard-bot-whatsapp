import { beforeEach, describe, expect, it, vi } from 'vitest';
import { refresh } from './auth';
import { request } from './client';
import { useAuthStore } from '@/store/auth';
import type { SessionData } from '@/types/api';

const session: SessionData = {
  access_token: 'renewed-token',
  expires_in: 900,
  account: {
    id: 1,
    email: 'ops@example.com',
    name: 'Ops',
    role: 'owner',
    status: 'active',
    created_at: '2026-01-01T00:00:00Z',
  },
  tenant: { id: 1, name: 'Restaurante', menu_link: null },
};

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

describe('API session recovery', () => {
  beforeEach(() => {
    useAuthStore.getState().clearSession();
    vi.unstubAllGlobals();
  });

  it('shares simultaneous refreshes and restores the in-memory session once', async () => {
    const fetchMock = vi.fn(() =>
      Promise.resolve(jsonResponse({ success: true, data: session })),
    );
    vi.stubGlobal('fetch', fetchMock);

    await Promise.all([refresh(), refresh()]);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/auth/refresh',
      expect.objectContaining({ method: 'POST', credentials: 'include' }),
    );
    expect(useAuthStore.getState()).toMatchObject({
      status: 'authenticated',
      accessToken: 'renewed-token',
    });
  });

  it('retries a protected request once after the shared refresh succeeds', async () => {
    useAuthStore.getState().setSession({ ...session, access_token: 'expired-token' });
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        jsonResponse(
          { success: false, error: { code: 'TOKEN_EXPIRED', message: 'Expirado' } },
          401,
        ),
      )
      .mockResolvedValueOnce(jsonResponse({ success: true, data: session }))
      .mockResolvedValueOnce(jsonResponse({ success: true, data: { ok: true } }));
    vi.stubGlobal('fetch', fetchMock);

    await expect(request<{ ok: boolean }>('/api/orders')).resolves.toEqual({ ok: true });

    expect(fetchMock.mock.calls.map(([url]) => url)).toEqual([
      '/api/orders',
      '/api/auth/refresh',
      '/api/orders',
    ]);
    expect(fetchMock.mock.calls[2]?.[1]).toMatchObject({
      headers: { Authorization: 'Bearer renewed-token' },
    });
  });

  it('keeps a known session when refresh has a temporary server failure', async () => {
    useAuthStore.getState().setSession(session);
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve(
          jsonResponse(
            { success: false, error: { code: 'UPSTREAM_DOWN', message: 'Intenta de nuevo' } },
            503,
          ),
        ),
      ),
    );

    await expect(refresh()).rejects.toMatchObject({ status: 503, code: 'UPSTREAM_DOWN' });
    expect(useAuthStore.getState()).toMatchObject({
      status: 'authenticated',
      accessToken: 'renewed-token',
    });
  });

  it('clears the session only when refresh is rejected definitively', async () => {
    useAuthStore.getState().setSession(session);
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve(
          jsonResponse(
            { success: false, error: { code: 'REFRESH_EXPIRED', message: 'Expirado' } },
            401,
          ),
        ),
      ),
    );

    await expect(refresh()).rejects.toMatchObject({ status: 401, code: 'REFRESH_EXPIRED' });
    expect(useAuthStore.getState()).toMatchObject({
      status: 'anonymous',
      accessToken: null,
    });
  });
});
