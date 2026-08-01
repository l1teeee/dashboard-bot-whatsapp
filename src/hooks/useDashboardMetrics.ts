import { useMemo } from 'react'; import { getDashboardMetrics } from '@/lib/dashboardMetrics'; import type { Order } from '@/types/order';
export function useDashboardMetrics(orders:Order[]){return useMemo(()=>getDashboardMetrics(orders),[orders]);}
