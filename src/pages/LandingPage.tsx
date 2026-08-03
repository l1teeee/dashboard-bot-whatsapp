import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Check,
  ChefHat,
  ChevronDown,
  Clock3,
  History,
  LayoutDashboard,
  LockKeyhole,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  UtensilsCrossed,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import heroLayers from '@/assets/hero.png';
import {
  DashboardMarketingPreview,
  HeroOperationsPreview,
} from '@/components/landing/LandingPreview';

function Reveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <div className={`landing-reveal ${className}`} style={{ animationDelay: `${delay}s` }}>
      {children}
    </div>
  );
}

const processSteps = [
  {
    number: '01',
    title: 'El pedido entra',
    copy: 'WhatsApp recibe la solicitud y la convierte en un pedido claro para todo el equipo.',
    icon: MessageCircle,
    color: 'bg-coral',
  },
  {
    number: '02',
    title: 'Tu equipo actúa',
    copy: 'La cola prioriza lo urgente y muestra cada detalle sin perder el contexto de la cocina.',
    icon: Clock3,
    color: 'bg-yellow',
  },
  {
    number: '03',
    title: 'Todo queda visible',
    copy: 'Los estados, tiempos e ingresos se actualizan para que decidas con información real.',
    icon: Check,
    color: 'bg-cyan',
  },
];

const featureCards = [
  {
    title: 'Pedidos en vivo',
    copy: 'Una cola que se refresca mientras llegan nuevos pedidos y el equipo avanza.',
    icon: LayoutDashboard,
    className: 'bg-lilac text-ink-dark lg:col-span-2',
    accent: '32 hoy',
  },
  {
    title: 'Menú bajo control',
    copy: 'Activa, pausa y consulta productos sin salir del flujo operativo.',
    icon: UtensilsCrossed,
    className: 'bg-yellow text-ink-dark',
    accent: 'Disponible',
  },
  {
    title: 'Historial útil',
    copy: 'Encuentra pedidos anteriores por estado, cliente o momento.',
    icon: History,
    className: 'bg-coral text-ink-dark',
    accent: 'Sin perder nada',
  },
  {
    title: 'Analíticas claras',
    copy: 'Lee el ritmo, los ingresos y la mezcla de estados de un vistazo.',
    icon: BarChart3,
    className: 'bg-cyan text-ink-dark lg:col-span-2',
    accent: '+12.4%',
  },
  {
    title: 'Acceso seguro',
    copy: 'Tu equipo entra con correo y contraseña; las rutas operativas siguen protegidas.',
    icon: ShieldCheck,
    className: 'bg-mint text-ink-dark',
    accent: 'Protegido',
  },
];

const faqs = [
  {
    question: '¿Necesito cambiar la forma en que recibo pedidos?',
    answer: 'No. La experiencia está pensada para organizar los pedidos que llegan por WhatsApp y convertirlos en una operación fácil de seguir.',
  },
  {
    question: '¿Puedo usarlo desde el teléfono?',
    answer: 'Sí. La landing y el panel se adaptan a móvil, tablet y escritorio para que el equipo consulte la operación desde cualquier pantalla.',
  },
  {
    question: '¿Qué puede ver cada integrante del equipo?',
    answer: 'Después de iniciar sesión, el equipo puede acceder al panel, los pedidos, el menú, las analíticas y la configuración disponible para su cuenta.',
  },
  {
    question: '¿La información se actualiza mientras trabajamos?',
    answer: 'Sí. La interfaz está preparada para reflejar los cambios de estado y mantener la cola operativa al día.',
  },
];

function Brand() {
  return (
    <Link
      to="/"
      aria-label="Panel de pedidos, inicio"
      className="focus-ring flex shrink-0 items-center gap-2.5 rounded-full"
    >
      <span className="grid h-9 w-9 place-items-center rounded-full border-2 border-ink-dark bg-coral text-ink-dark neo-shadow">
        <ChefHat className="h-[18px] w-[18px]" />
      </span>
      <span className="leading-none text-ink-dark">
        <span className="font-display block text-lg font-extrabold uppercase">Panel de pedidos</span>
        <span className="mt-1 hidden text-[8px] font-extrabold uppercase tracking-[.2em] text-ink-dark/45 sm:block">
          WhatsApp Ops
        </span>
      </span>
    </Link>
  );
}

