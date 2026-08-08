import { request } from './client';
import type {
  Reservation,
  ReservationWithLogs,
  PaginatedReservations,
  ReservationsQuery,
  ReservationStatusUpdate,
} from '@/types/reservation';

export async function getReservations(query?: ReservationsQuery): Promise<PaginatedReservations> {
  return request<PaginatedReservations>('/api/reservations', {
    params: query as Record<string, string | number | undefined>,
  });
}

export async function getReservationById(id: number): Promise<ReservationWithLogs> {
  return request<ReservationWithLogs>(`/api/reservations/${id}`);
}

export async function createReservation(payload: {
  customer_name: string;
  party_size: number;
  reserved_at: string;
  phone_number?: string;
  notes?: string;
}): Promise<Reservation> {
  return request<Reservation>('/api/reservations', {
    method: 'POST',
    body: payload,
  });
}

export async function updateReservation(
  id: number,
  payload: {
    customer_name?: string;
    party_size?: number;
    reserved_at?: string;
    notes?: string;
  },
): Promise<Reservation> {
  return request<Reservation>(`/api/reservations/${id}`, {
    method: 'PATCH',
    body: payload,
  });
}

export async function updateReservationStatus(
  id: number,
  payload: { status: ReservationStatusUpdate; notes?: string },
): Promise<Reservation> {
  return request<Reservation>(`/api/reservations/${id}/status`, {
    method: 'PATCH',
    body: payload,
  });
}

export async function deleteReservation(id: number): Promise<{ id: number; deleted: true }> {
  return request<{ id: number; deleted: true }>(`/api/reservations/${id}`, {
    method: 'DELETE',
  });
}
