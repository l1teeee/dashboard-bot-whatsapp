import { request } from './client';
import type { SessionData, RegistrationStatus, Settings } from '@/types/api';

export async function getRegistrationStatus(): Promise<RegistrationStatus> {
  return request<RegistrationStatus>('/api/auth/registration-status');
}

export async function register(payload: {
  name: string;
  email: string;
  password: string;
  restaurant_name: string;
  signup_code?: string;
}): Promise<SessionData> {
  return request<SessionData>('/api/auth/register', {
    method: 'POST',
    body: payload,
  });
}

export async function login(payload: {
  email: string;
  password: string;
}): Promise<SessionData> {
  return request<SessionData>('/api/auth/login', {
    method: 'POST',
    body: payload,
  });
}

export async function refresh(): Promise<SessionData> {
  return request<SessionData>('/api/auth/refresh', {
    method: 'POST',
  });
}

export async function logout(): Promise<{ logged_out: true }> {
  return request<{ logged_out: true }>('/api/auth/logout', {
    method: 'POST',
  });
}

export async function getMe(): Promise<{ account: any; tenant: any }> {
  return request<{ account: any; tenant: any }>('/api/auth/me');
}

export async function changePassword(payload: {
  current_password: string;
  new_password: string;
}): Promise<{ changed: true }> {
  return request<{ changed: true }>('/api/auth/change-password', {
    method: 'POST',
    body: payload,
  });
}

export async function acceptInvitation(payload: {
  token: string;
  name: string;
  password: string;
}): Promise<SessionData> {
  return request<SessionData>('/api/auth/accept-invitation', {
    method: 'POST',
    body: payload,
  });
}

export async function getTeam(): Promise<{
  members: any[];
  invitations: any[];
}> {
  return request<{ members: any[]; invitations: any[] }>('/api/team');
}

export async function createInvitation(payload: {
  email: string;
  role: string;
}): Promise<{
  email: string;
  role: string;
  invite_url: string;
  expires_at: string;
}> {
  return request<{
    email: string;
    role: string;
    invite_url: string;
    expires_at: string;
  }>('/api/team/invitations', {
    method: 'POST',
    body: payload,
  });
}

export async function revokeInvitation(id: number): Promise<{
  id: number;
  revoked: true;
}> {
  return request<{ id: number; revoked: true }>(`/api/team/invitations/${id}`, {
    method: 'DELETE',
  });
}

export async function updateMemberStatus(
  id: number,
  payload: { status: 'active' | 'disabled' },
): Promise<any> {
  return request<any>(`/api/team/members/${id}/status`, {
    method: 'PATCH',
    body: payload,
  });
}

export async function getSettings(): Promise<Settings> {
  return request<Settings>('/api/settings');
}

export async function updateSettings(payload: Partial<{
  name: string;
  menu_link: string;
  whatsapp_phone_number_id: string;
  whatsapp_access_token: string;
}>): Promise<Settings> {
  return request<Settings>('/api/settings', {
    method: 'PATCH',
    body: payload,
  });
}
