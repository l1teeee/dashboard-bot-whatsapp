import { useQuery } from '@tanstack/react-query';
import { getBusinessDay } from '@/api/orders';
import { queryKeys } from '@/lib/queryKeys';

export function useBusinessDay() {
  const query = useQuery({
    queryKey: queryKeys.businessDay(),
    queryFn: getBusinessDay,
    refetchInterval: 15_000,
    refetchIntervalInBackground: false,
  });

  return {
    businessDay: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}
