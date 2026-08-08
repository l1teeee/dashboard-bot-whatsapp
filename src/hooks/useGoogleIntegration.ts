import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  getGoogleIntegrationStatus,
  getGoogleConnectUrl,
  disconnectGoogleIntegration,
} from '@/api/integrations';
import { queryKeys } from '@/lib/queryKeys';
import { ApiError, NetworkError } from '@/types/api';

export function useGoogleIntegrationStatus() {
  const query = useQuery({
    queryKey: queryKeys.googleIntegration(),
    queryFn: getGoogleIntegrationStatus,
    retry: 2,
  });

  return {
    status: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

export function useGoogleConnect() {
  return useMutation({
    mutationFn: getGoogleConnectUrl,
    onSuccess: (data) => {
      window.location.href = data.url;
    },
    onError: (error: Error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useGoogleDisconnect() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: disconnectGoogleIntegration,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.googleIntegration() });
      toast.success('Google Calendar desconectado exitosamente');
    },
    onError: (error: Error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

function getErrorMessage(error: Error): string {
  if (error instanceof ApiError) {
    if (error.code === 'INTEGRATION_NOT_CONFIGURED') {
      return 'El administrador aun no ha configurado las credenciales de Google en el servidor';
    }
    return error.message;
  }
  if (error instanceof NetworkError) return 'Sin conexion con el servidor';
  return 'Error desconocido';
}
