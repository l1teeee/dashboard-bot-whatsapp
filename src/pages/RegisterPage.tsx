import { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import {
  ChefHat,
  Eye,
  EyeOff,
  LockKeyhole,
  AlertCircle,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/auth';
import { register, getRegistrationStatus } from '@/api/auth';
import { ApiError, NetworkError } from '@/types/api';
import { Button, Input, IconButton } from '@/components/ui';

export function RegisterPage() {
  const navigate = useNavigate();
  const { status, account, setSession, clearSession } = useAuthStore();
  const [name, setName] = useState('');
  const [restaurantName, setRestaurantName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signupCode, setSignupCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [registrationOpen, setRegistrationOpen] = useState<boolean | null>(null);
  const [requiresCode, setRequiresCode] = useState(false);

  useEffect(() => {
    getRegistrationStatus()
      .then((res) => {
        setRegistrationOpen(res.open);
        setRequiresCode(res.requires_code);
      })
      .catch(() => {
        setRegistrationOpen(false);
        setRequiresCode(false);
      });
  }, []);

  if (status === 'authenticated' && account) {
    return <Navigate to="/dashboard" replace />;
  }

  if (registrationOpen === false) {
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
            <p className="kicker text-yellow">Registro cerrado</p>
            <h2 className="font-display text-4xl font-bold uppercase">
              El registro no está disponible
            </h2>
          </div>

          <div className="flex gap-3 rounded-2xl border border-border bg-shell p-4 text-sm leading-relaxed text-ink-soft">
            <AlertCircle className="h-5 w-5 shrink-0 text-coral" />
            <p>
              Por ahora el registro está cerrado. Pídele a tu administrador que
              te envíe una invitación para unirte.
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

  if (registrationOpen === null) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-canvas">
        <div className="text-center">
          <p className="text-ink-soft">Cargando...</p>
        </div>
      </div>
    );
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedRestaurantName = restaurantName.trim();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const trimmedSignupCode = signupCode.trim();

    if (
      !trimmedName ||
      !trimmedRestaurantName ||
      !trimmedEmail ||
      !trimmedPassword
    ) {
      setError('Completa todos los campos.');
      return;
    }

    if (trimmedPassword.length < 10) {
      setError('La contraseña debe tener al menos 10 caracteres.');
      return;
    }

    if (requiresCode && !trimmedSignupCode) {
      setError('El código de alta es requerido.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload: any = {
        name: trimmedName,
        email: trimmedEmail,
        password: trimmedPassword,
        restaurant_name: trimmedRestaurantName,
      };

      if (requiresCode && trimmedSignupCode) {
        payload.signup_code = trimmedSignupCode;
      }

      const sessionData = await register(payload);
      setSession(sessionData);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      clearSession();
      if (err instanceof ApiError) {
        if (err.status === 403 && err.message.includes('codigo')) {
          setError('Código de alta inválido');
        } else if (err.status === 409) {
          setError(err.message);
        } else {
          setError(err.message || 'Error al registrarse');
        }
      } else if (err instanceof NetworkError) {
        setError('Sin conexión con el servidor. Intenta de nuevo.');
      } else {
        setError(err instanceof Error ? err.message : 'Error al registrarse');
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
            Crear cuenta
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
              autoFocus
              autoComplete="name"
              disabled={loading}
            />
          </div>

          <div>
            <Input
              type="text"
              label="Nombre del restaurante"
              value={restaurantName}
              onChange={(e) => setRestaurantName(e.target.value)}
              error={error || undefined}
              autoComplete="organization"
              disabled={loading}
            />
          </div>

          <div>
            <Input
              type="email"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={error || undefined}
              autoComplete="email"
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

          {requiresCode && (
            <div>
              <Input
                type="text"
                label="Código de alta"
                placeholder="Código de invitación"
                value={signupCode}
                onChange={(e) => setSignupCode(e.target.value)}
                error={error || undefined}
                disabled={loading}
              />
            </div>
          )}

          <Button
            type="submit"
            variant="danger"
            size="lg"
            fullWidth
            isLoading={loading}
          >
            Crear cuenta
          </Button>
        </form>

        <p className="text-center text-sm text-ink-soft">
          ¿Ya tienes cuenta?{' '}
          <a href="/login" className="font-bold text-coral hover:underline">
            Inicia sesión aquí
          </a>
        </p>

        <div className="flex gap-3 rounded-2xl border border-border bg-shell p-4 text-xs leading-relaxed text-ink-soft">
          <LockKeyhole className="h-5 w-5 shrink-0 text-mint" />
          <p>Tu contraseña se protege con encriptación de nivel empresarial.</p>
        </div>
      </motion.div>
    </main>
  );
}
