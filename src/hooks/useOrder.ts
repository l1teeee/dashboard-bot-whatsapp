import { useQuery } from '@tanstack/react-query';
import { getOrderById } from '@/api/orders';
import { queryKeys } from '@/lib/queryKeys';

export function useOrder(id: number | null) {
  const query = useQuery({
    queryKey: queryKeys.order(id ?? 0),
    queryFn: () => getOrderById(id!),
    enabled: id !== null,
    retry: 2,
  });

  return {
    order: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
