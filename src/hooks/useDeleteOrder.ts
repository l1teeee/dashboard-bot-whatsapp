import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteOrder } from '@/api/orders';
import { queryKeys } from '@/lib/queryKeys';
import { formatOrderNumber } from '@/components/orders/orderNumber';
import type { OrderWithLogs, PaginatedOrders } from '@/types/order';
import { ApiError, NetworkError } from '@/types/api';
import toast from 'react-hot-toast';

interface DeleteOrderParams { id: number; }

export function useDeleteOrder() {
  const queryClient = useQueryClient();
  const listKey = queryKeys.orders({ limit: 100 });
  return useMutation({
    mutationFn: ({ id }: DeleteOrderParams) => deleteOrder(id),
    onMutate: async ({ id }) => {
      const detailKey = queryKeys.order(id);
      await Promise.all([
        queryClient.cancelQueries({ queryKey: listKey }),
        queryClient.cancelQueries({ queryKey: detailKey }),
      ]);
      const previous = queryClient.getQueryData<PaginatedOrders>(listKey);
      const previousDetail = queryClient.getQueryData<OrderWithLogs>(detailKey);
      if (previous) {
        queryClient.setQueryData<PaginatedOrders>(listKey, {
          ...previous,
          orders: previous.orders.filter((order) => order.id !== id),
          total: Math.max(0, previous.total - 1),
        });
      }
      queryClient.removeQueries({ queryKey: detailKey, exact: true });
      const deleted = previous?.orders.find((order) => order.id === id);
      return { previous, previousDetail, deleted };
    },
    onError: (error, vars, context) => {
      const detailKey = queryKeys.order(vars.id);
      if (context?.previous) queryClient.setQueryData(listKey, context.previous);
      if (context?.previousDetail) queryClient.setQueryData(detailKey, context.previousDetail);
      const message = error instanceof ApiError ? error.message : error instanceof NetworkError ? 'Sin conexion con el servidor' : 'Error al eliminar el pedido';
      toast.error(message);
      queryClient.invalidateQueries({ queryKey: detailKey });
    },
    onSuccess: (_data, vars, context) => {
      queryClient.removeQueries({ queryKey: queryKeys.order(vars.id), exact: true });
      const label = context?.deleted ? formatOrderNumber(context.deleted) : `#${vars.id}`;
      toast.success(`Pedido ${label} eliminado`);
    },
    onSettled: (_data, _error, vars) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.order(vars.id) });
    },
  });
}
