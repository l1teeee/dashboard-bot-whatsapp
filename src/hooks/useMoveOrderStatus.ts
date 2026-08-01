import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateOrderStatus } from '@/api/orders';
import { queryKeys } from '@/lib/queryKeys';
import { STATUS_META } from '@/lib/orderStatus';
import type { OrderStatusUpdate, PaginatedOrders } from '@/types/order';
import { ApiError, NetworkError } from '@/types/api';
import toast from 'react-hot-toast';

interface MoveOrderStatusParams {
  id: number;
  status: OrderStatusUpdate;
}

export function useMoveOrderStatus() {
  const queryClient = useQueryClient();
  const listKey = queryKeys.orders({ limit: 100 });

  return useMutation({
    mutationFn: ({ id, status }: MoveOrderStatusParams) =>
      updateOrderStatus(id, { status }),

    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: listKey });
      const previous = queryClient.getQueryData<PaginatedOrders>(listKey);

      if (previous) {
        queryClient.setQueryData<PaginatedOrders>(listKey, {
          ...previous,
          orders: previous.orders.map((o) =>
            o.id === id ? { ...o, status } : o,
          ),
        });
      }

      return { previous };
    },

    onError: (error, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(listKey, context.previous);
      }

      let message = 'Error al cambiar el estado del pedido';

      if (error instanceof ApiError) {
        if (error.code === 'INVALID_STATE_TRANSITION') {
          message = 'Ese cambio de estado no esta permitido';
        } else {
          message = error.message;
        }
      } else if (error instanceof NetworkError) {
        message = 'Sin conexion con el servidor';
      }

      toast.error(message);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },

    onSuccess: (_data, vars) => {
      const label = STATUS_META[vars.status].label;
      toast.success(`Pedido #${vars.id}: ${label}`);
    },
  });
}
