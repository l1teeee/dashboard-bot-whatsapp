import {
  BarChart3,
  Bell,
  Check,
  ChefHat,
  Clock3,
  History,
  LayoutDashboard,
  MessageCircle,
  Search,
  Settings,
  ShoppingBag,
  UtensilsCrossed,
} from 'lucide-react';

const weekBars = [42, 61, 78, 54, 70, 88, 66];
const queue = [
  { id: '1048', item: '2× Smash burger', time: 'Ahora', color: 'bg-yellow' },
  { id: '1047', item: '1× Bowl de pollo', time: '2 min', color: 'bg-lilac' },
];

export function HeroOperationsPreview() {
  return (
    <div
      aria-hidden="true"
      className="relative flex h-full min-h-[500px] items-end justify-center overflow-hidden rounded-[30px] border border-ink-dark bg-lilac px-4 pt-14 text-ink-dark sm:min-h-[590px] sm:px-8"
    >
      <div className="pattern-radial absolute inset-0 opacity-40" />
      <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-ink-dark bg-warm px-3 py-2 text-[10px] font-extrabold uppercase tracking-[.12em] neo-shadow sm:left-8 sm:top-8">
        <span className="landing-live-dot h-2 w-2 rounded-full bg-[#48B88A]" />
        Operación conectada
      </div>

      <div className="landing-float-delay absolute right-[-28px] top-20 z-20 hidden w-52 rotate-[5deg] rounded-[22px] border border-ink-dark bg-yellow p-4 neo-shadow sm:block lg:right-[-12px]">
        <div className="flex items-center justify-between">
          <span className="kicker">Nuevo pedido</span>
          <Bell className="h-4 w-4" />
        </div>
        <p className="font-display mt-4 text-3xl font-bold leading-none">#1049</p>
        <p className="mt-2 text-xs font-bold">3 productos · $24.50</p>
      </div>

      <div className="landing-float-negative absolute bottom-12 left-[-22px] z-20 hidden w-48 -rotate-[4deg] rounded-[22px] border border-ink-dark bg-coral p-4 neo-shadow sm:block lg:left-[-5px]">
        <div className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-full border border-ink-dark bg-warm">
            <Check className="h-4 w-4" />
          </span>
          <div>
            <p className="kicker">Estado</p>
            <p className="font-display text-xl font-bold">EN PROCESO</p>
          </div>
        </div>
      </div>

      <div className="landing-phone-enter relative z-10 w-full max-w-[315px] translate-y-8 rounded-[42px] border-[3px] border-ink-dark bg-[#111110] p-2.5 shadow-[0_8px_0_#111] sm:translate-y-10">
        <div className="relative overflow-hidden rounded-[32px] border border-border bg-surface pb-3 text-ink">
          <div className="absolute left-1/2 top-2 z-20 h-5 w-20 -translate-x-1/2 rounded-full bg-[#0a0a09]" />
          <div className="flex items-center justify-between px-4 pb-3 pt-10">
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-full border border-ink-dark bg-coral text-ink-dark">
                <ChefHat className="h-4 w-4" />
              </span>
              <div>
                <p className="text-[9px] font-bold text-ink-soft">Buenos días, equipo</p>
                <p className="text-xs font-extrabold">Pedidos en vivo</p>
              </div>
            </div>
            <span className="grid h-9 w-9 place-items-center rounded-full bg-warm text-ink-dark">
              <Search className="h-4 w-4" />
            </span>
          </div>

          <div className="mx-3 rounded-[22px] border border-ink-dark bg-yellow p-4 text-ink-dark neo-shadow">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="kicker">Cola prioritaria</p>
                <p className="font-display mt-1 text-3xl font-bold">2 POR ATENDER</p>
              </div>
              <Clock3 className="h-5 w-5" />
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-ink-dark/15">
              <div className="landing-progress h-full w-[72%] rounded-full bg-coral" />
            </div>
          </div>

          <div className="mx-3 mt-3 rounded-[22px] border border-border bg-surface-raised p-3">
            <div className="mb-2 flex items-center justify-between">
              <p className="kicker text-ink-soft">Últimos pedidos</p>
              <span className="rounded-full bg-mint px-2 py-1 text-[8px] font-black text-ink-dark">EN VIVO</span>
            </div>
            <div className="space-y-2">
              {queue.map((order) => (
                <div key={order.id} className="flex items-center gap-2 rounded-2xl bg-surface p-2.5">
                  <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl text-[10px] font-black text-ink-dark ${order.color}`}>
                    #{order.id.slice(-2)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[10px] font-extrabold">{order.item}</p>
                    <p className="mt-0.5 text-[8px] font-bold text-ink-soft">{order.time}</p>
                  </div>
                  <span className="h-2 w-2 rounded-full bg-coral" />
                </div>
              ))}
            </div>
          </div>

          <div className="mx-3 mt-3 rounded-[22px] border border-ink-dark bg-cyan p-3 text-ink-dark">
            <div className="flex items-center justify-between">
              <div>
                <p className="kicker">Ritmo de hoy</p>
                <p className="font-display text-2xl font-bold">32 PEDIDOS</p>
              </div>
              <div className="flex h-11 items-end gap-1">
                {[34, 55, 43, 72, 64].map((height, index) => (
                  <span key={index} className="landing-mini-bar w-2 rounded-t bg-ink-dark" style={{ height: `${height}%`, animationDelay: `${index * 90}ms` }} />
                ))}
              </div>
            </div>
          </div>

          <div className="mx-3 mt-3 flex items-center justify-around rounded-full border border-border bg-shell px-2 py-2.5 text-ink-soft">
            <LayoutDashboard className="h-4 w-4 text-yellow" />
            <History className="h-4 w-4" />
            <ShoppingBag className="h-4 w-4" />
            <Settings className="h-4 w-4" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function DashboardMarketingPreview() {
  return (
    <div aria-hidden="true" className="rounded-[30px] border border-ink-dark bg-shell p-2.5 text-ink neo-shadow sm:rounded-[36px] sm:p-4">
      <div className="overflow-hidden rounded-[23px] border border-border bg-shell sm:rounded-[27px]">
        <div className="flex min-h-14 items-center justify-between border-b border-border px-3 sm:px-5">
          <div className="flex items-center gap-2 sm:gap-4">
            <span className="grid h-8 w-8 place-items-center rounded-full border border-ink-dark bg-coral text-ink-dark sm:h-9 sm:w-9">
              <ChefHat className="h-4 w-4" />
            </span>
            <span className="hidden text-[10px] font-extrabold uppercase tracking-[.15em] text-ink-soft sm:inline">Panel / <b className="text-ink">Resumen</b></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden items-center gap-2 rounded-full border border-border bg-surface px-3 py-2 text-[9px] font-bold sm:flex">
              <span className="h-2 w-2 rounded-full bg-[#48B88A]" /> En línea
            </span>
            <span className="grid h-8 w-8 place-items-center rounded-full bg-warm text-ink-dark"><Search className="h-4 w-4" /></span>
          </div>
        </div>

        <div className="grid sm:grid-cols-[58px_1fr]">
          <aside className="hidden border-r border-border px-2 py-4 sm:flex sm:flex-col sm:items-center sm:gap-3">
            {[LayoutDashboard, History, BarChart3, UtensilsCrossed, Settings].map((Icon, index) => (
              <span key={index} className={`grid h-9 w-9 place-items-center rounded-xl ${index === 0 ? 'bg-cyan text-ink-dark' : 'text-ink-soft'}`}>
                <Icon className="h-4 w-4" />
              </span>
            ))}
          </aside>

          <div className="grid gap-2.5 p-2.5 sm:grid-cols-12 sm:gap-3 sm:p-4">
            <div className="relative overflow-hidden rounded-[22px] border border-ink-dark bg-coral p-4 text-ink-dark sm:col-span-7 sm:min-h-64 sm:p-5">
              <div className="pattern-diagonal absolute inset-0 opacity-30" />
              <div className="relative">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="kicker">Ingresos completados</p>
                    <p className="font-display mt-2 text-4xl font-bold sm:text-5xl">$1,284.50</p>
                  </div>
                  <span className="rounded-full border border-ink-dark bg-warm px-2.5 py-1.5 text-[9px] font-black">+12.4%</span>
                </div>
                <div className="mt-6 flex h-24 items-end gap-2 sm:h-28 sm:gap-3">
                  {weekBars.map((height, index) => (
                    <div key={index} className="flex h-full flex-1 flex-col justify-end gap-1">
                      <span className={`landing-chart-bar ${index === 5 ? 'bg-yellow' : 'bg-mint'} rounded-t-lg border border-ink-dark/20`} style={{ height: `${height}%`, animationDelay: `${index * 80}ms` }} />
                      <span className="text-center text-[7px] font-black">{['L', 'M', 'X', 'J', 'V', 'S', 'D'][index]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[22px] border border-ink-dark bg-lilac p-4 text-ink-dark sm:col-span-5 sm:min-h-64 sm:p-5">
              <div className="pattern-radial absolute inset-0 opacity-30" />
              <div className="relative flex h-full flex-col">
                <p className="kicker">Flujo de pedidos</p>
                <p className="font-display mt-1 text-3xl font-bold">32 HOY</p>
                <div className="mt-6 flex flex-1 flex-col justify-end gap-3">
                  {[
                    ['Pendientes', '06', 'bg-yellow', 'w-[38%]'],
                    ['En proceso', '11', 'bg-coral', 'w-[67%]'],
                    ['Completados', '15', 'bg-mint', 'w-[88%]'],
                  ].map(([label, value, color, width]) => (
                    <div key={label}>
                      <div className="mb-1 flex justify-between text-[9px] font-black uppercase"><span>{label}</span><span>{value}</span></div>
                      <div className="h-2 rounded-full bg-ink-dark/15"><div className={`landing-progress h-full rounded-full border border-ink-dark/20 ${color} ${width}`} /></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-[22px] border border-ink-dark bg-cyan p-4 text-ink-dark sm:col-span-4 sm:min-h-48">
              <div className="flex items-center justify-between"><p className="kicker">Cola prioritaria</p><Clock3 className="h-4 w-4" /></div>
              <p className="font-display mt-5 text-4xl font-bold">#1048</p>
              <p className="mt-1 text-[10px] font-bold">Esperando hace 3 min</p>
              <div className="mt-5 rounded-xl border border-ink-dark bg-warm px-3 py-2 text-[9px] font-black">2× Burger · 1× Papas</div>
            </div>

            <div className="rounded-[22px] border border-ink-dark bg-mint p-4 text-ink-dark sm:col-span-4 sm:min-h-48">
              <p className="kicker">Operación</p>
              <p className="font-display mt-1 text-3xl font-bold">RITMO ESTABLE</p>
              <div className="mx-auto mt-4 grid h-20 w-20 place-items-center rounded-full border-[10px] border-warm border-r-coral">
                <span className="font-display text-xl font-bold">84%</span>
              </div>
            </div>

            <div className="rounded-[22px] border border-border bg-surface p-4 sm:col-span-4 sm:min-h-48">
              <div className="flex items-center gap-2"><span className="grid h-8 w-8 place-items-center rounded-full bg-yellow text-ink-dark"><MessageCircle className="h-4 w-4" /></span><p className="kicker text-yellow">Actividad</p></div>
              <div className="mt-4 space-y-2">
                <div className="rounded-xl bg-surface-raised px-3 py-2 text-[9px] font-bold">#1047 pasó a preparación</div>
                <div className="rounded-xl bg-surface-raised px-3 py-2 text-[9px] font-bold">#1045 fue completado</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
