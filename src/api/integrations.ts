import { request } from './client';
import type {
  GoogleIntegrationStatus,
  GoogleConnectUrl,
  GoogleDisconnectResponse,
} from '@/types/integration';

export async function getGoogleIntegrationStatus(): Promise<GoogleIntegrationStatus> {
  return request<GoogleIntegrationStatus>('/api/integrations/google/status');
}

export async function getGoogleConnectUrl(): Promise<GoogleConnectUrl> {
  return request<GoogleConnectUrl>('/api/integrations/google/connect');
}

export async function disconnectGoogleIntegration(): Promise<GoogleDisconnectResponse> {
  return request<GoogleDisconnectResponse>('/api/integrations/google', {
    method: 'DELETE',
  });
}
