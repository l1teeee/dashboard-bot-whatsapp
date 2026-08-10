import { useState } from 'react';
import { ArrowDownRight } from 'lucide-react';
import { cn } from '@/lib/cn';
import type { DashboardWidgetId } from './dashboardLayout';

type AnalyticsSection = {
  id: DashboardWidgetId;
  number: string;
  eyebrow: string;
  title: string;
  description: string;
  accentClassName: string;
};

const sections: AnalyticsSection[] = [
  { id: 'revenue', number: '01', eyebrow: 'Ventas', title: 'Ingresos completados', description: 'Facturación y ticket promedio de los últimos siete días.', accentClassName: 'bg-cyan text-ink-dark' },
  { id: 'order-flow', number: '02', eyebrow: 'Demanda', title: 'Flujo de pedidos', description: 'Tendencia diaria y pedidos que permanecen activos ahora.', accentClassName: 'bg-lilac text-ink-dark' },
  { id: 'queue', number: '03', eyebrow: 'Atención', title: 'Cola prioritaria', description: 'El pedido que necesita acción antes que el resto del lote.', accentClassName: 'bg-yellow text-ink-dark' },
  { id: 'status-mix', number: '04', eyebrow: 'Operación', title: 'Estados del lote', description: 'Distribución y porcentaje de pedidos que ya cerraron.', accentClassName: 'bg-mint text-ink-dark' },
  { id: 'recent-orders', number: '05', eyebrow: 'Seguimiento', title: 'Actividad reciente', description: 'Los últimos movimientos para abrir el detalle de cada pedido.', accentClassName: 'bg-brand-soft text-ink-dark' },
];

function revealWidget(widgetId: DashboardWidgetId) {
  const widget = document.querySelector<HTMLElement>(`[data-widget-id="${widgetId}"]`);
  if (!widget) return;

  widget.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
  widget.focus({ preventScroll: true });
}

/** Navegación semántica que convierte cada tarjeta del lienzo en una sección localizable. */
export function AnalyticsSectionNavigator() {
  const [activeSection, setActiveSection] = useState<DashboardWidgetId | null>(null);

  const handleSectionClick = (section: AnalyticsSection) => {
    setActiveSection(section.id);
    revealWidget(section.id);
  };

  return (
    <section aria-labelledby="analytics-sections-title" className="rounded-card border border-border/80 bg-surface/70 p-4 shadow-[0_4px_16px_rgb(0_24_28_/_8%)] sm:p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="kicker text-yellow">Mapa de análisis</p>
          <h2 id="analytics-sections-title" className="mt-1 text-lg font-extrabold text-ink">Secciones del resumen</h2>
        </div>
        <p className="max-w-xl text-sm text-ink-soft">Elige una sección para encontrar su indicador en el lienzo. Puedes reorganizarlo sin perder este mapa.</p>
      </div>

      <nav aria-label="Secciones de analíticas" className="mt-4">
        <ol className="grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
          {sections.map((section) => {
            const isActive = activeSection === section.id;
            return (
              <li key={section.id}>
                <button
                  type="button"
                  className={cn(
                    'focus-ring group flex h-full w-full items-start gap-3 rounded-2xl border p-3 text-left transition-colors',
                    isActive
                      ? 'border-brand-soft bg-surface-raised shadow-[0_3px_0_#081C1E]'
                      : 'border-border/70 bg-shell/35 hover:border-brand-soft hover:bg-surface-raised/70',
                  )}
                  aria-pressed={isActive}
                  onClick={() => handleSectionClick(section)}
                >
                  <span className={cn('grid h-8 w-8 shrink-0 place-items-center rounded-xl text-xs font-extrabold', section.accentClassName)}>{section.number}</span>
                  <span className="min-w-0">
                    <span className="kicker block text-[0.62rem] text-ink-soft">{section.eyebrow}</span>
                    <span className="mt-1 flex items-center gap-1 font-extrabold text-ink">
                      {section.title}
                      <ArrowDownRight className="h-3.5 w-3.5 shrink-0 text-brand-soft transition-transform group-hover:translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                    </span>
                    <span className="mt-1 block text-xs leading-snug text-ink-soft">{section.description}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>
    </section>
  );
}
