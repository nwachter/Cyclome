/*Règles créneaux.
  CDC : 1 créneau accueille une intervention et que sa durée = celle du forfait. Les créneaux sont ouverts tous les quarts d'heure : un forfait de 45m démarre donc sur un créneau + couvre 2 autres, qui doivent devenir indisponibles.
 */

/* PAS entre 2 débuts de créneau, en mn. */
export const SLOT_MINUTES = 15;

export type Slot = { id: number; startDate: Date; booked: boolean };

/*Heure de fin réelle d'une intervention, d'après la durée de son forfait. */
export function interventionEnd(start: Date, durationMinutes: number): Date {
  return new Date(start.getTime() + durationMinutes * 60_000);
}

/*  Nombre de créneaux qu'un forfait recouvre, celui de départ compris. */
export function slotsCovered(durationMinutes: number): number {
  if (durationMinutes <= 0 || durationMinutes % SLOT_MINUTES !== 0) {
    throw new Error(`La durée d'un forfait doit être un multiple de ${SLOT_MINUTES} minutes`);
  }
  return durationMinutes / SLOT_MINUTES;
}

// Parmi les créneaux d'une journée, ceux sur lesquels un forfait de cette durée peut réellement démarrer : le créneau et tous ceux qu'il recouvre doivent être libres et se suivre sans trou.
export function findStartSlots(slots: Slot[], durationMinutes: number): Slot[] {
  const needed = slotsCovered(durationMinutes);
  const ordered = [...slots].sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
  const starts: Slot[] = [];

  for (let i = 0; i + needed <= ordered.length; i++) {
    const window = ordered.slice(i, i + needed);
    const allFree = window.every((slot) => !slot.booked);
    const contiguous = window.every((slot, k) => {
      if (k === 0) return true;
      const previous = window[k - 1]!;
      return slot.startDate.getTime() - previous.startDate.getTime() === SLOT_MINUTES * 60_000;
    });
    if (allFree && contiguous) starts.push(window[0]!);
  }
  return starts;
}

/* ids des créneaux qu'un forfait rendra indisponibles. */
export function slotsToBlock(
  slots: Slot[],
  startSlotId: number,
  durationMinutes: number,
): number[] {
  const needed = slotsCovered(durationMinutes);
  const ordered = [...slots].sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
  const index = ordered.findIndex((slot) => slot.id === startSlotId);

  if (index === -1) throw new Error("Créneau de départ introuvable");

  const window = ordered.slice(index, index + needed);
  if (window.length < needed)
    throw new Error("La journée se termine avant la fin de l'intervention");

  return window.map((slot) => slot.id);
}
