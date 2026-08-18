import { InterventionStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { slotsToBlock, interventionEnd, type Slot } from "@/lib/slots";
//Transaction where several queries run together (if 1 fails, all rollback, otherwise commit everything together
// Retirée quand un créneau est parti pendant que le client finalisait.
export class SlotUnavailableError extends Error {
  constructor() {
    super("Ce créneau vient d'être réservé");
    this.name = "SlotUnavailableError";
  }
}

export type BookingInput = {
  clientId: number;
  cycleId: number;
  packageId: number;
  startSlotId: number;
  description: string;
  address: {
    street: string;
    complement?: string;
    postalCode: string;
    city: string;
    latitude: number;
    longitude: number;
  };
  products?: { productId: number; quantity: number }[];
};

/* Réserve un créneau pour un client. Attention : deux clients peuvent viser le même  créneau à la même seconde.  On fait donc updateMany si booked: false. Si un seul des créneaux visés a déjà été pris, moins de lignes sont modifiées que prévu, et toute la transaction est annulée.
 */
export async function bookIntervention(input: BookingInput) {
  return prisma.$transaction(
    async (tx) => {
      const forfait = await tx.package.findUniqueOrThrow({ where: { id: input.packageId } });
      if (!forfait.active) throw new Error("Ce forfait n'est plus proposé");

      const startSlot = await tx.slot.findUniqueOrThrow({
        where: { id: input.startSlotId },
        include: { availability: { include: { zone: true } } },
      });

      const zone = startSlot.availability.zone;
      if (!zone.active || zone.technicianId === null) {
        throw new Error("Cette zone n'accepte pas de réservation");
      }

      // Créneaux de la même plage, pour savoir lesquels le forfait recouvre
      const daySlots: Slot[] = await tx.slot.findMany({
        where: { availabilityId: startSlot.availabilityId },
        select: { id: true, startDate: true, booked: true },
        orderBy: { startDate: "asc" },
      });

      const blockedIds = slotsToBlock(daySlots, startSlot.id, forfait.duration);

      //  condition booked=false est évaluée à l'écriture
      const locked = await tx.slot.updateMany({
        where: { id: { in: blockedIds }, booked: false },
        data: { booked: true },
      });
      if (locked.count !== blockedIds.length) throw new SlotUnavailableError();

      const lines = input.products ?? [];
      const products = lines.length
        ? await tx.product.findMany({ where: { id: { in: lines.map((line) => line.productId) } } })
        : [];

      const productsTotal = lines.reduce((sum, line) => {
        const product = products.find((p) => p.id === line.productId);
        if (!product) throw new Error(`Produit ${line.productId} introuvable`);
        return sum + Number(product.price) * line.quantity;
      }, 0);

      const intervention = await tx.intervention.create({
        data: {
          description: input.description,
          address: input.address.street,
          addressComplement: input.address.complement,
          postalCode: input.address.postalCode,
          city: input.address.city,
          location: {
            type: "Point",
            coordinates: [input.address.longitude, input.address.latitude],
          },
          totalPrice: new Prisma.Decimal(Number(forfait.price) + productsTotal),
          date: startSlot.startDate,
          duration: forfait.duration,
          status: InterventionStatus.PENDING,
          clientId: input.clientId,
          cycleId: input.cycleId,
          packageId: forfait.id,
          slotId: startSlot.id,
          technicianId: zone.technicianId,
          contains: {
            create: lines.map((line) => ({
              productId: line.productId,
              quantity: line.quantity,
              unitPrice: products.find((p) => p.id === line.productId)!.price,
            })),
          },
        },
        include: { package: true, slot: true, technician: { include: { user: true } } },
      });

      return {
        intervention,
        endsAt: interventionEnd(startSlot.startDate, forfait.duration),
        blockedSlots: blockedIds.length,
      };
    },
    { isolationLevel: Prisma.TransactionIsolationLevel.Serializable, timeout: 10_000 },
  );
}

/*Annule un interv + rend ses créneaux à nouveau réservables. L'auteur + le motif sont conservés sur l'intervention  */
export async function cancelIntervention(
  interventionId: number,
  reason: string,
  cancelledById: string,
) {
  return prisma.$transaction(async (tx) => {
    const intervention = await tx.intervention.findUniqueOrThrow({
      where: { id: interventionId },
      include: { slot: true },
    });

    if (intervention.status === "CANCELLED") return intervention;

    const daySlots: Slot[] = await tx.slot.findMany({
      where: { availabilityId: intervention.slot.availabilityId },
      select: { id: true, startDate: true, booked: true },
      orderBy: { startDate: "asc" },
    });

    // Symétrique de la réservation : on libère exactement ce qui avait été pris
    const releasedIds = slotsToBlock(daySlots, intervention.slotId, intervention.duration);
    await tx.slot.updateMany({ where: { id: { in: releasedIds } }, data: { booked: false } });

    return tx.intervention.update({
      where: { id: interventionId },
      data: {
        status: "CANCELLED",
        cancelledAt: new Date(),
        cancellationReason: reason,
        cancelledById,
      },
    });
  });
}
