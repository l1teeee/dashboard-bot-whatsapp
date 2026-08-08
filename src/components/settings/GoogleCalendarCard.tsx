import { useState, type ReactNode } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Button, ConfirmDialog, Skeleton } from '@/components/ui';
import { useAuthStore } from '@/store/auth';
import { formatDateTime } from '@/lib/format';
import {
  useGoogleIntegrationStatus,
  useGoogleConnect,
  useGoogleDisconnect,
} from '@/hooks/useGoogleIntegration';

function CardShell({ children }: { children: ReactNode }) {
  return (
    <section className="rounded-[30px] border border-border bg-surface p-6 neo-shadow sm:p-8">
      <div className="mb-6 flex items-start gap-4">
        <div className="rounded-lg bg-yellow p-3 text-ink-dark">
          <CalendarIcon className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <p className="kicker text-yellow">Integracion</p>
          <h3 className="font-display text-3xl font-bold uppercase">Google Calendar</h3>
        </div>
      </div>
      {children}
    </section>
  );
}

export function GoogleCalendarCard() {
  const { account } = useAuthStore();
  const isOwner = account?.role === 'owner';
  const [showConfirmDisconnect, setShowConfirmDisconnect] = useState(false);

  const { status, isLoading, isError, refetch } = useGoogleIntegrationStatus();
  const connectMutation = useGoogleConnect();
  const disconnectMutation = useGoogleDisconnect();

  // Sin estos tres casos la tarjeta desaparecia entera mientras cargaba o si la
  // peticion fallaba, sin decir nada. Con el backend todavia sin desplegar eso
  // es exactamente lo que se ve.
  if (isLoading) {
    return (
      <CardShell>
        <Skeleton className="h-20 w-full" />
      </CardShell>
    );
  }

  if (isError || !status) {
    return (
      <CardShell>
        <div className="space-y-4">
          <p className="text-sm text-ink-soft">
            No se pudo consultar el estado de la integracion con Google Calendar.
          </p>
          <Button variant="secondary" size="sm" onClick={() => refetch()}>
            Reintentar
          </Button>
        </div>
      </CardShell>
    );
  }

  if (!status.configured) {
    return (
      <CardShell>
        <p className="text-sm text-ink-soft">
          El administrador aun no ha configurado las credenciales de Google en el servidor.
          Contacta con el equipo tecnico para habilitar esta integracion.
        </p>
      </CardShell>
    );
  }

  return (
    <CardShell>
      <div className="space-y-6">
        {!status.connected && (
          <div>
            <p className="text-sm text-ink-soft">
              Conecta tu Google Calendar para que las reservas confirmadas aparezcan
              automaticamente en tu calendario.
            </p>
            {isOwner && (
              <div className="mt-4">
                <Button
                  onClick={() => connectMutation.mutate()}
                  isLoading={connectMutation.isPending}
                  variant="secondary"
                >
                  Conectar Google Calendar
                </Button>
              </div>
            )}
          </div>
        )}

        {status.connected && (
          <div className="space-y-4">
            <div>
              <p className="text-xs font-bold uppercase text-ink-soft">
                Estado de conexion
              </p>
              <p className="mt-2 flex items-center gap-2 font-bold">
                <span className="h-2 w-2 rounded-full bg-mint" />
                Conectado
              </p>
            </div>

            {status.calendar_id && (
              <div>
                <p className="text-xs font-bold uppercase text-ink-soft">
                  Calendario
                </p>
                <p className="mt-2 font-bold">{status.calendar_id}</p>
              </div>
            )}

            {status.connected_at && (
              <div>
                <p className="text-xs font-bold uppercase text-ink-soft">
                  Conectado desde
                </p>
                <p className="mt-2 text-sm">{formatDateTime(status.connected_at)}</p>
              </div>
            )}

            {isOwner && (
              <div className="border-t border-border pt-4">
                <Button
                  onClick={() => setShowConfirmDisconnect(true)}
                  isLoading={disconnectMutation.isPending}
                  variant="danger"
                  size="sm"
                >
                  Desconectar
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={showConfirmDisconnect}
        title="Desconectar Google Calendar"
        description="Si desconectas Google Calendar, las nuevas reservas no se sincronizaran con tu calendario. Las reservas existentes no se eliminaran del calendario."
        confirmLabel="Desconectar"
        tone="danger"
        isLoading={disconnectMutation.isPending}
        onConfirm={() => {
          disconnectMutation.mutate(undefined, {
            onSuccess: () => setShowConfirmDisconnect(false),
          });
        }}
        onCancel={() => setShowConfirmDisconnect(false)}
      />
    </CardShell>
  );
}
