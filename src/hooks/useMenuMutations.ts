import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { createMenuItem, updateMenuItem } from '@/api/menu';
import { queryKeys } from '@/lib/queryKeys';
import { useMenuOverlayStore } from '@/store/menuOverlay';
import { ApiError, NetworkError } from '@/types/api';
import type { MenuItem, CreateMenuItemInput, UpdateMenuItemInput } from '@/types/menu';

export function useCreateMenuItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateMenuItemInput) => createMenuItem(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.menu() });
      toast.success('Item creado exitosamente');
    },
    onError: (error: Error) => {
      const message = getErrorMessage(error);
      toast.error(message);
    },
  });
}

export function useUpdateMenuItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, input }: { id: number; input: UpdateMenuItemInput }) =>
      updateMenuItem(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.menu() });
      toast.success('Item actualizado exitosamente');
    },
    onError: (error: Error) => {
      const message = getErrorMessage(error);
      toast.error(message);
    },
  });
}

export function useToggleMenuItem() {
  const queryClient = useQueryClient();
  const { remember, forget } = useMenuOverlayStore();

  return useMutation({
    mutationFn: async ({ item, available }: { item: MenuItem; available: boolean }) => {
      return updateMenuItem(item.id, { available });
    },
    onMutate: async ({ item, available }) => {
      if (!available) {
        remember({ ...item, available: false });
      }
    },
    onSuccess: (data, { available }) => {
      if (available) {
        forget(data.id);
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.menu() });
      const action = available ? 'activado' : 'desactivado';
      toast.success(`Item ${action} exitosamente`);
    },
    onError: (error: Error, { item }) => {
      if (!item.available) {
        forget(item.id);
      }
      const message = getErrorMessage(error);
      toast.error(message);
    },
  });
}

function getErrorMessage(error: Error): string {
  if (error instanceof ApiError) {
    if (error.code === 'VALIDATION_ERROR') {
      return `Datos invalidos: ${error.message}`;
    }
    return error.message;
  }
  if (error instanceof NetworkError) {
    return 'Sin conexion con el servidor';
  }
  return 'Error desconocido';
}
