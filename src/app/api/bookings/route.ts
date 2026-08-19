import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { bookingSchema } from "@/lib/validation/booking";
import { bookIntervention, SlotUnavailableError } from "@/server/booking";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: "Connexion requise" }, { status: 401 });
  }

  const parsed = bookingSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Données invalides", errors: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const client = await prisma.client.findUnique({ where: { userId: session.user.id } });
  if (!client) {
    return NextResponse.json({ message: "Fiche client introuvable" }, { status: 404 });
  }

  const input = parsed.data;

  // Le velo est cree au moment de la reservation, il reste ensuite dans le compte.
  const cycle = await prisma.cycle.create({
    data: {
      clientId: client.id,
      type: input.cycle.type,
      category: input.cycle.category,
      brand: input.cycle.brand,
      model: input.cycle.model,
      year: input.cycle.year,
      motorisation: input.cycle.motorisation || null,
      status: "ACTIVE",
    },
  });

  try {
    const result = await bookIntervention({
      clientId: client.id,
      cycleId: cycle.id,
      packageId: input.packageId,
      startSlotId: input.startSlotId,
      description: input.description,
      address: input.address,
      products: input.products,
    });

    return NextResponse.json(
      { interventionId: result.intervention.id, endsAt: result.endsAt },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof SlotUnavailableError) {
      return NextResponse.json({ message: error.message }, { status: 409 });
    }
    throw error;
  }
}
