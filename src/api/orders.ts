import { request } from './client';
import type { Order, OrderWithLogs, PaginatedOrders, OrdersQuery, OrderStatusUpdate, BusinessDay } from '@/types/order';

export async function getOrders(query?: OrdersQuery): Promise<PaginatedOrders> {
  return request<PaginatedOrders>('/api/orders', { params: query as Record<string, string | number | undefined> });
}

export async function getOrderById(id: number): Promise<OrderWithLogs> {
  return request<OrderWithLogs>(`/api/orders/${id}`);
}

export async function updateOrderStatus(
  id: number,
  payload: { status: OrderStatusUpdate; notes?: string },
): Promise<Order> {
  return request<Order>(`/api/orders/${id}/status`, {
    method: 'PATCH',
    body: payload,
  });
}

export async function updateOrderPosition(id: number, position: number): Promise<Order> {
  return request<Order>(`/api/orders/${id}/position`, {
    method: 'PATCH',
    body: { position },
  });
}

export async function deleteOrder(id: number): Promise<{ id: number; deleted: true }> {
  return request<{ id: number; deleted: true }>(`/api/orders/${id}`, {
    method: 'DELETE',
  });
}

export async function getBusinessDay(): Promise<BusinessDay> {
  return request<BusinessDay>('/api/orders/business-day');
}

export async function closeBusinessDay(): Promise<BusinessDay> {
  return request<BusinessDay>('/api/orders/business-day/close', {
    method: 'POST',
  });
}
