"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { useBooking } from "@/lib/booking-context";
import type { DayAvailability } from "@/server/availability";
import StepShell from "./StepShell";
import ActionBar from "./ActionBar";

function startOfWeek(date: Date) {
  const result = new Date(date);
  const day = result.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  result.setDate(result.getDate() + diff);
  result.setHours(0, 0, 0, 0);
  return result;
}

function formatDay(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" });
}

function formatHour(iso: string) {
  return new Date(iso).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

export default function SlotStep() {
  const router = useRouter();
  const { booking, update } = useBooking();
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date()));

  const zoneId = booking.zone?.id;
  const packageId = booking.selectedPackage?.id;

  const { data: days = [], isLoading } = useQuery({
    queryKey: ["slots", zoneId, packageId, weekStart.toISOString()],
    queryFn: async () => {
      const response = await api.get<DayAvailability[]>("/slots", {
        params: { zoneId, packageId, weekStart: weekStart.toISOString() },
      });
      return response.data;
    },
    enabled: Boolean(zoneId && packageId),
  });

  function shiftWeek(direction: number) {
    const next = new Date(weekStart);
    next.setDate(next.getDate() + direction * 7);
    setWeekStart(next);
  }

  const totalSlots = days.reduce((sum, day) => sum + day.startSlots.length, 0);

  return (
    <>
      <StepShell
        eyebrow="Étape 5 sur 5"
        title="Quand passons-nous ?"
        lead={`Seuls les créneaux réellement tenables s'affichent : ceux d'un technicien de votre zone, d'une durée d'au moins ${booking.selectedPackage?.duration ?? 45} minutes.`}
      >
        <div className="mb-lg flex items-center justify-between gap-md">
          <h2 className="t-display-4">
            Semaine du{" "}
            {weekStart.toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}
          </h2>
          <div className="flex gap-2xs">
            <button
              type="button"
              onClick={() => shiftWeek(-1)}
              disabled={weekStart <= startOfWeek(new Date())}
              aria-label="Semaine précédente"
              className="size-9 border border-line-strong bg-surface disabled:text-fg-disabled"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => shiftWeek(1)}
              aria-label="Semaine suivante"
              className="size-9 border border-line-strong bg-surface"
            >
              ›
            </button>
          </div>
        </div>

        {isLoading && <p className="text-fg-subtle">Recherche des créneaux...</p>}

        {!isLoading && totalSlots === 0 && (
          <div className="border-l-[6px] border-l-warning-500 bg-warning-50 p-md">
            <b className="t-label block">Aucun créneau cette semaine</b>
            <p className="mt-2xs text-sm text-fg-muted">
              Votre zone est complète sur cette période. Essayez la semaine suivante.
            </p>
          </div>
        )}

        {days.map((day) => {
          if (day.startSlots.length === 0) return null;

          return (
            <section key={day.date} className="mb-lg">
              <div className="mb-sm flex items-center gap-sm">
                <h3 className="t-label">{formatDay(day.date)}</h3>
                <span className="text-xs text-fg-subtle">{day.startSlots.length} créneaux</span>
                <span className="h-px flex-1 bg-line" />
              </div>

              <div className="grid grid-cols-2 gap-xs md:grid-cols-4">
                {day.startSlots.map((slot) => {
                  const isSelected = booking.slot?.id === slot.id;

                  return (
                    <button
                      key={slot.id}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => update({ slot })}
                      className={`min-h-[44px] border px-md py-sm text-left ${
                        isSelected
                          ? "border-accent bg-accent text-fg-on-accent"
                          : "border-line-strong bg-surface hover:bg-sunken"
                      }`}
                    >
                      <span className="t-label block">{formatHour(slot.startDate)}</span>
                      <span className="mt-3xs block text-xs opacity-70">
                        jusqu&apos;à {formatHour(slot.endDate)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}

        <div className="border-l-[6px] border-l-marine-500 bg-marine-50 p-md">
          <b className="t-label block">Le créneau n&apos;est pas encore bloqué</b>
          <p className="mt-2xs text-sm text-fg-muted">
            Il repart dans le planning si la réservation n&apos;est pas confirmée à l&apos;étape
            suivante.
          </p>
        </div>
      </StepShell>

      <ActionBar
        backHref="/reservation/produits"
        nextLabel="Valider et récapituler"
        onNext={() => router.push("/reservation/recapitulatif")}
        isNextDisabled={!booking.slot}
      />
    </>
  );
}
