export type ReservationStatus = 'pending' | 'confirmed' | 'seated' | 'completed' | 'cancelled' | 'no_show';

export type ReservationStatusUpdate = Exclude<ReservationStatus, 'pending'>;

export const RESERVATION_STATUS_TRANSITIONS: Record<ReservationStatus, ReservationStatusUpdate[]> = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['seated', 'cancelled', 'no_show'],
  seated: ['completed', 'cancelled'],
  completed: [],
  cancelled: [],
  no_show: [],
};

export interface Reservation {
  id: number;
  phone_number: string | null;
  customer_name: string;
  party_size: number;
  reserved_at: string;
  status: ReservationStatus;
  notes: string | null;
  source: 'whatsapp' | 'dashboard';
  created_at: string;
  updated_at: string;
}

export interface ReservationLog {
  id: number;
  reservation_id: number;
  status_change: string;
  notes: string | null;
  changed_at: string;
}

export interface ReservationWithLogs extends Reservation {
  logs: ReservationLog[];
}

export interface PaginatedReservations {
  reservations: Reservation[];
  total: number;
  limit: number;
  offset: number;
}

export interface ReservationsQuery {
  status?: ReservationStatus;
  phone_number?: string;
  from?: string;
  to?: string;
  limit?: number;
  offset?: number;
}
