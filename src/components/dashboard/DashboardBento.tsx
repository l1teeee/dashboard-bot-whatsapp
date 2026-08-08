import { useCallback, useEffect, useMemo, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';
import { GripVertical, RotateCcw } from 'lucide-react';
import { GridLayout, useContainerWidth } from 'react-grid-layout';
import type { Layout, LayoutItem } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { Button } from '@/components/ui';
import type { getDashboardMetrics } from '@/lib/dashboardMetrics';
import { OrderFlowCard } from './OrderFlowCard';
import { QueueSpotlightCard } from './QueueSpotlightCard';
import { RecentOrdersCard } from './RecentOrdersCard';
import { RevenueOverviewCard } from './RevenueOverviewCard';
import { StatusMixCard } from './StatusMixCard';
import {
  DASHBOARD_COLUMNS,
  DASHBOARD_DESKTOP_MIN_WIDTH,
  DASHBOARD_GRID_GAP,
  DASHBOARD_ROW_HEIGHT,
  DASHBOARD_WIDGET_LABELS,
  isDefaultDashboardLayout,
  loadDashboardLayout,
  resetDashboardLayout,
  saveDashboardLayout,
  updateDashboardLayout,
} from './dashboardLayout';
import type { DashboardWidgetId } from './dashboardLayout';

type Metrics = ReturnType<typeof getDashboardMetrics>;

type DashboardWidget = {
  id: DashboardWidgetId;
  content: ReactNode;
};

type DashboardBentoProps = {
  metrics: Metrics;
  onSelect: (id: number) => void;
};

const gridConfig = {
  cols: DASHBOARD_COLUMNS,
  rowHeight: DASHBOARD_ROW_HEIGHT,
  margin: [DASHBOARD_GRID_GAP, DASHBOARD_GRID_GAP] as const,
  containerPadding: [0, 0] as const,
};

const getStorage = () => {
  if (typeof window === 'undefined') return undefined;
  try {
    return window.localStorage;
  } catch {
    return undefined;
  }
};

export function DashboardBento({ metrics, onSelect }: DashboardBentoProps) {
  const { width, containerRef, mounted } = useContainerWidth({ measureBeforeMount: true });
  const [layout, setLayout] = useState<LayoutItem[]>(() => loadDashboardLayout(getStorage()));
  const [announcement, setAnnouncement] = useState('');
  const isDesktop = mounted && width >= DASHBOARD_DESKTOP_MIN_WIDTH;
  const hasCustomLayout = !isDefaultDashboardLayout(layout);

  useEffect(() => {
    saveDashboardLayout(layout, getStorage());
  }, [layout]);

  const widgets = useMemo<DashboardWidget[]>(() => [
    {
      id: 'revenue',
      content: (
        <RevenueOverviewCard
          revenue={metrics.completedRevenue}
          averageTicket={metrics.averageTicket}
          data={metrics.last7Days}
        />
      ),
    },
    {
      id: 'order-flow',
      content: <OrderFlowCard data={metrics.last7Days} active={metrics.activeOrders} />,
    },
    {
      id: 'queue',
      content: <QueueSpotlightCard order={metrics.oldestPending} onSelect={onSelect} />,
    },
    {
      id: 'status-mix',
      content: <StatusMixCard counts={metrics.statusCounts} rate={metrics.completionRate} />,
    },
    {
      id: 'recent-orders',
      content: <RecentOrdersCard orders={metrics.recentOrders} onSelect={onSelect} />,
    },
  ], [metrics, onSelect]);

  const handleLayoutChange = useCallback((nextLayout: Layout) => {
    setLayout(nextLayout.map((item) => ({ ...item })));
  }, []);

  const handleKeyboardLayout = useCallback((widgetId: DashboardWidgetId, event: KeyboardEvent<HTMLButtonElement>) => {
    const direction = {
      ArrowLeft: [-1, 0],
      ArrowRight: [1, 0],
      ArrowUp: [0, -1],
      ArrowDown: [0, 1],
    }[event.key];
    if (!direction) return;

    event.preventDefault();
    event.stopPropagation();
    const [horizontal, vertical] = direction;
    setLayout((current) => updateDashboardLayout(
      current,
      widgetId,
      event.shiftKey
        ? { type: 'resize', dw: horizontal, dh: vertical }
        : { type: 'move', dx: horizontal, dy: vertical },
    ));

    const action = event.shiftKey ? 'Tamaño actualizado' : 'Posición actualizada';
    setAnnouncement(`${action}: ${DASHBOARD_WIDGET_LABELS[widgetId]}.`);
  }, []);

  const desktopChildren = useMemo(() => widgets.map((widget) => (
    <div
      key={widget.id}
      className="group relative [&_.dashboard-widget-content>*]:h-full [&_.dashboard-widget-content>*]:w-full"
    >
      <button
        type="button"
        className="dashboard-drag-handle focus-ring absolute -top-3.5 right-4 z-20 grid h-8 w-11 cursor-grab touch-none place-items-center rounded-full border border-border bg-shell text-ink opacity-80 shadow-sm transition-opacity hover:opacity-100 focus:cursor-grabbing focus:opacity-100 active:cursor-grabbing"
        aria-label={`Organizar ${DASHBOARD_WIDGET_LABELS[widget.id]}`}
        aria-describedby="dashboard-layout-help"
        aria-keyshortcuts="ArrowLeft ArrowRight ArrowUp ArrowDown Shift+ArrowLeft Shift+ArrowRight Shift+ArrowUp Shift+ArrowDown"
        title="Arrastra para mover. Flechas: mover. Mayús + flechas: cambiar tamaño."
        onKeyDown={(event) => handleKeyboardLayout(widget.id, event)}
      >
        <GripVertical className="h-4 w-4" aria-hidden="true" />
      </button>
      <div className="dashboard-widget-content h-full">{widget.content}</div>
    </div>
  )), [handleKeyboardLayout, widgets]);

  const resetLayout = () => {
    setLayout(resetDashboardLayout());
    setAnnouncement('Se restauró la distribución original de los widgets.');
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-surface/70 p-3 text-ink shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-bold">Distribución personalizable</p>
          <p id="dashboard-layout-help" className="mt-0.5 text-xs text-ink-soft">
            {isDesktop
              ? 'Arrastra el asa para mover; usa la esquina inferior para redimensionar. Con teclado: flechas para mover y Mayús + flechas para cambiar tamaño.'
              : 'En pantallas pequeñas los widgets se muestran apilados. La personalización está disponible en escritorio.'}
          </p>
        </div>
        <Button type="button" variant="ghost" size="sm" disabled={!hasCustomLayout} onClick={resetLayout}>
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Restablecer
        </Button>
      </div>

      <p className="sr-only" role="status" aria-live="polite">{announcement}</p>

      <div ref={containerRef} className="relative min-w-0">
        {isDesktop ? (
          <GridLayout
            width={width}
            layout={layout}
            gridConfig={gridConfig}
            dragConfig={{ enabled: true, bounded: true, handle: '.dashboard-drag-handle' }}
            resizeConfig={{ enabled: true, handles: ['se'] }}
            className="[&>.react-grid-placeholder]:!rounded-[30px] [&>.react-grid-placeholder]:!bg-brand-soft [&>.react-grid-placeholder]:!opacity-45 [&>.react-resizable-handle]:!h-8 [&>.react-resizable-handle]:!w-8 [&>.react-resizable-handle]:!opacity-70"
            onLayoutChange={handleLayoutChange}
            onDragStop={(_next, _oldItem, newItem) => {
              if (newItem) setAnnouncement(`Posición actualizada: ${DASHBOARD_WIDGET_LABELS[newItem.i as DashboardWidgetId]}.`);
            }}
            onResizeStop={(_next, _oldItem, newItem) => {
              if (newItem) setAnnouncement(`Tamaño actualizado: ${DASHBOARD_WIDGET_LABELS[newItem.i as DashboardWidgetId]}.`);
            }}
          >
            {desktopChildren}
          </GridLayout>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {widgets.map((widget) => (
              <div key={widget.id} className={widget.id === 'revenue' || widget.id === 'order-flow' ? 'md:col-span-2' : ''}>
                {widget.content}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
