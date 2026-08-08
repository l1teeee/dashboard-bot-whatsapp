import { useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button, EmptyState, ErrorState, PageHeader } from '@/components/ui';
import { ReservationFilters } from '@/components/reservations/ReservationFilters';
import { ReservationList } from '@/components/reservations/ReservationList';
import { ReservationDetail } from '@/components/reservations/ReservationDetail';
import { ReservationForm } from '@/components/reservations/ReservationForm';
import { filterReservations, type FilterState } from '@/components/reservations/filterReservations';
import { useReservations } from '@/hooks/useReservations';

const initial: FilterState = { status: 'all', phone: '', from: '', to: '', range: 'upcoming' };

export function ReservationsPage() {
  const { reservations, total, isLoading, isError, error, refetch } = useReservations();
  const [params, setParams] = useSearchParams();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [filters, setFilters] = useState<FilterState>(initial);
  const [isFormOpen, setFormOpen] = useState(false);

  useEffect(() => {
    const value = params.get('reservation');
    setSelectedId(value && /^\d+$/.test(value) ? Number(value) : null);
  }, [params]);

  const selectReservation = (id: number) => {
    const next = new URLSearchParams(params);
    next.set('reservation', String(id));
    setParams(next, { replace: true });
  };

  const closeReservation = () => {
    const next = new URLSearchParams(params);
    next.delete('reservation');
    setParams(next, { replace: true });
  };

  const filtered = useMemo(() => filterReservations(reservations, filters), [reservations, filters]);

  if (isError && !reservations.length) {
    return (
      <>
        <ErrorState
          message={error?.message || 'Error al cargar las reservas'}
          onRetry={() => refetch()}
        />
        <ReservationDetail reservationId={selectedId} onClose={closeReservation} />
      </>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        kicker="Registro"
        title="Todas las reservas"
        description={`Mostrando ${filtered.length} de ${reservations.length} cargadas · ${total} totales`}
        actions={
          <Button onClick={() => setFormOpen(true)}>
            Nueva reserva
          </Button>
        }
      />
      <ReservationFilters value={filters} onChange={setFilters} onReset={() => setFilters(initial)} />
      {!isLoading && !filtered.length ? (
        <EmptyState
          title="Sin reservas"
          description="No hay reservas que coincidan con los filtros"
          action={
            <Button variant="secondary" onClick={() => setFilters(initial)}>
              Limpiar filtros
            </Button>
          }
        />
      ) : (
        <ReservationList
          reservations={filtered}
          onSelectReservation={selectReservation}
          isLoading={isLoading}
        />
      )}
      <ReservationDetail reservationId={selectedId} onClose={closeReservation} />
      <ReservationForm open={isFormOpen} onClose={() => setFormOpen(false)} />
    </div>
  );
}
