import { NextResponse } from "next/server";
import { requireApiRole } from "@/lib/api-guard";
import { zoneCreateSchema } from "@/lib/validation/zone";
import { createZone, getZones, ZoneOverlapError } from "@/server/zones";

export async function GET() {
  const guard = await requireApiRole(["ADMIN"]);
  if (guard) return guard;

  const zones = await getZones();
  return NextResponse.json(zones);
}

export async function POST(request: Request) {
  const guard = await requireApiRole(["ADMIN"]);
  if (guard) return guard;

  const body = await request.json();
  const parsed = zoneCreateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Données invalides", errors: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  try {
    const zone = await createZone(parsed.data);
    return NextResponse.json(zone, { status: 201 });
  } catch (error) {
    if (error instanceof ZoneOverlapError) {
      return NextResponse.json({ message: error.message }, { status: 409 });
    }
    throw error;
  }
}
