import type { Order, OrderStatus } from '@/types/order';

export function reorderOrdersInStatus(
  orders: Order[],
  status: OrderStatus,
  id: number,
  targetPosition: number,
): Order[] {
  const column = orders
    .filter((order) => order.status === status)
    .sort((a, b) => a.position - b.position || a.id - b.id);
  const dragged = column.find((order) => order.id === id);
  if (!dragged) return orders;

  const withoutDragged = column.filter((order) => order.id !== id);
  const position = Math.max(0, Math.min(targetPosition, withoutDragged.length));
  const reordered = [
    ...withoutDragged.slice(0, position),
    dragged,
    ...withoutDragged.slice(position),
  ];
  const positions = new Map(reordered.map((order, index) => [order.id, index]));

  return orders.map((order) => {
    const nextPosition = positions.get(order.id);
    return nextPosition === undefined ? order : { ...order, position: nextPosition };
  });
}
