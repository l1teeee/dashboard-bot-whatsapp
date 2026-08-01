export function RouteFallback() {
  return (
    <div className="animate-pulse space-y-6" role="status" aria-live="polite" aria-label="Cargando sección">
      <div className="space-y-3">
        <div className="h-3 w-20 rounded-full bg-surface-raised" />
        <div className="h-12 w-64 max-w-full rounded-xl bg-surface-raised" />
        <div className="h-4 w-80 max-w-full rounded-full bg-surface-raised" />
      </div>
      <div className="h-56 rounded-[28px] border border-border bg-surface-raised" />
      <span className="sr-only">Cargando sección…</span>
    </div>
  );
}
