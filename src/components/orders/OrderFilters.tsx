import { Input, Select, Button } from '@/components/ui';
import { STATUS_ORDER } from '@/lib/orderStatus';
import type { OrderStatus } from '@/types/order';

export interface FilterState {
  status: OrderStatus | 'all';
  phone: string;
  from: string;
  to: string;
}

interface OrderFiltersProps {
  value: FilterState;
  onChange: (next: FilterState) => void;
  onReset: () => void;
}

export function OrderFilters({ value, onChange, onReset }: OrderFiltersProps) {
  const statusOptions = [
    { value: 'all', label: 'Todos los estados' },
    ...STATUS_ORDER.map((status) => {
      const labels: Record<OrderStatus, string> = {
        pending: 'Pendiente',
        processing: 'En proceso',
        completed: 'Completado',
        cancelled: 'Cancelado',
      };
      return { value: status, label: labels[status] };
    }),
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
      <Select
        label="Estado"
        value={value.status}
        options={statusOptions}
        onChange={(e) => onChange({ ...value, status: e.target.value as OrderStatus | 'all' })}
      />
      <Input
        label="Buscar por telefono"
        placeholder="Ej: 1234567890"
        value={value.phone}
        onChange={(e) => onChange({ ...value, phone: e.target.value })}
      />
      <Input
        label="Desde"
        type="date"
        value={value.from}
        onChange={(e) => onChange({ ...value, from: e.target.value })}
      />
      <Input
        label="Hasta"
        type="date"
        value={value.to}
        onChange={(e) => onChange({ ...value, to: e.target.value })}
      />
      <div className="flex items-end">
        <Button variant="ghost" fullWidth onClick={onReset}>
          Limpiar filtros
        </Button>
      </div>
    </div>
  );
}
