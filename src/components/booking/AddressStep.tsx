"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { useBooking, type SelectedZone } from "@/lib/booking-context";
import StepShell from "./StepShell";
import ActionBar from "./ActionBar";

type Suggestion = {
  label: string;
  street: string;
  postalCode: string;
  city: string;
  latitude: number;
  longitude: number;
};

export default function AddressStep() {
  const router = useRouter();
  const { booking, update } = useBooking();

  const [search, setSearch] = useState(booking.address?.street ?? "");
  const [complement, setComplement] = useState(booking.address?.complement ?? "");
  const [isListOpen, setIsListOpen] = useState(false);
  const [zoneError, setZoneError] = useState("");
  const [isChecking, setIsChecking] = useState(false);

  const { data: suggestions = [] } = useQuery({
    queryKey: ["address", search],
    queryFn: async () => {
      const response = await api.get<Suggestion[]>("/address", { params: { q: search } });
      return response.data;
    },
    enabled: search.trim().length >= 3 && isListOpen,
  });

  async function handlePick(suggestion: Suggestion) {
    setSearch(suggestion.street);
    setIsListOpen(false);
    setZoneError("");
    setIsChecking(true);

    try {
      const response = await api.get<SelectedZone>("/zones/resolve", {
        params: { lat: suggestion.latitude, lng: suggestion.longitude },
      });

      update({
        address: {
          street: suggestion.street,
          complement,
          postalCode: suggestion.postalCode,
          city: suggestion.city,
          latitude: suggestion.latitude,
          longitude: suggestion.longitude,
        },
        zone: response.data,
      });
    } catch (error) {
      update({ address: null, zone: null });
      setZoneError(error instanceof Error ? error.message : "Adresse hors de nos zones");
    } finally {
      setIsChecking(false);
    }
  }

  function handleNext() {
    if (!booking.address) return;
    update({ address: { ...booking.address, complement } });
    router.push("/reservation/velo");
  }

  return (
    <>
      <StepShell
        eyebrow="Étape 1 sur 5"
        title="Où intervenons-nous ?"
        lead="Votre adresse détermine la zone d'intervention, donc le technicien qui se déplacera et les créneaux qui vous seront proposés."
      >
        <div className="relative mb-md">
          <label htmlFor="address-search" className="t-label mb-2xs block text-fg-muted">
            Numéro et rue
          </label>
          <input
            id="address-search"
            type="text"
            value={search}
            autoComplete="off"
            onChange={(event) => {
              setSearch(event.target.value);
              setIsListOpen(true);
            }}
            placeholder="Ex. 24 rue Paul Bert, Lyon"
            className="min-h-[44px] w-full border border-line-strong bg-surface px-sm py-xs"
          />

          {isListOpen && suggestions.length > 0 && (
            <ul className="absolute inset-x-0 top-full z-10 border border-t-0 border-accent-strong bg-surface shadow-overlay">
              {suggestions.map((suggestion) => (
                <li key={suggestion.label}>
                  <button
                    type="button"
                    onClick={() => handlePick(suggestion)}
                    className="w-full border-b border-b-line-subtle px-sm py-sm text-left last:border-b-0 hover:bg-sunken"
                  >
                    <span className="block text-sm font-bold">{suggestion.street}</span>
                    <span className="block text-xs text-fg-subtle">
                      {suggestion.postalCode} {suggestion.city}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}

          <p className="mt-2xs text-xs text-fg-subtle">
            Sélectionnez une proposition pour valider l&apos;adresse.
          </p>
        </div>

        <div className="mb-lg">
          <label htmlFor="address-complement" className="t-label mb-2xs block text-fg-muted">
            Complément : étage, bâtiment, code
          </label>
          <input
            id="address-complement"
            type="text"
            value={complement}
            onChange={(event) => setComplement(event.target.value)}
            className="min-h-[44px] w-full border border-line-strong bg-surface px-sm py-xs"
          />
        </div>

        {isChecking && <p className="text-sm text-fg-subtle">Vérification de la zone...</p>}

        {zoneError && (
          <div className="border-l-[6px] border-l-warning-500 bg-warning-50 p-md">
            <b className="t-label block">Nous n&apos;intervenons pas encore ici</b>
            <p className="mt-2xs text-sm text-fg-muted">{zoneError}</p>
          </div>
        )}

        {booking.zone && booking.address && (
          <div className="border border-line-strong bg-surface p-lg">
            <span
              className="t-label-sm inline-block px-xs py-3xs text-fg-on-accent"
              style={{ backgroundColor: booking.zone.color }}
            >
              Zone {booking.zone.name}
            </span>
            <h2 className="t-display-4 mt-xs">Votre secteur est couvert</h2>
            <p className="mt-2xs text-sm text-fg-muted">
              {booking.address.street}, {booking.address.postalCode} {booking.address.city}
            </p>
            <div className="mt-md flex flex-wrap gap-xl border-t border-t-line pt-md">
              <div>
                <span className="t-label-sm block text-fg-subtle">Technicien référent</span>
                <b className="text-sm">{booking.zone.technicianName ?? "À affecter"}</b>
              </div>
              <div>
                <span className="t-label-sm block text-fg-subtle">Délai moyen</span>
                <b className="font-data text-sm italic text-fg-accent">48 h</b>
              </div>
            </div>
          </div>
        )}
      </StepShell>

      <ActionBar
        backLabel="Retour à l'accueil"
        backHref="/"
        nextLabel="Continuer vers le vélo"
        onNext={handleNext}
        isNextDisabled={!booking.address}
      />
    </>
  );
}
