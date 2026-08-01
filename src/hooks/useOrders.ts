import { useQuery } from '@tanstack/react-query';
import { getOrders } from '@/api/orders';
import { queryKeys } from '@/lib/queryKeys';

export function useOrders() {
  const query = useQuery({
    queryKey: queryKeys.orders({ limit: 100 }),
    queryFn: () => getOrders({ limit: 100 }),
    refetchInterval: 15_000,
    refetchIntervalInBackground: false,
    retry: 2,
  });

  return {
    orders: query.data?.orders ?? [],
    total: query.data?.total ?? 0,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    isFetching: query.isFetching,
  };
}
