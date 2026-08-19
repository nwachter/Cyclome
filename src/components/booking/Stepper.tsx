"use client";

import { usePathname } from "next/navigation";
import { useBooking } from "@/lib/booking-context";

export const bookingSteps = [
  { slug: "adresse", label: "Adresse" },
  { slug: "velo", label: "Vélo" },
  { slug: "forfait", label: "Forfait" },
  { slug: "produits", label: "Produits" },
  { slug: "creneau", label: "Créneau" },
];

export default function Stepper() {
  const pathname = usePathname();
  const { booking } = useBooking();

  const currentIndex = bookingSteps.findIndex((step) => pathname.includes(step.slug));

  const values: Record<string, string> = {
    adresse: booking.address ? `${booking.address.postalCode} ${booking.address.city}` : "À venir",
    velo: booking.cycle ? `${booking.cycle.brand} ${booking.cycle.model}` : "À venir",
    forfait: booking.selectedPackage?.name ?? "À venir",
    produits: booking.cart.length > 0 ? `${booking.cart.length} article(s)` : "Facultatif",
    creneau: booking.slot ? "Choisi" : "À venir",
  };

  return (
    <nav aria-label="Progression de la réservation" className="border-b border-b-line bg-surface">
      <ol className="mx-auto grid max-w-[1360px] grid-cols-5 px-xl">
        {bookingSteps.map((step, index) => {
          const isDone = index < currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <li
              key={step.slug}
              aria-current={isCurrent ? "step" : undefined}
              className={`flex items-center gap-sm border-t-[3px] py-md pr-lg ${
                isCurrent
                  ? "border-t-accent text-fg"
                  : isDone
                    ? "border-t-line-strong text-fg-muted"
                    : "border-t-line text-fg-subtle"
              }`}
            >
              <span
                className={`grid size-9 shrink-0 place-items-center font-data text-sm italic ${
                  isCurrent
                    ? "bg-accent text-fg-on-accent"
                    : isDone
                      ? "bg-contrast text-fg-on-inverse"
                      : "bg-sunken text-fg-subtle"
                }`}
              >
                {isDone ? "OK" : `0${index + 1}`}
              </span>
              <span className="min-w-0">
                <span className="t-label block truncate">{step.label}</span>
                <span className={`block truncate text-xs ${isCurrent ? "text-fg-accent" : "text-fg-subtle"}`}>
                  {isCurrent ? "En cours" : values[step.slug]}
                </span>
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
