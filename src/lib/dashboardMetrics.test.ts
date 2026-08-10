import { describe, expect, it } from 'vitest';
import { getDashboardMetrics } from './dashboardMetrics';
import type { Order } from '@/types/order';
const order = (id:number, status:Order['status'], total:number, created_at:string):Order => ({ id, status, total, created_at, updated_at:created_at, phone_number:'50370000000', items:[], notes:null, position:id, business_day:null, daily_number:null });
describe('getDashboardMetrics', () => {
  const now = new Date('2026-08-01T12:00:00');
  it('uses only completed orders for revenue and leaves source untouched', () => { const orders=[order(1,'completed',20,'2026-08-01T09:00:00'),order(2,'pending',80,'2026-07-29T09:00:00')]; const before=orders.map(item=>item.id); const metrics=getDashboardMetrics(orders,now); expect(metrics.completedRevenue).toBe(20); expect(metrics.averageTicket).toBe(20); expect(orders.map(item=>item.id)).toEqual(before); });
  it('avoids division by zero and produces seven daily buckets including gaps', () => { const metrics=getDashboardMetrics([],now); expect(metrics.averageTicket).toBe(0); expect(metrics.last7Days).toHaveLength(7); expect(metrics.last7Days.every(day=>day.orders===0)).toBe(true); });
  it('counts every status and picks the oldest pending order', () => { const orders=[order(1,'pending',5,'2026-07-31T10:00:00'),order(2,'pending',5,'2026-07-27T10:00:00'),order(3,'processing',5,'2026-07-31T10:00:00'),order(4,'completed',5,'2026-07-31T10:00:00'),order(5,'cancelled',5,'2026-07-31T10:00:00')]; const metrics=getDashboardMetrics(orders,now); expect(metrics.statusCounts).toEqual({pending:2,processing:1,completed:1,cancelled:1}); expect(metrics.oldestPending?.id).toBe(2); });
});
