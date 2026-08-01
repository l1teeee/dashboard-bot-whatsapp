import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateOrderPosition } from '@/api/orders';
import { queryKeys } from '@/lib/queryKeys';
import { reorderOrdersInStatus } from '@/lib/reorderOrders';
import type { OrderStatus, PaginatedOrders } from '@/types/order';
import { ApiError, NetworkError } from '@/types/api';
import toast from 'react-hot-toast';

interface ReorderOrderParams { id: number; position: number; status: OrderStatus; }

export function useReorderOrder() {
  const queryClient = useQueryClient();
  const listKey = queryKeys.orders({ limit: 100 });
  return useMutation({
    mutationFn: ({ id, position }: ReorderOrderParams) => updateOrderPosition(id, position),
    onMutate: async ({ id, position, status }) => {
      await queryClient.cancelQueries({ queryKey: listKey });
      const previous = queryClient.getQueryData<PaginatedOrders>(listKey);
      if (previous) {
        queryClient.setQueryData<PaginatedOrders>(listKey, {
          ...previous,
          orders: reorderOrdersInStatus(previous.orders, status, id, position),
        });
      }
      return { previous };
    },
    onError: (error, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(listKey, context.previous);
      const message = error instanceof ApiError ? error.message : error instanceof NetworkError ? 'Sin conexion con el servidor' : 'Error al reordenar el pedido';
      toast.error(message);
    },
    onSettled: () => { queryClient.invalidateQueries({ queryKey: ['orders'] }); },
  });
}
