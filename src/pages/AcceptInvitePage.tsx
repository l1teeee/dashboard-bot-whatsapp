import { useState } from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { ChefHat, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/auth';
import { acceptInvitation } from '@/api/auth';
import { ApiError, NetworkError } from '@/types/api';
import { Button, Input, IconButton } from '@/components/ui';

export function AcceptInvitePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { status, account, setSession, clearSession } = useAuthStore();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const token = searchParams.get('token');

  if (status === 'authenticated' && account) {
    return <Navigate to="/dashboard" replace />;
  }

  if (!token) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-canvas p-6">
        <div className="w-full max-w-md space-y-6 rounded-[30px] border border-border bg-surface p-8 neo-shadow">
          <div className="flex items-center gap-3">
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

          <div className="space-y-2">
            <p className="kicker text-coral">Error</p>
            <h2 className="font-display text-4xl font-bold uppercase">
              Enlace inválido
            </h2>
          </div>

          <div className="flex gap-3 rounded-2xl border border-border bg-shell p-4 text-sm leading-relaxed text-ink-soft">
            <AlertCircle className="h-5 w-5 shrink-0 text-coral" />
            <p>
              El enlace de invitación es inválido o ha expirado. Pídele a tu
              administrador que te genere uno nuevo.
            </p>
          </div>

          <a
            href="/login"
            className="block text-center font-bold text-coral hover:underline"
          >
            Volver a iniciar sesión
          </a>
        </div>
      </main>
    );
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!token) {
      setError('Token de invitación inválido');
      return;
    }

    const trimmedName = name.trim();
    const trimmedPassword = password.trim();

    if (!trimmedName || !trimmedPassword) {
      setError('Completa todos los campos.');
      return;
    }

    if (trimmedPassword.length < 10) {
      setError('La contraseña debe tener al menos 10 caracteres.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const sessionData = await acceptInvitation({
        token,
        name: trimmedName,
        password: trimmedPassword,
      });
      setSession(sessionData);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      clearSession();
      if (err instanceof ApiError && err.status === 400) {
        setError('El enlace de invitación es inválido o ha expirado.');
      } else if (err instanceof NetworkError) {
        setError('Sin conexión con el servidor. Intenta de nuevo.');
      } else {
        setError(err instanceof Error ? err.message : 'Error al aceptar invitación');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-canvas p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-6 rounded-[30px] border border-border bg-surface p-8 neo-shadow"
      >
        <div className="flex items-center gap-3">
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

        <div className="space-y-2">
          <p className="kicker text-yellow">Bienvenido</p>
          <h2 className="font-display text-4xl font-bold uppercase">
            Completar registro
          </h2>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <Input
              type="text"
              label="Nombre completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={error || undefined}
              aria-live="polite"
              autoFocus
              autoComplete="name"
              disabled={loading}
            />
          </div>

          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              label="Contraseña (mínimo 10 caracteres)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={error || undefined}
              aria-live="polite"
              autoComplete="new-password"
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

          <Button
            type="submit"
            variant="danger"
            size="lg"
            fullWidth
            isLoading={loading}
          >
            Completar registro
          </Button>
        </form>

        <p className="text-center text-sm text-ink-soft">
          ¿Ya tienes cuenta?{' '}
          <a href="/login" className="font-bold text-coral hover:underline">
            Inicia sesión aquí
          </a>
        </p>
      </motion.div>
    </main>
  );
}
