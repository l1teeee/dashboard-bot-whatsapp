import { useState } from 'react';
import { Button, ConfirmDialog } from '@/components/ui';
import { STATUS_META } from '@/lib/orderStatus';
import { useUpdateOrderStatus } from '@/hooks/useUpdateOrderStatus';
import { formatOrderNumber } from './orderNumber';
import type { Order, OrderStatusUpdate } from '@/types/order';

interface StatusChangeButtonProps {
  orderId: number;
  orderNumber?: Pick<Order, 'id' | 'daily_number'>;
  target: OrderStatusUpdate;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export function StatusChangeButton({
  orderId,
  orderNumber,
  target,
  size = 'md',
  fullWidth,
}: StatusChangeButtonProps) {
  const [open, setOpen] = useState(false);
  const mutation = useUpdateOrderStatus();

  const targetMeta = STATUS_META[target];

  const variantMap: Record<OrderStatusUpdate, 'primary' | 'success' | 'danger'> = {
    processing: 'primary',
    completed: 'success',
    cancelled: 'danger',
  };

  const handleConfirm = () => {
    mutation.mutate({ id: orderId, status: target });
    setOpen(false);
  };

  return (
    <>
      <Button
        variant={variantMap[target]}
        size={size}
        fullWidth={fullWidth}
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
      >
        {targetMeta.actionLabel}
      </Button>
      <ConfirmDialog
        open={open}
        title={`Cambiar estado del pedido ${orderNumber ? formatOrderNumber(orderNumber) : `#${orderId}`}`}
        description={`Cambiar a ${targetMeta.label}?`}
        confirmLabel={targetMeta.actionLabel}
        tone={target === 'cancelled' ? 'danger' : 'default'}
        isLoading={mutation.isPending}
        onConfirm={handleConfirm}
        onCancel={() => setOpen(false)}
      />
    </>
  );
}
