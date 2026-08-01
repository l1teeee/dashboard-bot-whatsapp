import { useConnectionStore } from '@/store/connection';

export function ConnectionBanner() {
  const isOffline = useConnectionStore((s) => s.isOffline);

  if (!isOffline) {
    return null;
  }

  return (
    <div
      className="bg-cancelled-soft text-cancelled border-b border-cancelled/20 px-4 py-2 text-sm font-medium"
      role="status"
    >
      Sin conexion al servidor. Reintentando automaticamente.
    </div>
  );
}
