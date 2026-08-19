import { prisma } from "@/lib/prisma";
import { isInsideZone, type PolygonGeometry, type Position } from "@/lib/geo";
import { findStartSlots, interventionEnd } from "@/lib/slots";

export async function findZoneForPoint(coords: Position) {
  const zones = await prisma.zone.findMany({
    where: { active: true, technicianId: { not: null } },
    include: { technician: { include: { user: { select: { name: true } } } } },
  });

  const match = zones.find((zone) =>
    isInsideZone(coords, zone.boundary as unknown as PolygonGeometry),
  );

  if (!match) return null;

  return {
    id: match.id,
    name: match.name,
    color: match.color ?? "#f46036",
    technicianName: match.technician?.user.name ?? null,
  };
}

// Renvoie les creneaux sur lesquels un forfait de cette duree peut demarrer,
// jour par jour, pour la semaine demandee.
export async function getAvailableStartSlots(
  zoneId: number,
  packageDuration: number,
  weekStart: Date,
) {
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 7);

  const availabilities = await prisma.availability.findMany({
    where: { zoneId, startDate: { gte: weekStart, lt: weekEnd } },
    include: { slots: { orderBy: { startDate: "asc" } } },
    orderBy: { startDate: "asc" },
  });

  const now = new Date();

  return availabilities.map((availability) => {
    const startSlots = findStartSlots(availability.slots, packageDuration)
      .filter((slot) => slot.startDate > now)
      .map((slot) => ({
        id: slot.id,
        startDate: slot.startDate.toISOString(),
        endDate: interventionEnd(slot.startDate, packageDuration).toISOString(),
      }));

    return {
      date: availability.startDate.toISOString(),
      startSlots,
    };
  });
}

export type DayAvailability = Awaited<ReturnType<typeof getAvailableStartSlots>>[number];
