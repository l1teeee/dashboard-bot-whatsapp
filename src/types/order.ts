export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled';

export type OrderStatusUpdate = Exclude<OrderStatus, 'pending'>;

export const ORDER_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatusUpdate[]> = {
  pending: ['processing', 'cancelled'],
  processing: ['completed', 'cancelled'],
  completed: [],
  cancelled: [],
};

export interface OrderItem {
  menu_item_id: number;
  name: string;
  quantity: number;
  unit_price: number;
}

export interface Order {
  id: number;
  phone_number: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
  position: number;
}

export interface OrderLog {
  id: number;
  order_id: number;
  status_change: string;
  changed_at: string;
  notes: string | null;
}

export interface OrderWithLogs extends Order {
  logs: OrderLog[];
}

export interface PaginatedOrders {
  orders: Order[];
  total: number;
  limit: number;
  offset: number;
}

export interface OrdersQuery {
  status?: OrderStatus;
  phone_number?: string;
  limit?: number;
  offset?: number;
}