function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-shell px-3 py-3 sm:px-5">
      <div className="flex w-full items-center justify-between gap-4 rounded-[24px] border-2 border-ink-dark bg-warm px-3 py-2.5 neo-shadow sm:px-4">
        <Brand />

        <nav aria-label="Navegación principal" className="hidden items-center gap-7 lg:flex">
          {[
            ['Cómo funciona', '#como-funciona'],
            ['Producto', '#producto'],
            ['Funciones', '#funciones'],
            ['Preguntas', '#preguntas'],
          ].map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="focus-ring rounded text-[10px] font-extrabold uppercase tracking-[.14em] text-ink-dark transition-opacity hover:opacity-55"
            >
              {label}
            </a>
          ))}
        </nav>

        <Link
          to="/login"
          className="focus-ring group inline-flex items-center gap-2 rounded-[16px] border-2 border-ink-dark bg-ink-dark px-3.5 py-3 text-[10px] font-black uppercase text-warm neo-shadow transition-transform hover:-translate-y-0.5 sm:px-5"
        >
          <span className="hidden sm:inline">Entrar al panel</span>
          <span className="sm:hidden">Entrar</span>
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>
    </header>
  );
}

function HeroSection() {
  return (
    <section className="w-full px-3 pb-3 sm:px-5 sm:pb-5" aria-labelledby="hero-title">
      <div className="grid w-full gap-3 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div className="flex min-h-[620px] flex-col justify-between rounded-[28px] border border-border bg-surface p-6 sm:p-9 lg:min-h-[720px] lg:p-10 xl:p-12">
          <div>
            <div className="landing-float inline-flex items-center gap-2 rounded-full border border-border bg-shell px-3 py-2 text-[9px] font-extrabold uppercase tracking-[.12em] text-yellow">
              <Sparkles className="h-3.5 w-3.5" />
              Operación de pedidos, sin ruido
            </div>

            <Reveal delay={0.08}>
              <h1
                id="hero-title"
                aria-label="Pedidos claros. Cocina en movimiento."
                className="display-title mt-10 text-[clamp(4.25rem,9vw,8.5rem)] lg:text-[clamp(5rem,7vw,8rem)]"
              >
                Pedidos
                <br />
                claros.
                <br />
                Cocina en
                <br />
                <span className="text-coral">movimiento.</span>
              </h1>
            </Reveal>

            <p className="mt-7 text-balance text-sm font-medium leading-6 text-ink-soft sm:text-base sm:leading-7">
              Convierte cada pedido que entra por WhatsApp en una operación visible, ordenada y fácil de llevar de pendiente a completado.
            </p>

            <div className="landing-hero-enter mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/register"
                className="focus-ring group inline-flex min-h-12 items-center justify-center gap-4 rounded-[15px] border border-ink-dark bg-coral px-5 text-xs font-black text-ink-dark neo-shadow transition-transform hover:-translate-y-0.5"
              >
                Comenzar ahora
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href="#producto"
                className="focus-ring group inline-flex min-h-12 items-center justify-center gap-4 rounded-[15px] border border-ink-dark bg-warm px-5 text-xs font-black text-ink-dark neo-shadow transition-transform hover:-translate-y-0.5"
              >
                Ver cómo se ve
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>

          <div className="mt-9 grid gap-3 sm:grid-cols-2">
            <div className="landing-hover-card rounded-[20px] border border-border bg-surface-raised p-4">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-yellow text-ink-dark">
                <Sparkles className="h-4 w-4" />
              </span>
              <p className="font-display mt-4 text-xl font-bold uppercase">Todo en vivo</p>
              <p className="mt-1 text-[10px] font-semibold leading-4 text-ink-soft">La cola se refresca mientras el equipo trabaja.</p>
            </div>
            <div className="landing-hover-card rounded-[20px] border border-border bg-surface-raised p-4">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-mint text-ink-dark">
                <LayoutDashboard className="h-4 w-4" />
              </span>
              <p className="font-display mt-4 text-xl font-bold uppercase">Control simple</p>
              <p className="mt-1 text-[10px] font-semibold leading-4 text-ink-soft">Estados, detalles y menú sin perder contexto.</p>
            </div>
          </div>
        </div>

        <div className="landing-hero-enter min-h-[560px] lg:min-h-[720px]">
          <HeroOperationsPreview />
        </div>
      </div>
    </section>
  );
}

