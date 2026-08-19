"use client";

import { useBooking } from "@/lib/booking-context";

function formatSlot(startDate: string) {
  return new Date(startDate).toLocaleString("fr-FR", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function SummaryRail() {
  const { booking, cartTotal, grandTotal } = useBooking();

  const rows = [
    {
      key: booking.zone ? `Adresse · zone ${booking.zone.name}` : "Adresse",
      value: booking.address
        ? `${booking.address.street}, ${booking.address.postalCode} ${booking.address.city}`
        : "À renseigner",
      filled: Boolean(booking.address),
    },
    {
      key: "Vélo",
      value: booking.cycle
        ? `${booking.cycle.brand} ${booking.cycle.model} · ${booking.cycle.year}`
        : "À renseigner",
      filled: Boolean(booking.cycle),
    },
    {
      key: booking.selectedPackage ? `Forfait · ${booking.selectedPackage.duration} min` : "Forfait",
      value: booking.selectedPackage
        ? `${booking.selectedPackage.name} · ${booking.selectedPackage.price.toFixed(2)} €`
        : "À choisir",
      filled: Boolean(booking.selectedPackage),
    },
    {
      key: `Produits · ${booking.cart.length}`,
      value: booking.cart.length > 0 ? `${cartTotal.toFixed(2)} €` : "Aucun",
      filled: booking.cart.length > 0,
    },
    {
      key: "Créneau",
      value: booking.slot ? formatSlot(booking.slot.startDate) : "À choisir",
      filled: Boolean(booking.slot),
    },
  ];

  return (
    <aside
      aria-label="Récapitulatif de la réservation"
      className="border border-line-strong bg-surface lg:sticky lg:top-lg"
    >
      <div className="bg-inverse px-lg py-md text-fg-on-inverse">
        <span className="t-display-4">Votre réservation</span>
      </div>

      <div className="p-lg">
        {rows.map((row) => (
          <div
            key={row.key}
            className="grid grid-cols-[auto_minmax(0,1fr)] gap-sm border-b border-b-line-subtle py-sm last:border-b-0"
          >
            <span
              className={`size-7 shrink-0 ${row.filled ? "bg-accent" : "bg-sunken"}`}
              aria-hidden="true"
            />
            <span>
              <span className="t-label-sm block text-fg-subtle">{row.key}</span>
              <span className={`block text-sm ${row.filled ? "text-fg" : "text-fg-disabled"}`}>
                {row.value}
              </span>
            </span>
          </div>
        ))}

        <div className="mt-md flex items-baseline justify-between border-t-2 border-t-line-strong pt-md">
          <span className="t-label">Total</span>
          <span className="font-data text-3xl italic text-fg-accent">
            {grandTotal > 0 ? `${grandTotal.toFixed(2)} €` : "..."}
          </span>
        </div>

        <p className="mt-md text-xs text-fg-subtle">
          Paiement sur place, à la fin de l&apos;intervention. Annulation gratuite jusqu&apos;à 48 h
          avant.
        </p>
      </div>
    </aside>
  );
}
