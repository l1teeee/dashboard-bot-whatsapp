import { Badge } from '@/components/ui';
import { STATUS_META } from '@/lib/orderStatus';
import type { OrderStatus } from '@/types/order';

interface StatusBadgeProps {
  status: OrderStatus;
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const meta = STATUS_META[status];
  return (
    <Badge tone={status} size={size}>
      {meta.label}
    </Badge>
  );
}
