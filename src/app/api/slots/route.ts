import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAvailableStartSlots } from "@/server/availability";

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const zoneId = Number(params.get("zoneId"));
  const packageId = Number(params.get("packageId"));
  const weekStartParam = params.get("weekStart");

  if (Number.isNaN(zoneId) || Number.isNaN(packageId)) {
    return NextResponse.json({ message: "Paramètres manquants" }, { status: 400 });
  }

  const selectedPackage = await prisma.package.findUnique({ where: { id: packageId } });
  if (!selectedPackage) {
    return NextResponse.json({ message: "Forfait introuvable" }, { status: 404 });
  }

  const weekStart = weekStartParam ? new Date(weekStartParam) : new Date();
  weekStart.setHours(0, 0, 0, 0);

  const days = await getAvailableStartSlots(zoneId, selectedPackage.duration, weekStart);
  return NextResponse.json(days);
}
