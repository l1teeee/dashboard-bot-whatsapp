import { AnimatePresence, motion } from 'framer-motion';
import { SkeletonCard, EmptyState } from '@/components/ui';
import { fadeUp, staggerContainer } from '@/lib/motion';
import { ReservationCard } from './ReservationCard';
import { groupReservationsByDate } from './filterReservations';
import type { Reservation } from '@/types/reservation';

export function ReservationList({
  reservations,
  onSelectReservation,
  isLoading,
}: {
  reservations: Reservation[];
  onSelectReservation: (id: number) => void;
  isLoading: boolean;
}) {
  if (isLoading) return <div className="space-y-3"><SkeletonCard /><SkeletonCard /></div>;
  if (!reservations.length) {
    return <EmptyState title="Sin reservas" description="No hay reservas que mostrar" />;
  }

  const grouped = groupReservationsByDate(reservations);
  const entries = Array.from(grouped.entries());

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
      <AnimatePresence initial={false} mode="popLayout">
        {entries.map(([dateKey, dayReservations]) => (
          <motion.section key={dateKey} variants={fadeUp} className="space-y-3">
            <h3 className="font-display text-lg font-bold uppercase text-ink-soft">{dateKey}</h3>
            <div className="space-y-3">
              {dayReservations
                .sort(
                  (a, b) =>
                    new Date(a.reserved_at).getTime() - new Date(b.reserved_at).getTime(),
                )
                .map((reservation) => (
                  <motion.div
                    key={reservation.id}
                    layout
                    variants={fadeUp}
                  >
                    <ReservationCard
                      reservation={reservation}
                      onClick={onSelectReservation}
                      variant="list"
                    />
                  </motion.div>
                ))}
            </div>
          </motion.section>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
