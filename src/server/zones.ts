import { prisma } from "@/lib/prisma";
import { zonesOverlap, zoneAreaKm2, type PolygonGeometry } from "@/lib/geo";
import type { ZoneCreateInput, ZoneUpdateInput } from "@/lib/validation/zone";

export class ZoneOverlapError extends Error {
  constructor(public otherZoneName: string) {
    super(`Le tracé empiète sur la zone ${otherZoneName}`);
    this.name = "ZoneOverlapError";
  }
}

export class ZoneInUseError extends Error {
  constructor(public bookedCount: number) {
    super(`${bookedCount} rendez-vous sont déjà programmés sur cette zone`);
    this.name = "ZoneInUseError";
  }
}

export async function getZones() {
  const zones = await prisma.zone.findMany({
    orderBy: { name: "asc" },
    include: {
      technician: { include: { user: { select: { name: true } } } },
      _count: { select: { availabilities: true } },
    },
  });

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  // 2 compteurs affiches dans le detail.
  const [interventionCounts, freeSlotCounts] = await Promise.all([
    prisma.intervention.groupBy({
      by: ["technicianId"],
      where: { date: { gte: startOfMonth } },
      _count: { _all: true },
    }),
    prisma.slot.groupBy({
      by: ["availabilityId"],
      where: { booked: false, startDate: { gt: new Date() } },
      _count: { _all: true },
    }),
  ]);

  const availabilities = await prisma.availability.findMany({
    select: { id: true, zoneId: true },
  });

  function countFreeSlots(zoneId: number) {
    return availabilities
      .filter((availability) => availability.zoneId === zoneId)
      .reduce((total, availability) => {
        const found = freeSlotCounts.find((row) => row.availabilityId === availability.id);
        return total + (found?._count._all ?? 0);
      }, 0);
  }

  function countInterventions(technicianId: number | null) {
    if (technicianId === null) return 0;
    const found = interventionCounts.find((row) => row.technicianId === technicianId);
    return found?._count._all ?? 0;
  }

  return zones.map((zone) => ({
    id: zone.id,
    name: zone.name,
    description: zone.description,
    color: zone.color ?? "#f46036",
    active: zone.active,
    boundary: zone.boundary as unknown as PolygonGeometry,
    technicianId: zone.technicianId,
    technicianName: zone.technician?.user.name ?? null,
    areaKm2: zoneAreaKm2(zone.boundary as unknown as PolygonGeometry),
    availabilityCount: zone._count.availabilities,
    interventionsThisMonth: countInterventions(zone.technicianId),
    freeSlotsAhead: countFreeSlots(zone.id),
  }));
}

export type ZoneListItem = Awaited<ReturnType<typeof getZones>>[number];

export async function getTechnicians() {
  const technicians = await prisma.technician.findMany({
    include: { user: { select: { name: true } } },
    orderBy: { id: "asc" },
  });

  return technicians.map((technician) => ({
    id: technician.id,
    name: technician.user.name,
  }));
}

// Un tracé qui recouvre une autre zone causerait une erreur d'adresse, on throw error
async function assertNoOverlap(boundary: PolygonGeometry, ignoreZoneId?: number) {
  const others = await prisma.zone.findMany({
    where: ignoreZoneId ? { id: { not: ignoreZoneId } } : undefined,
    select: { name: true, boundary: true },
  });

  for (const other of others) {
    if (zonesOverlap(boundary, other.boundary as unknown as PolygonGeometry)) {
      throw new ZoneOverlapError(other.name);
    }
  }
}

export async function createZone(input: ZoneCreateInput) {
  await assertNoOverlap(input.boundary);

  return prisma.zone.create({
    data: {
      name: input.name,
      description: input.description || null,
      color: input.color,
      boundary: input.boundary,
      technicianId: input.technicianId,
      active: input.active,
    },
  });
}

export async function updateZone(zoneId: number, input: ZoneUpdateInput) {
  if (input.boundary) {
    await assertNoOverlap(input.boundary, zoneId);
  }

  return prisma.zone.update({
    where: { id: zoneId },
    data: {
      name: input.name,
      description: input.description === "" ? null : input.description,
      color: input.color,
      boundary: input.boundary,
      technicianId: input.technicianId,
      active: input.active,
    },
  });
}

export async function deleteZone(zoneId: number) {
  const bookedCount = await prisma.slot.count({
    where: {
      availability: { zoneId },
      booked: true,
      startDate: { gt: new Date() },
    },
  });

  if (bookedCount > 0) throw new ZoneInUseError(bookedCount);

  return prisma.zone.delete({ where: { id: zoneId } });
}
