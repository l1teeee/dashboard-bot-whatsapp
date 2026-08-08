import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { filterReservations, parseLocalDateBoundary } from './filterReservations';
import type { FilterState } from './filterReservations';
import type { Reservation } from '@/types/reservation';

beforeAll(() => {
  vi.stubEnv('TZ', 'America/El_Salvador');
});

afterAll(() => {
  vi.unstubAllEnvs();
});

const makeReservation = (
  id: number,
  reserved_at: string,
  status: string = 'pending',
): Reservation => ({
  id,
  reserved_at,
  customer_name: `Cliente ${id}`,
  party_size: 2,
  status: status as any,
  phone_number: '+503 7000-0000',
  notes: null,
  source: 'dashboard',
  created_at: '2026-08-01T12:00:00Z',
  updated_at: '2026-08-01T12:00:00Z',
});

describe('local reservation date filters', () => {
  it('constructs local start and end boundaries without UTC date parsing', () => {
    expect(Intl.DateTimeFormat().resolvedOptions().timeZone).toBe('America/El_Salvador');
    expect(parseLocalDateBoundary('2026-08-01')?.toISOString()).toBe('2026-08-01T06:00:00.000Z');
    expect(parseLocalDateBoundary('2026-08-01', true)?.toISOString()).toBe(
      '2026-08-02T05:59:59.999Z',
    );
  });

  it('includes the entire selected local day but not the previous or next day', () => {
    const reservations = [
      makeReservation(1, '2026-08-01T05:59:59.999Z'),
      makeReservation(2, '2026-08-01T06:00:00.000Z'),
      makeReservation(3, '2026-08-02T05:59:59.999Z'),
      makeReservation(4, '2026-08-02T06:00:00.000Z'),
    ];
    const filters: FilterState = {
      status: 'all',
      phone: '',
      from: '2026-08-01',
      to: '2026-08-01',
      range: 'all',
    };

    expect(filterReservations(reservations, filters).map((r) => r.id)).toEqual([2, 3]);
  });

  it('filters by status correctly', () => {
    const reservations = [
      makeReservation(1, '2026-08-15T19:00:00Z', 'pending'),
      makeReservation(2, '2026-08-16T19:00:00Z', 'confirmed'),
      makeReservation(3, '2026-08-17T19:00:00Z', 'pending'),
    ];
    const filters: FilterState = {
      status: 'pending',
      phone: '',
      from: '',
      to: '',
      range: 'all',
    };

    const result = filterReservations(reservations, filters);
    expect(result.map((r) => r.id)).toEqual([1, 3]);
  });

  it('filters upcoming reservations correctly', () => {
    const now = new Date();
    const future = new Date(now.getTime() + 86400000); // Tomorrow
    const past = new Date(now.getTime() - 86400000); // Yesterday

    const reservations = [
      makeReservation(1, past.toISOString()),
      makeReservation(2, future.toISOString()),
    ];

    const filters: FilterState = {
      status: 'all',
      phone: '',
      from: '',
      to: '',
      range: 'upcoming',
    };

    const result = filterReservations(reservations, filters);
    expect(result.map((r) => r.id)).toEqual([2]);
  });
});
