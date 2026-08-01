import { Card, CardBody } from '@/components/ui';
import { StatusBadge } from './StatusBadge';
import { StatusChangeButton } from './StatusChangeButton';
import { STATUS_META } from '@/lib/orderStatus';
import { ORDER_STATUS_TRANSITIONS } from '@/types/order';
import { formatCurrency, formatRelativeTime, formatPhone } from '@/lib/format';
import type { Order } from '@/types/order';

interface OrderCardProps {
  order: Order;
  onClick: (id: number) => void;
}

export function OrderCard({ order, onClick }: OrderCardProps) {
  const column = STATUS_META[order.status].column;
  const transitions = ORDER_STATUS_TRANSITIONS[order.status];
  const isTerminal = transitions.length === 0;

  const itemsDisplay = order.items.slice(0, 3).map((item) => `${item.quantity}x ${item.name}`);
  if (order.items.length > 3) {
    itemsDisplay.push(`+${order.items.length - 3} mas`);
  }

  return (
    <Card
      interactive
      accent={column}
      className="cursor-pointer"
      onClick={() => onClick(order.id)}
    >
      <CardBody className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-xl font-bold text-ink">#{order.id}</h3>
          <StatusBadge status={order.status} size="sm" />
        </div>

        <p className="text-sm text-ink-soft">{formatPhone(order.phone_number)}</p>

        <div className="space-y-1">
          {itemsDisplay.map((item, i) => (
            <p key={i} className="text-sm text-ink-soft">
              {item}
            </p>
          ))}
        </div>

        <div className="flex items-baseline justify-between pt-2 border-t border-border">
          <p className="text-lg font-semibold text-ink">{formatCurrency(order.total)}</p>
          <p className="text-sm text-ink-soft">{formatRelativeTime(order.created_at)}</p>
        </div>

        {!isTerminal && (
          <div className="flex gap-2 pt-2">
            {transitions.map((target) => (
              <StatusChangeButton
                key={target}
                orderId={order.id}
                target={target}
                size="sm"
                fullWidth
              />
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
}
