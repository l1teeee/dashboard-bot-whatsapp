import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateOrderPosition } from '@/api/orders';
import { queryKeys } from '@/lib/queryKeys';
import type { OrderStatus, PaginatedOrders } from '@/types/order';
import { ApiError, NetworkError } from '@/types/api';
import toast from 'react-hot-toast';

interface ReorderOrderParams {
  id: number;
  position: number;
  status: OrderStatus;
}

export function useReorderOrder() {
  const queryClient = useQueryClient();
  const listKey = queryKeys.orders({ limit: 100 });

  return useMutation({
    mutationFn: ({ id, position }: ReorderOrderParams) =>
      updateOrderPosition(id, position),

    onMutate: async ({ id, position, status }) => {
      await queryClient.cancelQueries({ queryKey: listKey });
      const previous = queryClient.getQueryData<PaginatedOrders>(listKey);

      if (previous) {
        const itemsInColumn = previous.orders.filter((o) => o.status === status);
        const draggedItem = previous.orders.find((o) => o.id === id);
        const currentIndex = itemsInColumn.findIndex((o) => o.id === id);

        if (draggedItem && currentIndex !== -1) {
          const itemsWithoutDragged = itemsInColumn.filter((o) => o.id !== id);
          const newItemsInColumn = [
            ...itemsWithoutDragged.slice(0, position),
            draggedItem,
            ...itemsWithoutDragged.slice(position),
          ];

          const newOrders = previous.orders.map((o) => {
            if (o.status !== status) return o;
            const idx = newItemsInColumn.findIndex((item) => item.id === o.id);
            return idx !== -1 ? { ...o, position: idx } : o;
          });

          queryClient.setQueryData<PaginatedOrders>(listKey, {
            ...previous,
            orders: newOrders,
          });
        }
      }

      return { previous };
    },

    onError: (error, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(listKey, context.previous);
      }

      let message = 'Error al reordenar el pedido';

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
