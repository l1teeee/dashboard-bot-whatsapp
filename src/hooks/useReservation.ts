import { useQuery } from '@tanstack/react-query';
import { getReservationById } from '@/api/reservations';
import { queryKeys } from '@/lib/queryKeys';

export function useReservation(id: number | null) {
  const query = useQuery({
    queryKey: queryKeys.reservation(id ?? 0),
    queryFn: () => getReservationById(id!),
    enabled: id !== null,
    retry: 2,
  });

  return {
    reservation: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
