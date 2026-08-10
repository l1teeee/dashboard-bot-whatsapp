import { useMutation, useQueryClient } from '@tanstack/react-query';
import { closeBusinessDay } from '@/api/orders';
import { queryKeys } from '@/lib/queryKeys';
import { ApiError, NetworkError } from '@/types/api';
import toast from 'react-hot-toast';

export function useCloseBusinessDay() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: closeBusinessDay,
    onSuccess: (result) => {
      if (result.already_closed) {
        toast.success('Esa jornada ya estaba cerrada');
      } else {
        toast.success('Jornada cerrada. Los proximos pedidos empiezan de nuevo desde el 1');
      }
    },
    onError: (error) => {
      let message = 'Error al cerrar la jornada';
      if (error instanceof ApiError) {
        message = error.message;
      } else if (error instanceof NetworkError) {
        message = 'Sin conexion con el servidor';
      }
      toast.error(message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.businessDay() });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}
