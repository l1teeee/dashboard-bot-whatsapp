import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';
import { getOrders } from '@/api/orders';
import { ApiError, NetworkError } from '@/types/api';
import { Button, Card, CardBody, Input } from '@/components/ui';

export function LoginPage() {
  const navigate = useNavigate();
  const apiKey = useAuthStore((s) => s.apiKey);
  const setApiKey = useAuthStore((s) => s.setApiKey);
  const clearApiKey = useAuthStore((s) => s.clearApiKey);

  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (apiKey) {
    return <Navigate to="/" replace />;
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const key = value.trim();

    if (!key) {
      setError('Ingresa la API key');
      return;
    }

    setIsLoading(true);
    setError(null);
    setApiKey(key);

    try {
      await getOrders({ limit: 1 });
      navigate('/', { replace: true });
    } catch (err) {
      clearApiKey();
      if (err instanceof ApiError && err.status === 401) {
        setError('API key invalida');
      } else if (err instanceof NetworkError) {
        setError('Sin conexion con el servidor. Intenta de nuevo.');
      } else {
        setError(err instanceof Error ? err.message : 'Error al validar la clave');
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardBody className="space-y-6">
          <div>
            <h1 className="text-2xl font-semibold text-ink">Panel de pedidos</h1>
            <p className="text-ink-soft mt-2">Ingresa tu API key para continuar</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="password"
              label="API key"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              error={error || undefined}
              autoFocus
            />

            <Button
              type="submit"
              variant="primary"
              size="md"
              fullWidth
              isLoading={isLoading}
            >
              Entrar
            </Button>
          </form>

          <p className="text-xs text-ink-soft text-center">
            La clave se guarda solo en memoria. Al recargar la pagina se te pedira de nuevo.
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
