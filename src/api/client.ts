import type { ApiResponse, ApiErrorBody } from '@/types/api';
import { ApiError, NetworkError } from '@/types/api';
import { useAuthStore } from '@/store/auth';
import { useConnectionStore } from '@/store/connection';

const BASE_URL = '';

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
  params?: Record<string, string | number | undefined>;
}

function buildQueryString(params?: Record<string, string | number | undefined>): string {
  if (!params) return '';
  const filtered = Object.entries(params)
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join('&');
  return filtered ? `?${filtered}` : '';
}

export async function request<T>(
  path: string,
  options?: RequestOptions,
): Promise<T> {
  const { method = 'GET', body, params } = options || {};
  const url = `${BASE_URL}${path}${buildQueryString(params)}`;

  const headers: HeadersInit = {};
  const apiKey = useAuthStore.getState().apiKey;
  if (apiKey) {
    headers['X-API-Key'] = apiKey;
  }

  if (body) {
    headers['Content-Type'] = 'application/json';
  }

  try {
    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
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

    if (response.status === 401) {
      useAuthStore.getState().clearApiKey();
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
