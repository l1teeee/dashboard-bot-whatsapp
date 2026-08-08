import { useQuery } from '@tanstack/react-query';
import { getReservations } from '@/api/reservations';
import { queryKeys } from '@/lib/queryKeys';

export function useReservations() {
  const query = useQuery({
    queryKey: queryKeys.reservations({ limit: 100 }),
    queryFn: () => getReservations({ limit: 100 }),
    refetchInterval: 15_000,
    refetchIntervalInBackground: false,
    retry: 2,
  });

  return {
    reservations: query.data?.reservations ?? [],
    total: query.data?.total ?? 0,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    isFetching: query.isFetching,
  };
}
