import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { createMenuItem, updateMenuItem } from '@/api/menu';
import { queryKeys } from '@/lib/queryKeys';
import { useMenuOverlayStore } from '@/store/menuOverlay';
import { ApiError, NetworkError } from '@/types/api';
import type { MenuItem, CreateMenuItemInput, UpdateMenuItemInput } from '@/types/menu';

function syncOverlay(item: MenuItem) {
  const { remember, forget } = useMenuOverlayStore.getState();
  if (item.available) forget(item.id);
  else remember({ ...item, available: false });
}

export function useCreateMenuItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateMenuItemInput) => createMenuItem(input),
    onSuccess: (item) => {
      syncOverlay(item);
      queryClient.invalidateQueries({ queryKey: queryKeys.menu() });
      toast.success('Item creado exitosamente');
    },
    onError: (error: Error) => toast.error(getErrorMessage(error)),
  });
}

export function useUpdateMenuItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: UpdateMenuItemInput }) => updateMenuItem(id, input),
    onSuccess: (item) => {
      syncOverlay(item);
      queryClient.invalidateQueries({ queryKey: queryKeys.menu() });
      toast.success('Item actualizado exitosamente');
    },
    onError: (error: Error) => toast.error(getErrorMessage(error)),
  });
}

export function useToggleMenuItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ item, available }: { item: MenuItem; available: boolean }) => updateMenuItem(item.id, { available }),
    onMutate: async ({ item, available }) => {
      const previousOverlayItem = useMenuOverlayStore.getState().hiddenItems[item.id];
      if (!available) useMenuOverlayStore.getState().remember({ ...item, available: false });
      return { previousOverlayItem };
    },
    onSuccess: (item) => {
      syncOverlay(item);
      queryClient.invalidateQueries({ queryKey: queryKeys.menu() });
      toast.success(`Item ${item.available ? 'activado' : 'desactivado'} exitosamente`);
    },
    onError: (error: Error, variables, context) => {
      const { remember, forget } = useMenuOverlayStore.getState();
      if (context?.previousOverlayItem) remember(context.previousOverlayItem);
      else if (!variables.available) forget(variables.item.id);
      toast.error(getErrorMessage(error));
    },
  });
}

function getErrorMessage(error: Error): string {
  if (error instanceof ApiError) return error.code === 'VALIDATION_ERROR' ? `Datos invalidos: ${error.message}` : error.message;
  if (error instanceof NetworkError) return 'Sin conexion con el servidor';
  return 'Error desconocido';
}
