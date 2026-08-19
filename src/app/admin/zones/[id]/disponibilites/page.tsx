import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AdminHeader from "@/components/layout/AdminHeader";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Disponibilités de la zone | Cyclôme" };

type Props = { params: Promise<{ id: string }> };

export default async function ZoneAvailabilitiesPage({ params }: Props) {
  const { id } = await params;
  const zoneId = Number(id);
  if (Number.isNaN(zoneId)) notFound();

  const zone = await prisma.zone.findUnique({
    where: { id: zoneId },
    include: {
      technician: { include: { user: { select: { name: true } } } },
      _count: { select: { availabilities: true } },
    },
  });

  if (!zone) notFound();

  return (
    <>
      <AdminHeader breadcrumb={`Exploitation · Zones · ${zone.name}`} title="Disponibilités" />
      <div className="p-xl">
        <p className="text-fg-muted">
          {zone._count.availabilities} plages ouvertes, technicien{" "}
          {zone.technician?.user.name ?? "non affecté"}.
        </p>
        <p className="mt-md text-sm text-fg-subtle">Écran à construire à l&apos;étape suivante.</p>
      </div>
    </>
  );
}
