import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ChefHat,
  Eye,
  EyeOff,
  LockKeyhole,
  MessageCircle,
  ShieldCheck,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/auth';
import { login, getRegistrationStatus } from '@/api/auth';
import { ApiError, NetworkError } from '@/types/api';
import { Button, Input, IconButton } from '@/components/ui';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setSession, clearSession } = useAuthStore();
  const redirectTo =
    (location.state as { from?: string } | null)?.from || '/dashboard';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [registrationOpen, setRegistrationOpen] = useState(false);

  useEffect(() => {
    getRegistrationStatus()
      .then((res) => setRegistrationOpen(res.open))
      .catch(() => setRegistrationOpen(false));
  }, []);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setError('Ingresa email y contraseña para continuar.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const sessionData = await login({
        email: trimmedEmail,
        password: trimmedPassword,
      });
      setSession(sessionData);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      clearSession();
      if (err instanceof ApiError && err.status === 401) {
        setError('Email o contraseña incorrectos');
      } else if (err instanceof NetworkError) {
        setError('Sin conexión con el servidor. Intenta de nuevo.');
      } else {
        setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-canvas p-0 lg:p-6">
      <div className="grid min-h-dvh w-full max-w-[1340px] overflow-hidden bg-shell lg:min-h-[760px] lg:grid-cols-[1.38fr_1fr] lg:rounded-[40px] lg:border lg:border-ink-dark lg:neo-shadow">
        {/* Left Panel */}
        <section
          aria-hidden="true"
          className="relative hidden overflow-hidden bg-lilac p-10 text-ink-dark lg:block"
        >
          <div className="pattern-radial absolute inset-0 opacity-50" />
          <div className="relative flex h-full flex-col">
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[.16em]">
              <MessageCircle className="h-4 w-4" />
              WhatsApp Ops
            </div>

            <h1 className="display-title mt-12 max-w-xl text-[clamp(4rem,7vw,7rem)]">
              Pedidos claros.
              <br />
              Operación en movimiento.
            </h1>

            <div className="relative mt-auto h-64">
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="absolute bottom-0 left-0 w-56 rounded-[26px] border border-ink-dark bg-yellow p-4 neo-shadow"
              >
                <p className="kicker">Pendiente</p>
                <p className="font-display mt-5 text-4xl font-bold">NUEVO PEDIDO</p>
                <div className="mt-4 h-2 rounded-full bg-ink-dark/20">
                  <div className="h-full w-2/3 rounded-full bg-coral" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="absolute bottom-8 left-48 w-56 rounded-[26px] border border-ink-dark bg-mint p-4 neo-shadow"
              >
                <p className="kicker">En proceso</p>
                <p className="font-display mt-5 text-4xl font-bold">EN MARCHA</p>
                <div className="mt-4 flex gap-2">
                  <span className="h-6 w-6 rounded-full bg-coral" />
                  <span className="h-6 w-20 rounded-full bg-ink-dark/15" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="absolute right-3 top-0 w-48 rounded-[26px] border border-ink-dark bg-coral p-4 neo-shadow"
              >
                <p className="kicker">Resumen</p>
                <div className="mt-4 flex h-16 items-end gap-2">
                  {[35, 58, 43, 72, 55].map((h, i) => (
                    <span
                      key={i}
                      className="w-full rounded-t bg-ink-dark"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              </motion.div>
            </div>

            <div className="flex gap-2">
              <span className="rounded-full border border-ink-dark bg-warm px-3 py-2 text-xs font-bold">
                WhatsApp
              </span>
              <span className="rounded-full border border-ink-dark bg-yellow px-3 py-2 text-xs font-bold">
                En tiempo real
              </span>
              <span className="rounded-full border border-ink-dark bg-mint px-3 py-2 text-xs font-bold">
                Menú
              </span>
            </div>
          </div>
        </section>

        {/* Right Panel */}
        <section className="flex min-h-dvh flex-col justify-center p-6 sm:p-10 lg:min-h-0 lg:p-12">
          <Link
            to="/"
            className="focus-ring mb-8 inline-flex w-fit items-center gap-2 rounded-full border border-ink-dark bg-warm px-4 py-2 text-[10px] font-black uppercase tracking-[.12em] text-ink-dark transition-transform hover:-translate-x-0.5"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al inicio
          </Link>

          <div className="mb-10 flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-full border border-ink-dark bg-coral text-ink-dark neo-shadow">
              <ChefHat className="h-6 w-6" />
            </div>
            <div>
              <p className="font-display text-2xl font-bold uppercase leading-none">
                Panel de pedidos
              </p>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-ink-soft">
                WhatsApp Ops
              </p>
            </div>
          </div>

          <div className="mb-8 lg:hidden">
            <div className="h-2 w-24 rounded-full bg-lilac" />
            <p className="font-display mt-4 text-4xl font-bold uppercase">
              Operación en movimiento.
            </p>
          </div>

          <p className="kicker text-yellow">Acceso seguro</p>
          <h2 className="display-title mt-2 text-5xl">Acceso operativo</h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-soft">
            Conecta con tu email y contraseña para gestionar tus pedidos y menú.
          </p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div>
              <Input
                type="email"
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={Boolean(error)}
                autoFocus
                autoComplete="email"
                disabled={loading}
              />
            </div>

            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                label="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={Boolean(error)}
                autoComplete="current-password"
                disabled={loading}
                className="pr-14"
              />
              <IconButton
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={
                  showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'
                }
                className="absolute right-1 top-8 h-10 w-10 border-0 bg-transparent"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </IconButton>
            </div>

            {error && (
              <p role="alert" aria-live="polite" className="text-sm font-medium text-coral">
                {error}
              </p>
            )}

            <Button
              type="submit"
              variant="danger"
              size="lg"
              fullWidth
              isLoading={loading}
            >
              Entrar al panel
            </Button>
          </form>

          {registrationOpen && (
            <p className="mt-5 text-center text-sm text-ink-soft">
              ¿No tienes cuenta?{' '}
              <Link
                to="/register"
                className="font-bold text-coral hover:underline"
              >
                Regístrate aquí
              </Link>
            </p>
          )}

          <div className="mt-7 flex gap-3 rounded-2xl border border-border bg-surface p-4 text-xs leading-relaxed text-ink-soft">
            <ShieldCheck className="h-5 w-5 shrink-0 text-mint" />
            <p>
              Tu contraseña se transmite de forma segura. Nunca se guarda en
              claro en el servidor.
            </p>
          </div>

          <div className="mt-5 flex items-center gap-2 text-[11px] font-bold text-ink-soft">
            <LockKeyhole className="h-3.5 w-3.5" />
            Autenticación requerida para operar
          </div>
        </section>
      </div>
    </main>
  );
}
