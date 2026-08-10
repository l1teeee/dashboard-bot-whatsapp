import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateOrderStatus } from '@/api/orders';
import { queryKeys } from '@/lib/queryKeys';
import { STATUS_META } from '@/lib/orderStatus';
import { formatOrderNumber } from '@/components/orders/orderNumber';
import type { OrderStatusUpdate } from '@/types/order';
import { ApiError, NetworkError } from '@/types/api';
import toast from 'react-hot-toast';

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status, notes }: { id: number; status: OrderStatusUpdate; notes?: string }) =>
      updateOrderStatus(id, { status, notes }),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.order(updated.id) });
      toast.success(`Pedido ${formatOrderNumber(updated)}: ${STATUS_META[updated.status].label}`);
    },
    onError: (error) => {
      let message = 'Error al actualizar el pedido';
      if (error instanceof ApiError) {
        message =
          error.code === 'INVALID_STATE_TRANSITION'
            ? 'Ese cambio de estado no esta permitido'
            : error.message;
      } else if (error instanceof NetworkError) {
        message = 'Sin conexion con el servidor';
      } else if (error instanceof Error) {
        message = error.message;
      }
      toast.error(message);
    },
  });
}
