import { moveElement, verticalCompactor } from 'react-grid-layout';
import type { Layout, LayoutItem } from 'react-grid-layout';

export const DASHBOARD_LAYOUT_STORAGE_KEY = 'whatsapp-dashboard:analytics-layout:v1';
export const DASHBOARD_COLUMNS = 12;
export const DASHBOARD_ROW_HEIGHT = 24;
export const DASHBOARD_GRID_GAP = 20;
export const DASHBOARD_DESKTOP_MIN_WIDTH = 900;

export const DASHBOARD_WIDGET_IDS = [
  'revenue',
  'order-flow',
  'queue',
  'status-mix',
  'recent-orders',
] as const;

export type DashboardWidgetId = (typeof DASHBOARD_WIDGET_IDS)[number];

export const DASHBOARD_WIDGET_LABELS: Record<DashboardWidgetId, string> = {
  revenue: 'Ingresos completados',
  'order-flow': 'Flujo de pedidos',
  queue: 'Cola prioritaria',
  'status-mix': 'Estados del lote',
  'recent-orders': 'Pedidos recientes',
};

export const DEFAULT_DASHBOARD_LAYOUT: Layout = [
  { i: 'revenue', x: 0, y: 0, w: 7, h: 9, minW: 5, minH: 9, maxW: 12, maxH: 14 },
  { i: 'order-flow', x: 7, y: 0, w: 5, h: 9, minW: 4, minH: 8, maxW: 12, maxH: 14 },
  { i: 'queue', x: 0, y: 9, w: 4, h: 7, minW: 3, minH: 6, maxW: 12, maxH: 12 },
  { i: 'status-mix', x: 4, y: 9, w: 4, h: 7, minW: 3, minH: 7, maxW: 12, maxH: 12 },
  { i: 'recent-orders', x: 8, y: 9, w: 4, h: 9, minW: 3, minH: 9, maxW: 12, maxH: 16 },
];

type StoredLayout = {
  version: 1;
  items: Array<Pick<LayoutItem, 'i' | 'x' | 'y' | 'w' | 'h'>>;
};

type ReadableStorage = Pick<Storage, 'getItem'>;
type WritableStorage = Pick<Storage, 'setItem'>;

export type DashboardLayoutAction =
  | { type: 'move'; dx: number; dy: number }
  | { type: 'resize'; dw: number; dh: number };

const cloneDefaultLayout = (): LayoutItem[] => DEFAULT_DASHBOARD_LAYOUT.map((item) => ({ ...item }));

const isFiniteInteger = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value) && Number.isInteger(value);

function restoreConstraints(items: StoredLayout['items']): LayoutItem[] | null {
  if (items.length !== DEFAULT_DASHBOARD_LAYOUT.length) return null;

  const restored: LayoutItem[] = [];
  for (const defaults of DEFAULT_DASHBOARD_LAYOUT) {
    const item = items.find((candidate) => candidate.i === defaults.i);
    if (!item) return null;

    const valuesAreValid = [item.x, item.y, item.w, item.h].every(isFiniteInteger);
    if (!valuesAreValid || item.x < 0 || item.y < 0 || item.y > 100 || item.w < 1 || item.h < 1) return null;

    const minW = defaults.minW ?? 1;
    const minH = defaults.minH ?? 1;
    const maxW = defaults.maxW ?? DASHBOARD_COLUMNS;
    const maxH = defaults.maxH ?? Number.POSITIVE_INFINITY;
    if (item.w < minW || item.w > maxW || item.h < minH || item.h > maxH || item.x + item.w > DASHBOARD_COLUMNS) {
      return null;
    }

    restored.push({ ...defaults, x: item.x, y: item.y, w: item.w, h: item.h });
  }

  return verticalCompactor.compact(restored, DASHBOARD_COLUMNS).map((item) => ({ ...item }));
}

export function loadDashboardLayout(storage?: ReadableStorage): LayoutItem[] {
  if (!storage) return cloneDefaultLayout();

  try {
    const raw = storage.getItem(DASHBOARD_LAYOUT_STORAGE_KEY);
    if (!raw) return cloneDefaultLayout();

    const parsed = JSON.parse(raw) as Partial<StoredLayout>;
    if (parsed.version !== 1 || !Array.isArray(parsed.items)) return cloneDefaultLayout();

    return restoreConstraints(parsed.items as StoredLayout['items']) ?? cloneDefaultLayout();
  } catch {
    return cloneDefaultLayout();
  }
}

export function saveDashboardLayout(layout: Layout, storage?: WritableStorage): void {
  if (!storage) return;

  const payload: StoredLayout = {
    version: 1,
    items: layout.map(({ i, x, y, w, h }) => ({ i, x, y, w, h })),
  };

  try {
    storage.setItem(DASHBOARD_LAYOUT_STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // El dashboard sigue siendo utilizable aunque el navegador bloquee localStorage.
  }
}

export function isDefaultDashboardLayout(layout: Layout): boolean {
  return DEFAULT_DASHBOARD_LAYOUT.every((defaults) => {
    const item = layout.find((candidate) => candidate.i === defaults.i);
    return Boolean(
      item
      && item.x === defaults.x
      && item.y === defaults.y
      && item.w === defaults.w
      && item.h === defaults.h,
    );
  });
}

export function resetDashboardLayout(): LayoutItem[] {
  return cloneDefaultLayout();
}

export function updateDashboardLayout(
  layout: Layout,
  widgetId: DashboardWidgetId,
  action: DashboardLayoutAction,
): LayoutItem[] {
  const cloned = layout.map((item) => ({ ...item }));
  const item = cloned.find((candidate) => candidate.i === widgetId);
  if (!item) return cloned;

  if (action.type === 'move') {
    const x = Math.max(0, Math.min(DASHBOARD_COLUMNS - item.w, item.x + action.dx));
    const y = Math.max(0, item.y + action.dy);
    if (x === item.x && y === item.y) return cloned;

    const moved = moveElement(cloned, item, x, y, true, false, 'vertical', DASHBOARD_COLUMNS, false);
    return verticalCompactor.compact(moved, DASHBOARD_COLUMNS).map((candidate) => ({ ...candidate }));
  }

  const minW = item.minW ?? 1;
  const minH = item.minH ?? 1;
  const maxW = Math.min(item.maxW ?? DASHBOARD_COLUMNS, DASHBOARD_COLUMNS - item.x);
  const maxH = item.maxH ?? Number.POSITIVE_INFINITY;
  const w = Math.max(minW, Math.min(maxW, item.w + action.dw));
  const h = Math.max(minH, Math.min(maxH, item.h + action.dh));
  if (w === item.w && h === item.h) return cloned;

  item.w = w;
  item.h = h;
  return verticalCompactor.compact(cloned, DASHBOARD_COLUMNS).map((candidate) => ({ ...candidate }));
}