function TickerItems({ items, ariaHidden = false }: { items: string[]; ariaHidden?: boolean }) {
  return (
    <div aria-hidden={ariaHidden || undefined} className="flex shrink-0 items-center gap-5 pr-5">
      {items.map((item) => (
        <div key={item} className="flex shrink-0 items-center gap-5">
          <span className="text-[9px] font-black uppercase tracking-[.18em] sm:text-[10px]">{item}</span>
          <span aria-hidden="true" className="text-coral">✦</span>
        </div>
      ))}
    </div>
  );
}

function Ticker() {
  const items = ['Pedidos en vivo', 'Menú', 'Historial', 'Analíticas', 'Estados claros', 'Acceso seguro'];

  return (
    <div className="w-full overflow-hidden border-y border-ink-dark bg-yellow py-3 text-ink-dark" aria-label="Funciones principales">
      <div className="landing-marquee flex w-max items-center">
        <TickerItems items={items} />
        <TickerItems items={items} ariaHidden />
      </div>
    </div>
  );
}

function ProcessSection() {
  return (
    <section id="como-funciona" className="w-full scroll-mt-24 bg-warm px-4 py-16 text-ink-dark sm:px-6 sm:py-20 lg:px-8 lg:py-24" aria-labelledby="process-title">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:items-end">
        <div>
          <p className="kicker text-coral">Cómo funciona</p>
          <h2 id="process-title" className="display-title mt-4 text-5xl sm:text-6xl xl:text-7xl">Del chat a la cocina, sin escalas.</h2>
        </div>
        <p className="text-balance text-sm font-semibold leading-6 text-ink-dark/65 sm:text-base lg:justify-self-end lg:text-right">
          Una secuencia sencilla para que cada persona sepa qué llegó, qué sigue y qué ya está listo.
        </p>
      </div>

      <div className="mt-10 grid gap-3 md:grid-cols-3">
        {processSteps.map(({ number, title, copy, icon: Icon, color }) => (
          <article key={number} className="group flex min-h-72 flex-col justify-between rounded-[26px] border-2 border-ink-dark bg-canvas p-5 neo-shadow transition-transform hover:-translate-y-1 sm:p-6">
            <div className="flex items-start justify-between">
              <span className={`grid h-12 w-12 place-items-center rounded-full border border-ink-dark ${color}`}>
                <Icon className="h-5 w-5" />
              </span>
              <span className="font-display text-5xl font-extrabold text-ink-dark/15">{number}</span>
            </div>
            <div>
              <h3 className="font-display text-3xl font-bold uppercase">{title}</h3>
              <p className="mt-3 text-xs font-semibold leading-5 text-ink-dark/65 sm:text-sm">{copy}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ProductSection() {
  return (
    <section id="producto" className="w-full scroll-mt-24 bg-shell px-3 py-16 sm:px-5 sm:py-20 lg:py-24" aria-labelledby="product-title">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:items-end">
        <div>
          <p className="kicker text-yellow">Una sola vista</p>
          <h2 id="product-title" className="display-title mt-4 text-5xl sm:text-6xl xl:text-7xl">La operación completa, de un vistazo.</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:justify-self-end">
          <div className="rounded-[18px] border border-border bg-surface p-4">
            <p className="font-display text-3xl font-bold text-coral">MENOS RUIDO</p>
            <p className="mt-1 text-xs font-semibold text-ink-soft">Prioridad y estado visibles.</p>
          </div>
          <div className="rounded-[18px] border border-border bg-surface p-4">
            <p className="font-display text-3xl font-bold text-cyan">MÁS RITMO</p>
            <p className="mt-1 text-xs font-semibold text-ink-soft">Datos listos para actuar.</p>
          </div>
        </div>
      </div>

      <Reveal className="mt-10 w-full" delay={0.08}>
        <DashboardMarketingPreview />
      </Reveal>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section id="funciones" className="w-full scroll-mt-24 bg-canvas px-4 py-16 text-ink-dark sm:px-6 sm:py-20 lg:px-8 lg:py-24" aria-labelledby="features-title">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="kicker">Funciones pensadas para operar</p>
          <h2 id="features-title" className="display-title mt-4 text-5xl sm:text-6xl xl:text-7xl">Todo lo importante tiene su lugar.</h2>
        </div>
        <p className="rounded-full border border-ink-dark bg-warm px-4 py-2 text-[10px] font-black uppercase tracking-[.13em] neo-shadow">
          Claro desde el primer pedido
        </p>
      </div>

      <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {featureCards.map(({ title, copy, icon: Icon, className, accent }) => (
          <article key={title} className={`relative min-h-64 overflow-hidden rounded-[26px] border-2 border-ink-dark p-5 neo-shadow transition duration-300 hover:-translate-y-1 hover:shadow-[0_7px_0_#111] sm:p-6 ${className}`}>
            <div className="pattern-diagonal absolute inset-0 opacity-20" />
            <div className="relative flex h-full flex-col justify-between">
              <div className="flex items-start justify-between gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-full border border-ink-dark bg-warm">
                  <Icon className="h-5 w-5" />
                </span>
                <ArrowUpRight className="h-5 w-5" />
              </div>
              <div className="mt-12">
                <p className="kicker opacity-65">{accent}</p>
                <h3 className="font-display mt-2 text-3xl font-bold uppercase sm:text-4xl">{title}</h3>
                <p className="mt-3 text-xs font-semibold leading-5 opacity-70 sm:text-sm">{copy}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function BenefitsSection() {
  const benefits = [
    'La prioridad se entiende sin preguntar.',
    'Cada pedido conserva sus detalles.',
    'El equipo comparte el mismo estado.',
    'Los resultados quedan listos para revisar.',
  ];

  return (
    <section className="grid w-full bg-warm text-ink-dark lg:grid-cols-2" aria-labelledby="benefits-title">
      <div className="relative flex min-h-[480px] items-center justify-center overflow-hidden border-b border-ink-dark bg-lilac p-8 lg:min-h-[680px] lg:border-b-0 lg:border-r">
        <div className="pattern-radial absolute inset-0 opacity-35" />
        <div className="absolute left-6 top-6 rounded-full border border-ink-dark bg-warm px-4 py-2 text-[9px] font-black uppercase tracking-[.14em] neo-shadow">
          Creado para el ritmo real
        </div>
        <img
          src={heroLayers}
          alt="Capas organizadas que representan el flujo operativo"
          className="relative w-[min(72vw,430px)] drop-shadow-[12px_16px_0_rgba(27,27,25,.2)] lg:w-[min(34vw,520px)]"
        />
        <div className="absolute bottom-7 right-5 rotate-3 rounded-[20px] border-2 border-ink-dark bg-yellow px-5 py-4 neo-shadow sm:right-8">
          <p className="kicker">Una operación</p>
          <p className="font-display mt-1 text-2xl font-bold">EN SU SITIO</p>
        </div>
      </div>

      <div className="flex flex-col justify-center px-5 py-16 sm:px-8 sm:py-20 lg:px-12 xl:px-16">
        <p className="kicker text-coral">Menos dudas. Más acción.</p>
        <h2 id="benefits-title" className="display-title mt-4 text-5xl sm:text-6xl xl:text-7xl">Una interfaz que habla el idioma de tu equipo.</h2>
        <p className="mt-6 text-sm font-semibold leading-6 text-ink-dark/65 sm:text-base sm:leading-7">
          Diseñada para leer rápido, decidir con seguridad y mantener la cocina en movimiento incluso en los momentos de mayor demanda.
        </p>
        <ul className="mt-9 space-y-3">
          {benefits.map((benefit) => (
            <li key={benefit} className="flex items-center gap-3 rounded-[17px] border border-ink-dark bg-canvas p-3.5 neo-shadow">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-coral">
                <Check className="h-4 w-4" />
              </span>
              <span className="text-xs font-extrabold sm:text-sm">{benefit}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function FaqSection() {
  return (
    <section id="preguntas" className="w-full scroll-mt-24 bg-shell px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24" aria-labelledby="faq-title">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)]">
        <div>
          <p className="kicker text-yellow">Preguntas frecuentes</p>
          <h2 id="faq-title" className="display-title mt-4 text-5xl sm:text-6xl xl:text-7xl">Lo esencial, bien explicado.</h2>
          <p className="mt-5 text-sm font-semibold leading-6 text-ink-soft">Todo lo que tu equipo necesita saber antes de comenzar.</p>
        </div>

        <div className="space-y-3">
          {faqs.map(({ question, answer }, index) => (
            <details key={question} className="group rounded-[22px] border border-border bg-surface open:bg-surface-raised">
              <summary className="focus-ring flex cursor-pointer list-none items-center justify-between gap-4 rounded-[22px] p-5 sm:p-6">
                <span className="flex items-center gap-3">
                  <span className="font-display text-2xl font-bold text-coral">0{index + 1}</span>
                  <span className="text-sm font-extrabold sm:text-base">{question}</span>
                </span>
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-border bg-shell transition-transform group-open:rotate-180">
                  <ChevronDown className="h-4 w-4" />
                </span>
              </summary>
              <p className="px-5 pb-6 pl-[4.25rem] text-xs font-semibold leading-5 text-ink-soft sm:pr-16 sm:text-sm sm:leading-6">
                {answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="w-full bg-coral p-3 text-ink-dark sm:p-5" aria-labelledby="cta-title">
      <div className="relative overflow-hidden rounded-[28px] border-2 border-ink-dark bg-yellow px-5 py-16 neo-shadow sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <div className="pattern-dots absolute inset-0 opacity-30" />
        <div className="relative grid gap-8 lg:grid-cols-[minmax(0,8fr)_minmax(260px,4fr)] lg:items-end">
          <div>
            <p className="kicker">Tu próxima orden puede empezar mejor</p>
            <h2 id="cta-title" className="display-title mt-5 text-[clamp(3.5rem,9vw,8rem)]">Pon cada pedido en movimiento.</h2>
          </div>
          <div className="lg:justify-self-end">
            <p className="text-sm font-bold leading-6 text-ink-dark/70">Entra con tu cuenta y lleva el control desde la primera pantalla.</p>
            <Link
              to="/register"
              className="focus-ring group mt-6 inline-flex min-h-14 w-full items-center justify-between rounded-[17px] border-2 border-ink-dark bg-ink-dark px-5 text-xs font-black uppercase text-warm neo-shadow transition-transform hover:-translate-y-1 sm:w-auto sm:min-w-56"
            >
              Crear una cuenta
              <ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function LandingFooter() {
  return (
    <footer className="w-full border-t border-border bg-shell px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <Brand />
        <p className="text-[9px] font-extrabold uppercase tracking-[.16em] text-ink-soft">Pedidos visibles. Equipos sincronizados.</p>
        <div className="flex items-center gap-4">
          <Link to="/login" className="focus-ring rounded text-[10px] font-extrabold uppercase tracking-[.12em] text-ink-soft hover:text-ink">Ingresar</Link>
          <Link to="/register" className="focus-ring rounded text-[10px] font-extrabold uppercase tracking-[.12em] text-ink-soft hover:text-ink">Crear cuenta</Link>
          <span className="grid h-9 w-9 place-items-center rounded-full border border-border text-yellow"><LockKeyhole className="h-4 w-4" /></span>
        </div>
      </div>
    </footer>
  );
}

export function LandingPage() {
  return (
    <MotionConfig reducedMotion="user">
      <div data-testid="landing-page" className="min-h-screen w-full min-w-0 overflow-x-hidden bg-canvas p-0 text-ink lg:p-4">
        <a href="#contenido" className="focus-ring fixed left-3 top-3 z-[100] -translate-y-24 rounded-full bg-yellow px-4 py-2 text-xs font-black text-ink-dark focus:translate-y-0">
          Saltar al contenido
        </a>
        <div className="mx-auto w-full overflow-hidden bg-shell lg:max-w-[1480px] lg:rounded-[42px] lg:border-2 lg:border-ink-dark lg:shadow-[0_7px_0_#111]">
          <LandingHeader />
          <main id="contenido" className="w-full">
            <HeroSection />
            <Ticker />
            <ProcessSection />
            <ProductSection />
            <FeaturesSection />
            <BenefitsSection />
            <FaqSection />
            <FinalCta />
          </main>
          <LandingFooter />
        </div>
      </div>
    </MotionConfig>
  );
}

export default LandingPage;
