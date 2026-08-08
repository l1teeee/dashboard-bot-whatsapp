import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  updateReservationStatus,
  updateReservation,
  createReservation,
  deleteReservation,
} from '@/api/reservations';
import { queryKeys } from '@/lib/queryKeys';
import { STATUS_META } from '@/lib/reservationStatus';
import { ApiError, NetworkError } from '@/types/api';
import type { ReservationStatusUpdate } from '@/types/reservation';

export function useUpdateReservationStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status, notes }: { id: number; status: ReservationStatusUpdate; notes?: string }) =>
      updateReservationStatus(id, { status, notes }),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.reservation(updated.id) });
      toast.success(`Reserva #${updated.id}: ${STATUS_META[updated.status].label}`);
    },
    onError: (error) => {
      let message = 'Error al actualizar la reserva';
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

export function useCreateReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: {
      customer_name: string;
      party_size: number;
      reserved_at: string;
      phone_number?: string;
      notes?: string;
    }) => createReservation(payload),
    onSuccess: (reservation) => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      toast.success(`Reserva #${reservation.id} creada exitosamente`);
    },
    onError: (error: Error) => toast.error(getErrorMessage(error)),
  });
}

export function useUpdateReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: {
        customer_name?: string;
        party_size?: number;
        reserved_at?: string;
        notes?: string;
      };
    }) => updateReservation(id, payload),
    onSuccess: (reservation) => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.reservation(reservation.id) });
      toast.success('Reserva actualizada exitosamente');
    },
    onError: (error: Error) => toast.error(getErrorMessage(error)),
  });
}

export function useDeleteReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteReservation(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      toast.success(`Reserva #${data.id} eliminada exitosamente`);
    },
    onError: (error: Error) => toast.error(getErrorMessage(error)),
  });
}

function getErrorMessage(error: Error): string {
  if (error instanceof ApiError) {
    return error.code === 'VALIDATION_ERROR'
      ? `Datos invalidos: ${error.message}`
      : error.message;
  }
  if (error instanceof NetworkError) return 'Sin conexion con el servidor';
  return 'Error desconocido';
}
