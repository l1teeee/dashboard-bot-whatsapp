import type { CSSProperties } from 'react';

type RouteFallbackVariant = 'content' | 'shell' | 'public';

interface RouteFallbackProps {
  /**
   * `shell` is used while an authenticated session is being restored, before
   * AppLayout exists. `content` is for lazy pages rendered inside AppLayout.
   */
  variant?: RouteFallbackVariant;
}

function Placeholder({ className, style }: { className: string; style?: CSSProperties }) {
  return <span aria-hidden="true" style={style} className={`block animate-pulse rounded-full bg-surface-raised motion-reduce:animate-none ${className}`} />;
}

function DashboardContentFallback() {
  return (
    <div className="w-full space-y-6" data-testid="route-fallback-content">
      <div className="space-y-3">
        <Placeholder className="h-3 w-24 bg-brand/60" />
        <Placeholder className="h-12 w-72 max-w-full" />
        <Placeholder className="h-4 w-96 max-w-full" />
      </div>

      <div className="grid gap-5 lg:auto-rows-[118px] lg:grid-cols-12">
        <div aria-hidden="true" className="relative min-h-72 overflow-hidden rounded-[28px] border border-border bg-surface-raised p-6 lg:col-span-7 lg:row-span-3 lg:min-h-0">
          <div className="pattern-diagonal absolute inset-0 opacity-25" />
          <div className="relative space-y-5">
            <Placeholder className="h-3 w-36" />
            <Placeholder className="h-12 w-40" />
            <Placeholder className="h-4 w-56" />
          </div>
          <div className="absolute inset-x-6 bottom-7 flex items-end gap-3">
            {[42, 74, 58, 96, 52, 80, 64].map((height) => (
              <Placeholder key={height} className="w-full rounded-t-lg" style={{ height }} />
            ))}
          </div>
        </div>
        <div aria-hidden="true" className="relative min-h-72 overflow-hidden rounded-[28px] border border-border bg-lilac p-6 text-ink-dark lg:col-span-5 lg:row-span-3 lg:min-h-0">
          <div className="pattern-radial absolute inset-0 opacity-40" />
          <div className="relative space-y-5">
            <Placeholder className="h-3 w-32 bg-ink-dark/25" />
            <Placeholder className="h-10 w-52 bg-ink-dark/25" />
          </div>
          <div className="absolute inset-x-6 bottom-8 h-20 rounded-t-[999px] border-x-4 border-t-4 border-ink-dark/60" />
        </div>
        <div aria-hidden="true" className="min-h-52 rounded-[28px] border border-border bg-yellow p-6 lg:col-span-4 lg:row-span-2 lg:min-h-0">
          <Placeholder className="h-3 w-32 bg-ink-dark/20" />
          <Placeholder className="mt-12 h-8 w-48 bg-ink-dark/20" />
        </div>
        <div aria-hidden="true" className="min-h-52 rounded-[28px] border border-border bg-mint p-6 lg:col-span-4 lg:row-span-2 lg:min-h-0">
          <Placeholder className="h-3 w-28 bg-ink-dark/20" />
          <div className="mx-auto mt-5 h-20 w-20 rounded-full border-4 border-warm/80" />
        </div>
        <div aria-hidden="true" className="min-h-52 rounded-[28px] border border-border bg-surface p-6 lg:col-span-4 lg:row-span-2 lg:min-h-0">
          <Placeholder className="h-3 w-24" />
          <div className="mt-6 space-y-4">
            <Placeholder className="h-px w-full" />
            <Placeholder className="h-px w-full" />
            <Placeholder className="h-px w-4/5" />
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardShellFallback() {
  return (
    <div className="min-h-dvh bg-canvas p-0 lg:h-dvh lg:min-h-0 lg:p-5" data-testid="route-fallback-shell">
      <div className="flex min-h-dvh w-full overflow-hidden bg-shell lg:h-full lg:min-h-0 lg:rounded-[38px] lg:border lg:border-ink-dark lg:neo-shadow">
        <aside aria-hidden="true" className="hidden w-[248px] shrink-0 border-r border-border bg-shell lg:flex lg:flex-col">
          <div className="flex items-center gap-3 p-6">
            <Placeholder className="h-11 w-11 rounded-full bg-coral/70" />
            <div className="space-y-2"><Placeholder className="h-5 w-28" /><Placeholder className="h-2 w-20" /></div>
          </div>
          <div className="mt-3 px-5"><Placeholder className="h-3 w-16 bg-brand/55" /></div>
          <div className="mt-5 space-y-2 px-4">
            {[1, 2, 3, 4, 5].map((item) => <Placeholder key={item} className="h-12 w-full rounded-2xl" />)}
          </div>
          <div className="mt-auto space-y-3 border-t border-border p-4"><Placeholder className="h-11 w-full" /><Placeholder className="h-11 w-full" /></div>
        </aside>
        <div className="min-w-0 flex-1 lg:flex lg:min-h-0 lg:flex-col lg:overflow-hidden">
          <header aria-hidden="true" className="flex min-h-[76px] items-center justify-between gap-3 border-b border-border px-4 py-3 sm:px-6">
            <div className="flex items-center gap-3"><Placeholder className="hidden h-11 w-11 rounded-full lg:block" /><div className="space-y-2"><Placeholder className="h-3 w-20" /><Placeholder className="h-6 w-44" /></div></div>
            <div className="flex gap-2"><Placeholder className="h-11 w-28" /><Placeholder className="hidden h-11 w-24 sm:block" /><Placeholder className="h-11 w-11 rounded-full" /></div>
          </header>
          <main className="w-full p-4 pb-28 sm:p-6 lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:scrollbar-subtle lg:p-8 lg:pb-8">
            <DashboardContentFallback />
          </main>
        </div>
      </div>
    </div>
  );
}

function PublicFallback() {
  return (
    <main className="min-h-dvh bg-canvas p-4 lg:p-6" data-testid="route-fallback-public">
      <div aria-hidden="true" className="mx-auto flex min-h-[calc(100dvh-2rem)] max-w-[1340px] overflow-hidden rounded-[32px] border border-ink-dark bg-shell lg:min-h-[max(760px,calc(100dvh-3rem))] lg:rounded-[40px] lg:neo-shadow">
        <section className="relative hidden flex-1 bg-lilac p-10 lg:block"><div className="pattern-radial absolute inset-0 opacity-40" /><Placeholder className="relative h-10 w-48 bg-ink-dark/25" /><Placeholder className="relative mt-16 h-16 w-3/4 bg-ink-dark/25" /></section>
        <section className="flex w-full items-center justify-center p-6 lg:w-[42%]"><div className="w-full max-w-sm space-y-6"><Placeholder className="h-10 w-10 rounded-full bg-coral/70" /><Placeholder className="h-8 w-56" /><Placeholder className="h-4 w-full" /><Placeholder className="h-12 w-full rounded-xl" /><Placeholder className="h-12 w-full rounded-xl" /><Placeholder className="h-12 w-full rounded-xl bg-brand/70" /></div></section>
      </div>
    </main>
  );
}

export function RouteFallback({ variant = 'content' }: RouteFallbackProps) {
  const label = variant === 'shell' ? 'Restaurando panel' : 'Cargando sección';

  return (
    <section role="status" aria-live="polite" aria-busy="true" aria-label={label}>
      {variant === 'shell' ? <DashboardShellFallback /> : variant === 'public' ? <PublicFallback /> : <DashboardContentFallback />}
      <span className="sr-only">{label}…</span>
    </section>
  );
}
