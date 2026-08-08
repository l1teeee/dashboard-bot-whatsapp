/** Parses an HTML date value as a boundary in the user's local timezone. */
export function parseLocalDateBoundary(value: string, endOfDay = false): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day, endOfDay ? 23 : 0, endOfDay ? 59 : 0, endOfDay ? 59 : 0, endOfDay ? 999 : 0);

  // Reject values such as 2026-02-31 instead of allowing Date to roll them over.
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null;
  return date;
}

/** Medianoche de hoy en local. El filtro "proximas" no debe esconder las reservas
 *  de mas temprano del mismo dia: el personal todavia las marca como sentadas o
 *  no asistio despues de la hora. */
export function startOfToday(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}
