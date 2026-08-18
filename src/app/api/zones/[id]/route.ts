import { NextResponse } from "next/server";
import { requireApiRole } from "@/lib/api-guard";
import { zoneUpdateSchema } from "@/lib/validation/zone";
import { deleteZone, updateZone, ZoneInUseError, ZoneOverlapError } from "@/server/zones";

type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Context) {
  const guard = await requireApiRole(["ADMIN"]);
  if (guard) return guard;

  const { id } = await params;
  const zoneId = Number(id);
  if (Number.isNaN(zoneId)) {
    return NextResponse.json({ message: "Identifiant invalide" }, { status: 400 });
  }

  const body = await request.json();
  const parsed = zoneUpdateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Données invalides", errors: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  try {
    const zone = await updateZone(zoneId, parsed.data);
    return NextResponse.json(zone);
  } catch (error) {
    if (error instanceof ZoneOverlapError) {
      return NextResponse.json({ message: error.message }, { status: 409 });
    }
    throw error;
  }
}

export async function DELETE(_request: Request, { params }: Context) {
  const guard = await requireApiRole(["ADMIN"]);
  if (guard) return guard;

  const { id } = await params;
  const zoneId = Number(id);

  try {
    await deleteZone(zoneId);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if (error instanceof ZoneInUseError) {
      return NextResponse.json({ message: error.message }, { status: 409 });
    }
    throw error;
  }
}
