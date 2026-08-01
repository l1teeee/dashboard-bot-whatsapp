import { request } from './client';
import type { MenuItem, CreateMenuItemInput, UpdateMenuItemInput } from '@/types/menu';

export async function getMenu(): Promise<MenuItem[]> {
  return request<MenuItem[]>('/api/menu');
}

export async function createMenuItem(input: CreateMenuItemInput): Promise<MenuItem> {
  return request<MenuItem>('/api/menu', {
    method: 'POST',
    body: input,
  });
}

export async function updateMenuItem(id: number, input: UpdateMenuItemInput): Promise<MenuItem> {
  return request<MenuItem>(`/api/menu/${id}`, {
    method: 'PATCH',
    body: input,
  });
}
