import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteOrder } from '@/api/orders';
import { queryKeys } from '@/lib/queryKeys';
import type { PaginatedOrders } from '@/types/order';
import { ApiError, NetworkError } from '@/types/api';
import toast from 'react-hot-toast';

interface DeleteOrderParams {
  id: number;
}

export function useDeleteOrder() {
  const queryClient = useQueryClient();
  const listKey = queryKeys.orders({ limit: 100 });

  return useMutation({
    mutationFn: ({ id }: DeleteOrderParams) =>
      deleteOrder(id),

    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey: listKey });
      const previous = queryClient.getQueryData<PaginatedOrders>(listKey);

      if (previous) {
        queryClient.setQueryData<PaginatedOrders>(listKey, {
          ...previous,
          orders: previous.orders.filter((o) => o.id !== id),
          total: previous.total - 1,
        });
      }

      return { previous };
    },

    onError: (error, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(listKey, context.previous);
      }

      let message = 'Error al eliminar el pedido';

      if (error instanceof ApiError) {
        message = error.message;
      } else if (error instanceof NetworkError) {
        message = 'Sin conexion con el servidor';
      }

      toast.error(message);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}
