"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { useSession } from "@/lib/auth-client";
import { useBooking } from "@/lib/booking-context";
import AuthModal from "@/components/auth/AuthModal";
import StepShell from "./StepShell";
import ActionBar from "./ActionBar";

export default function SummaryStep() {
  const router = useRouter();
  const { booking, reset, cartTotal, grandTotal } = useBooking();
  const { data: session, isPending } = useSession();
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const createBooking = useMutation({
    mutationFn: async () => {
      const response = await api.post<{ interventionId: number }>("/bookings", {
        address: booking.address,
        cycle: booking.cycle,
        packageId: booking.selectedPackage?.id,
        startSlotId: booking.slot?.id,
        description: booking.description,
        products: booking.cart.map((line) => ({
          productId: line.productId,
          quantity: line.quantity,
        })),
      });
      return response.data;
    },
    onSuccess: (data) => {
      reset();
      router.push(`/reservation/confirmation?intervention=${data.interventionId}`);
    },
  });

  function handleConfirm() {
    if (!session) {
      setIsAuthOpen(true);
      return;
    }
    createBooking.mutate();
  }

  const slotLabel = booking.slot
    ? new Date(booking.slot.startDate).toLocaleString("fr-FR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <>
      <StepShell
        eyebrow="Dernière étape"
        title="Votre réservation est prête"
        lead="Vérifiez les informations, puis confirmez. Le créneau vous est réservé quinze minutes, le temps de finaliser."
      >
        {createBooking.error && (
          <div role="alert" className="mb-lg border-l-[6px] border-l-danger-500 bg-danger-50 p-md">
            <b className="t-label block">La réservation a échoué</b>
            <p className="mt-2xs text-sm text-fg-muted">{createBooking.error.message}</p>
          </div>
        )}

        <div className="mb-sm border border-line bg-surface p-md">
          <div className="mb-sm flex items-center justify-between border-b border-b-line pb-xs">
            <h2 className="t-label">Intervention</h2>
            <span className="bg-sunken px-xs py-3xs font-data text-sm italic">
              {booking.selectedPackage?.duration} min
            </span>
          </div>
          <dl className="grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-2xs gap-x-sm text-sm">
            <dt className="t-label-sm text-fg-subtle">Forfait</dt>
            <dd>
              {booking.selectedPackage?.name} · {booking.selectedPackage?.price.toFixed(2)} €
            </dd>
            <dt className="t-label-sm text-fg-subtle">Créneau</dt>
            <dd>{slotLabel}</dd>
            <dt className="t-label-sm text-fg-subtle">Adresse</dt>
            <dd>
              {booking.address?.street}, {booking.address?.postalCode} {booking.address?.city}
            </dd>
            <dt className="t-label-sm text-fg-subtle">Vélo</dt>
            <dd>
              {booking.cycle?.brand} {booking.cycle?.model} · {booking.cycle?.year}
            </dd>
            <dt className="t-label-sm text-fg-subtle">Technicien</dt>
            <dd>
              {booking.zone?.technicianName} · zone {booking.zone?.name}
            </dd>
          </dl>
        </div>

        {booking.cart.length > 0 && (
          <div className="border border-line bg-surface p-md">
            <h2 className="t-label mb-sm border-b border-b-line pb-xs">Produits additionnels</h2>
            {booking.cart.map((line) => (
              <div
                key={line.productId}
                className="flex items-center justify-between border-b border-b-line-subtle py-xs text-sm last:border-b-0"
              >
                <span>
                  {line.name} <span className="text-fg-subtle">× {line.quantity}</span>
                </span>
                <span className="font-data text-sm italic text-fg-accent">
                  {(line.unitPrice * line.quantity).toFixed(2)} €
                </span>
              </div>
            ))}
            <div className="mt-sm flex items-baseline justify-between border-t-2 border-t-line-strong pt-sm">
              <span className="t-label">Sous-total produits</span>
              <span className="font-data text-xl italic text-fg-accent">
                {cartTotal.toFixed(2)} €
              </span>
            </div>
          </div>
        )}

        <div className="mt-lg flex items-baseline justify-between bg-inverse p-lg text-fg-on-inverse">
          <span className="t-display-4">Total à régler sur place</span>
          <span className="font-data text-4xl italic text-accent">{grandTotal.toFixed(2)} €</span>
        </div>
      </StepShell>

      <ActionBar
        backHref="/reservation/creneau"
        nextLabel={session ? "Confirmer la réservation" : "Créer un compte et réserver"}
        onNext={handleConfirm}
        isNextDisabled={isPending || !booking.slot}
        isLoading={createBooking.isPending}
      />

      <AuthModal
        open={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        defaultTab="signup"
        title="Finalisez votre réservation"
        subtitle="Un compte vous permet de suivre l'intervention et de retrouver vos vélos."
        onSuccess={() => {
          setIsAuthOpen(false);
          createBooking.mutate();
        }}
      />
    </>
  );
}
