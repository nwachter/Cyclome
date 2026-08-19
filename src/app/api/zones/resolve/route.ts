import { NextResponse } from "next/server";
import { findZoneForPoint } from "@/server/availability";

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const latitude = Number(params.get("lat"));
  const longitude = Number(params.get("lng"));

  if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
    return NextResponse.json({ message: "Coordonnées manquantes" }, { status: 400 });
  }

  const zone = await findZoneForPoint([longitude, latitude]);

  if (!zone) {
    return NextResponse.json({ message: "Adresse hors de nos zones" }, { status: 404 });
  }

  return NextResponse.json(zone);
}
