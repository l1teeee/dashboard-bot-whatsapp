import type { ApiResponse, ApiErrorBody, SessionData } from '@/types/api';
import { ApiError, NetworkError } from '@/types/api';
import { useAuthStore } from '@/store/auth';
import { useConnectionStore } from '@/store/connection';

const BASE_URL = '';

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
  params?: Record<string, string | number | undefined>;
  skipRefresh?: boolean;
}

function buildQueryString(params?: Record<string, string | number | undefined>): string {
  if (!params) return '';
  const filtered = Object.entries(params)
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join('&');
  return filtered ? `?${filtered}` : '';
}

// Rutas que establecen o destruyen la sesion: un 401 aqui es la respuesta
// legitima, no un token caducado, y reintentarlas provocaria recursion.
// El resto de /api/auth (me, change-password) si debe poder refrescar.
const NON_REFRESHABLE = [
  '/api/auth/refresh',
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/logout',
  '/api/auth/accept-invitation',
];

let refreshPromise: Promise<SessionData> | null = null;

async function refreshSession(): Promise<SessionData> {
  const response = await fetch(`${BASE_URL}/api/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
  });

  let data: unknown;
  try {
    data = await response.json();
  } catch {
    throw new ApiError(
      'INVALID_RESPONSE',
      'La respuesta del servidor no es JSON valido',
      response.status,
    );
  }

  const apiResponse = data as ApiResponse<SessionData>;
  if ('success' in apiResponse && apiResponse.success === true) {
    return apiResponse.data;
  }

  if ('success' in apiResponse && apiResponse.success === false) {
    const error = apiResponse.error as ApiErrorBody;
    throw new ApiError(error.code, error.message, response.status);
  }

  throw new ApiError(
    'INVALID_RESPONSE',
    'Respuesta del servidor sin estructura esperada',
    response.status,
  );
}

export async function request<T>(
  path: string,
  options?: RequestOptions,
): Promise<T> {
  const { method = 'GET', body, params, skipRefresh = false } = options || {};
  const url = `${BASE_URL}${path}${buildQueryString(params)}`;

  const headers: HeadersInit = {};
  const { accessToken } = useAuthStore.getState();
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  if (body) {
    headers['Content-Type'] = 'application/json';
  }

  try {
    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      credentials: 'include',
    });

    useConnectionStore.getState().setOffline(false);

    let data: unknown;
    try {
      data = await response.json();
    } catch {
      throw new ApiError(
        'INVALID_RESPONSE',
        'La respuesta del servidor no es JSON valido',
        response.status,
      );
    }

    if (response.status === 401 && !skipRefresh && !NON_REFRESHABLE.some((p) => path.startsWith(p))) {
      if (!refreshPromise) {
        refreshPromise = refreshSession()
          .then((sessionData) => {
            useAuthStore.getState().setSession(sessionData);
            refreshPromise = null;
            return sessionData;
          })
          .catch((err) => {
            useAuthStore.getState().clearSession();
            refreshPromise = null;
            throw err;
          });
      }

      // Solo el fallo del refresh se traduce a "sesion expirada". El reintento
      // queda fuera del try a proposito: si devuelve un 404 o un 409, ese error
      // debe llegar tal cual a quien llamo, no disfrazado de sesion caducada.
      try {
        await refreshPromise;
      } catch {
        throw new ApiError('UNAUTHORIZED', 'Sesión expirada', 401);
      }

      return request<T>(path, { ...options, skipRefresh: true });
    }

    if (response.status === 401) {
      useAuthStore.getState().clearSession();
    }

    const apiResponse = data as ApiResponse<T>;
    if ('success' in apiResponse && apiResponse.success === true) {
      return apiResponse.data;
    }

    if ('success' in apiResponse && apiResponse.success === false) {
      const error = apiResponse.error as ApiErrorBody;
      throw new ApiError(error.code, error.message, response.status);
    }

    throw new ApiError(
      'INVALID_RESPONSE',
      'Respuesta del servidor sin estructura esperada',
      response.status,
    );
  } catch (err) {
    if (err instanceof ApiError) {
      throw err;
    }
    useConnectionStore.getState().setOffline(true);
    throw new NetworkError();
  }
}
