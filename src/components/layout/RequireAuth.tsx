import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';
import { RouteFallback } from './RouteFallback';
import { ErrorState } from '@/components/ui';

interface RequireAuthProps {
  children: React.ReactNode;
}

export function RequireAuth({ children }: RequireAuthProps) {
  const { status, setStatus } = useAuthStore();
  const location = useLocation();

  if (status === 'idle' || status === 'loading') {
    // AppLayout has not mounted yet, so this needs its own complete shell.
    return <RouteFallback variant="shell" />;
  }

  if (status === 'unavailable') {
    return (
      <main className="min-h-dvh p-6 lg:grid lg:place-items-center">
        <ErrorState
          title="No pudimos restaurar tu sesión"
          message="No se pudo contactar al servidor. Tu sesión no se cerró; vuelve a intentarlo cuando recuperes conexión."
          onRetry={() => setStatus('idle')}
        />
      </main>
    );
  }

  if (status === 'anonymous') {
    // Guardamos la ruta pedida para volver a ella despues del login.
    return (
      <Navigate
        to="/login"
        state={{ from: `${location.pathname}${location.search}` }}
        replace
      />
    );
  }

  return <>{children}</>;
}
