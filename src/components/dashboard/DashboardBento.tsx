import { useCallback, useEffect, useMemo, useState } from 'react';
import type { KeyboardEvent, ReactNode, Ref } from 'react';
import { Check, Pencil, RotateCcw } from 'lucide-react';
import { GridLayout, useContainerWidth } from 'react-grid-layout';
import type { Layout, LayoutItem, ResizeHandleAxis } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import './DashboardBento.css';
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

// react-resizable clona el elemento devuelto y le inyecta los eventos de
// mouse/touch. Por eso debe ser un nodo DOM directo: envolverlo en un
// componente que no propague esos props deja un tirador visible pero inerte.
function renderWidgetResizeHandle(axis: ResizeHandleAxis, handleRef: Ref<HTMLElement>) {
  return (
    <span
      ref={handleRef as Ref<HTMLSpanElement>}
      className={`dashboard-resize-handle dashboard-resize-handle-${axis} react-resizable-handle react-resizable-handle-${axis}`}
      data-resize-axis={axis}
      data-testid={`resize-handle-${axis}`}
      aria-hidden="true"
    >
      <span className="dashboard-resize-handle-dot" />
    </span>
  );
}

export function DashboardBento({ metrics, onSelect }: DashboardBentoProps) {
  const { width, containerRef, mounted } = useContainerWidth({ measureBeforeMount: true });
  const [layout, setLayout] = useState<LayoutItem[]>(() => loadDashboardLayout(getStorage()));
  const [announcement, setAnnouncement] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [selectedWidget, setSelectedWidget] = useState<DashboardWidgetId | null>(null);
  const isDesktop = mounted && width >= DASHBOARD_DESKTOP_MIN_WIDTH;
  const hasCustomLayout = !isDefaultDashboardLayout(layout);

  useEffect(() => {
    if (!isDesktop && isEditing) {
      setIsEditing(false);
      setSelectedWidget(null);
    }
  }, [isDesktop, isEditing]);

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

  const persistLayout = useCallback((nextLayout: Layout) => {
    const normalized = nextLayout.map((item) => ({ ...item }));
    setLayout(normalized);
    saveDashboardLayout(normalized, getStorage());
  }, []);

  const handleLayoutChange = useCallback((nextLayout: Layout) => {
    // Mantiene la previsualizaci\u00f3n fluida; el guardado ocurre al soltar el gesto.
    setLayout(nextLayout.map((item) => ({ ...item })));
  }, []);

  const handleKeyboardLayout = useCallback((widgetId: DashboardWidgetId, event: KeyboardEvent<HTMLDivElement>) => {
    const direction = {
      ArrowLeft: [-1, 0],
      ArrowRight: [1, 0],
      ArrowUp: [0, -1],
      ArrowDown: [0, 1],
    }[event.key];
    if (!direction || !isEditing) return;

    event.preventDefault();
    event.stopPropagation();
    const [horizontal, vertical] = direction;
    const nextLayout = updateDashboardLayout(
      layout,
      widgetId,
      event.shiftKey
        ? { type: 'resize', dw: horizontal, dh: vertical }
        : { type: 'move', dx: horizontal, dy: vertical },
    );
    persistLayout(nextLayout);

    const action = event.shiftKey ? 'Tama\u00f1o actualizado' : 'Posici\u00f3n actualizada';
    setAnnouncement(`${action}: ${DASHBOARD_WIDGET_LABELS[widgetId]}.`);
  }, [isEditing, layout, persistLayout]);

  const desktopChildren = useMemo(() => widgets.map((widget) => (
    <div
      key={widget.id}
      data-widget-id={widget.id}
      className={`dashboard-widget-frame group relative h-full ${isEditing ? 'dashboard-widget-frame-editing' : ''} ${selectedWidget === widget.id ? 'dashboard-widget-frame-selected' : ''}`}
      onPointerDown={() => {
        if (isEditing) setSelectedWidget(widget.id);
      }}
      onFocus={() => {
        if (isEditing) setSelectedWidget(widget.id);
      }}
      onKeyDown={(event) => handleKeyboardLayout(widget.id, event)}
      tabIndex={isEditing ? 0 : -1}
      role={isEditing ? 'group' : 'region'}
      aria-label={isEditing ? `Editar ${DASHBOARD_WIDGET_LABELS[widget.id]}` : DASHBOARD_WIDGET_LABELS[widget.id]}
      aria-describedby={isEditing ? 'dashboard-layout-help' : undefined}
      aria-keyshortcuts={isEditing ? 'ArrowLeft ArrowRight ArrowUp ArrowDown Shift+ArrowLeft Shift+ArrowRight Shift+ArrowUp Shift+ArrowDown' : undefined}
    >
      {isEditing && selectedWidget === widget.id && (
        <span className="dashboard-widget-size" aria-live="polite">
          Ancho {layout.find((item) => item.i === widget.id)?.w}
          {' \u00b7 '}
          Alto {layout.find((item) => item.i === widget.id)?.h}
        </span>
      )}
      <div
        className="dashboard-widget-content h-full [&>*]:h-full [&>*]:w-full"
        inert={isEditing}
        aria-hidden={isEditing || undefined}
      >
        {widget.content}
      </div>
    </div>
  )), [handleKeyboardLayout, isEditing, layout, selectedWidget, widgets]);

  const resetLayout = () => {
    const nextLayout = resetDashboardLayout();
    persistLayout(nextLayout);
    setAnnouncement('Se restaur\u00f3 la distribuci\u00f3n original de los widgets.');
  };

  const enterEditing = () => {
    if (!isDesktop) return;
    setIsEditing(true);
    setSelectedWidget('revenue');
    setAnnouncement('Edici\u00f3n activa. Arrastra una tarjeta o usa los puntos laterales para cambiar su tama\u00f1o.');
  };

  const finishEditing = () => {
    setIsEditing(false);
    setSelectedWidget(null);
    setAnnouncement('Distribuci\u00f3n guardada.');
  };

  return (
    <div className="space-y-4">
      <div className={`dashboard-layout-toolbar ${isEditing ? 'dashboard-layout-toolbar-active' : ''}`}>
        <div className="min-w-0">
          <p className="dashboard-layout-toolbar-title">
            {isEditing ? 'Edici\u00f3n activa' : 'Distribuci\u00f3n personalizable'}
          </p>
          <p id="dashboard-layout-help" className="dashboard-layout-toolbar-copy">
            {isDesktop
              ? isEditing
                ? 'Arrastra cualquier parte de una tarjeta para moverla. Usa los cuatro puntos laterales para cambiar ancho o alto.'
                : 'Personaliza el espacio de trabajo cuando lo necesites. Tus cambios se guardan autom\u00e1ticamente.'
              : 'En pantallas peque\u00f1as los widgets se muestran apilados. La personalizaci\u00f3n est\u00e1 disponible en escritorio.'}
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {isEditing ? (
            <>
              <Button type="button" variant="ghost" size="sm" disabled={!hasCustomLayout} onClick={resetLayout}>
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                Restablecer
              </Button>
              <Button type="button" variant="success" size="sm" onClick={finishEditing}>
                <Check className="h-4 w-4" aria-hidden="true" />
                Listo
              </Button>
            </>
          ) : (
            <Button type="button" variant="secondary" size="sm" disabled={!isDesktop} onClick={enterEditing} title={isDesktop ? 'Editar la distribuci\u00f3n de widgets' : 'Disponible en escritorio'}>
              <Pencil className="h-4 w-4" aria-hidden="true" />
              Editar
            </Button>
          )}
        </div>
      </div>

      <p className="sr-only" role="status" aria-live="polite">{announcement}</p>

      <div ref={containerRef} className="relative min-w-0">
        {isDesktop ? (
          <GridLayout
            width={width}
            layout={layout}
            gridConfig={gridConfig}
            dragConfig={{ enabled: isEditing, bounded: true, threshold: 8, cancel: '.dashboard-resize-handle' }}
            resizeConfig={{
              enabled: isEditing,
              handles: ['n', 'e', 's', 'w'],
              handleComponent: renderWidgetResizeHandle,
            }}
            className={`dashboard-widget-grid ${isEditing ? 'dashboard-widget-grid-editing' : ''}`}
            onLayoutChange={handleLayoutChange}
            onDragStop={(nextLayout, _oldItem, newItem) => {
              persistLayout(nextLayout);
              if (newItem) setAnnouncement(`Posici\u00f3n actualizada: ${DASHBOARD_WIDGET_LABELS[newItem.i as DashboardWidgetId]}.`);
            }}
            onResizeStart={(_nextLayout, _oldItem, newItem) => {
              if (newItem) setSelectedWidget(newItem.i as DashboardWidgetId);
            }}
            onResize={(nextLayout, _oldItem, newItem) => {
              // Actualiza la insignia mientras se mueve el tirador; la
              // persistencia sigue ocurriendo unicamente al terminar.
              setLayout(nextLayout.map((item) => ({ ...item })));
              if (newItem) setSelectedWidget(newItem.i as DashboardWidgetId);
            }}
            onResizeStop={(nextLayout, _oldItem, newItem) => {
              persistLayout(nextLayout);
              if (newItem) setAnnouncement(`Tama\u00f1o actualizado: ${DASHBOARD_WIDGET_LABELS[newItem.i as DashboardWidgetId]}.`);
            }}
          >
            {desktopChildren}
          </GridLayout>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {widgets.map((widget) => (
              <div
                key={widget.id}
                data-widget-id={widget.id}
                role="region"
                aria-label={DASHBOARD_WIDGET_LABELS[widget.id]}
                tabIndex={-1}
                className={widget.id === 'revenue' || widget.id === 'order-flow' ? 'md:col-span-2' : ''}
              >
                {widget.content}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
