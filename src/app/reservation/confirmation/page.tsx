import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";

type Props = { searchParams: Promise<{ intervention?: string }> };

export default async function ConfirmationPage({ searchParams }: Props) {
  await requireUser();
  const { intervention } = await searchParams;
  const interventionId = Number(intervention);

  if (Number.isNaN(interventionId)) notFound();

  const booking = await prisma.intervention.findUnique({
    where: { id: interventionId },
    include: {
      package: true,
      cycle: true,
      technician: { include: { user: { select: { name: true } } } },
    },
  });

  if (!booking) notFound();

  const slotLabel = booking.date?.toLocaleString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <main className="mx-auto max-w-[720px] px-xl py-4xl">
      <div className="bg-success-500 p-xl text-fg-on-inverse">
        <span className="t-label-sm block opacity-80">Réservation confirmée</span>
        <h1 className="t-display-2 mt-xs">C&apos;est noté</h1>
        <p className="mt-sm opacity-90">
          {booking.technician.user.name} passera chez vous {slotLabel}.
        </p>
      </div>

      <div className="mt-lg border border-line bg-surface p-lg">
        <dl className="grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-2xs gap-x-md text-sm">
          <dt className="t-label-sm text-fg-subtle">Référence</dt>
          <dd className="font-data italic">INT-{booking.id}</dd>
          <dt className="t-label-sm text-fg-subtle">Forfait</dt>
          <dd>
            {booking.package.name} · {booking.duration} min
          </dd>
          <dt className="t-label-sm text-fg-subtle">Vélo</dt>
          <dd>
            {booking.cycle.brand} {booking.cycle.model}
          </dd>
          <dt className="t-label-sm text-fg-subtle">Adresse</dt>
          <dd>
            {booking.address}, {booking.postalCode} {booking.city}
          </dd>
          <dt className="t-label-sm text-fg-subtle">Total</dt>
          <dd className="font-data text-lg italic text-fg-accent">
            {Number(booking.totalPrice).toFixed(2)} €
          </dd>
        </dl>

        <p className="mt-lg text-sm text-fg-muted">
          Un message vous préviendra quand le technicien partira de l&apos;atelier. Annulation
          gratuite jusqu&apos;à 48 heures avant le rendez-vous.
        </p>
      </div>

      <div className="mt-lg flex flex-wrap gap-sm">
        <Link
          href="/mon-espace"
          className="t-label min-h-[44px] content-center bg-accent px-lg text-fg-on-accent"
        >
          Voir mes interventions
        </Link>
        <Link
          href="/"
          className="t-label min-h-[44px] content-center border border-line-strong px-lg"
        >
          Retour à l&apos;accueil
        </Link>
      </div>
    </main>
  );
}
