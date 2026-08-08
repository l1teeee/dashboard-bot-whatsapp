import { useState } from 'react';
import { Modal, Input, Button, Textarea } from '@/components/ui';
import { useCreateReservation, useUpdateReservation } from '@/hooks/useReservationMutations';
import type { Reservation } from '@/types/reservation';

interface ReservationFormProps {
  open: boolean;
  onClose: () => void;
  initialData?: Reservation;
}

export function ReservationForm({ open, onClose, initialData }: ReservationFormProps) {
  const [formData, setFormData] = useState({
    customer_name: initialData?.customer_name || '',
    party_size: initialData?.party_size || 1,
    reserved_at: initialData?.reserved_at.split('T')[0] || '',
    reserved_time: initialData?.reserved_at.split('T')[1]?.slice(0, 5) || '19:00',
    phone_number: initialData?.phone_number || '',
    notes: initialData?.notes || '',
  });

  const createMutation = useCreateReservation();
  const updateMutation = useUpdateReservation();
  const isLoading = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.customer_name || !formData.reserved_at || !formData.reserved_time) {
      return;
    }

    const reserved_at = `${formData.reserved_at}T${formData.reserved_time}:00Z`;

    if (initialData) {
      updateMutation.mutate({
        id: initialData.id,
        payload: {
          customer_name: formData.customer_name,
          party_size: formData.party_size,
          reserved_at,
          notes: formData.notes || undefined,
        },
      });
    } else {
      createMutation.mutate({
        customer_name: formData.customer_name,
        party_size: formData.party_size,
        reserved_at,
        phone_number: formData.phone_number || undefined,
        notes: formData.notes || undefined,
      });
    }

    if (!createMutation.isPending && !updateMutation.isPending) {
      onClose();
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initialData ? 'Editar reserva' : 'Nueva reserva'}
      size="md"
      footer={
        <div className="grid gap-2 sm:grid-cols-2">
          <Button variant="secondary" fullWidth onClick={onClose}>
            Cancelar
          </Button>
          <Button fullWidth onClick={handleSubmit} isLoading={isLoading}>
            {initialData ? 'Guardar cambios' : 'Crear reserva'}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nombre del cliente"
          value={formData.customer_name}
          onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
          placeholder="Ej.: Juan Garcia"
          required
          minLength={2}
          maxLength={80}
        />

        <div className="grid gap-3 sm:grid-cols-2">
          <Input
            label="Numero de personas"
            type="number"
            value={formData.party_size}
            onChange={(e) => setFormData({ ...formData, party_size: Math.max(1, Number(e.target.value)) })}
            min={1}
            max={50}
            required
          />
          <Input
            label="Telefono"
            type="tel"
            value={formData.phone_number}
            onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
            placeholder="+503 1234-5678"
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Input
            label="Fecha"
            type="date"
            value={formData.reserved_at}
            onChange={(e) => setFormData({ ...formData, reserved_at: e.target.value })}
            required
          />
          <Input
            label="Hora"
            type="time"
            value={formData.reserved_time}
            onChange={(e) => setFormData({ ...formData, reserved_time: e.target.value })}
            required
          />
        </div>

        <Textarea
          label="Notas (opcional)"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Ej.: Alergia a mariscos, preferencia de ubicacion..."
          maxLength={500}
        />
      </form>
    </Modal>
  );
}
