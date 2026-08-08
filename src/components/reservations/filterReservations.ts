import type { ReservationStatus } from '@/types/reservation';
import type { Reservation } from '@/types/reservation';
import { parseLocalDateBoundary, startOfToday } from '@/lib/dateBoundary';

export { parseLocalDateBoundary };

export interface FilterState {
  status: ReservationStatus | 'all';
  phone: string;
  from: string;
  to: string;
  range: 'upcoming' | 'all';
}

export function filterReservations(
  reservations: Reservation[],
  filters: FilterState,
  limit = 100,
): Reservation[] {
  const normalizedQuery = filters.phone.replace(/\D/g, '');
  const from = filters.from ? parseLocalDateBoundary(filters.from) : null;
  const to = filters.to ? parseLocalDateBoundary(filters.to, true) : null;
  const upcomingFrom = startOfToday().getTime();

  return reservations
    .slice(0, limit)
    .filter((reservation) => {
      if (filters.status !== 'all' && reservation.status !== filters.status) return false;

      if (
        normalizedQuery &&
        reservation.phone_number &&
        !reservation.phone_number.replace(/\D/g, '').includes(normalizedQuery)
      ) {
        return false;
      }

      const reservedAt = new Date(reservation.reserved_at).getTime();
      if (from && reservedAt < from.getTime()) return false;
      if (to && reservedAt > to.getTime()) return false;

      if (filters.range === 'upcoming' && reservedAt < upcomingFrom) {
        return false;
      }

      return true;
    });
}

export function groupReservationsByDate(
  reservations: Reservation[],
): Map<string, Reservation[]> {
  const groups = new Map<string, Reservation[]>();

  for (const reservation of reservations) {
    const date = new Date(reservation.reserved_at);
    const dateKey = date.toLocaleDateString('es-SV', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    if (!groups.has(dateKey)) {
      groups.set(dateKey, []);
    }
    groups.get(dateKey)!.push(reservation);
  }

  // Sort by actual date, not alphabetically
  const sortedGroups = Array.from(groups.entries()).sort(
    ([, a], [, b]) =>
      new Date(a[0].reserved_at).getTime() - new Date(b[0].reserved_at).getTime(),
  );

  return new Map(sortedGroups);
}
