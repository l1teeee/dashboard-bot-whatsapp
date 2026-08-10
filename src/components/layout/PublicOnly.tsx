import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';
import { RouteFallback } from './RouteFallback';

interface PublicOnlyProps {
  children: React.ReactNode;
}

// Rutas de acceso (login, registro, invitacion) que no deben verse con sesion
// activa: si el usuario ya entro, lo devolvemos a donde queria ir.
export function PublicOnly({ children }: PublicOnlyProps) {
  const { status, account } = useAuthStore();
  const location = useLocation();

  if (status === 'idle' || status === 'loading') {
    return <RouteFallback variant="public" />;
  }

  if (status === 'authenticated' && account) {
    const from = (location.state as { from?: string } | null)?.from;
    return <Navigate to={from || '/dashboard'} replace />;
  }

  return <>{children}</>;
}
