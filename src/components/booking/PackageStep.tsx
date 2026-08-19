"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { useBooking } from "@/lib/booking-context";
import type { PackageItem } from "@/server/catalog";
import StepShell from "./StepShell";
import ActionBar from "./ActionBar";

export default function PackageStep() {
  const router = useRouter();
  const { booking, update } = useBooking();
  const [operationTypeId, setOperationTypeId] = useState<number | null>(null);

  const { data: packages = [], isLoading } = useQuery({
    queryKey: ["packages"],
    queryFn: async () => {
      const response = await api.get<PackageItem[]>("/packages");
      return response.data;
    },
  });

  const operationTypes = Array.from(
    new Map(packages.map((item) => [item.operationTypeId, item.operationTypeName])).entries(),
  );

  const visiblePackages = operationTypeId
    ? packages.filter((item) => item.operationTypeId === operationTypeId)
    : packages;

  function handleSelect(item: PackageItem) {
    update({
      selectedPackage: {
        id: item.id,
        name: item.name,
        duration: item.duration,
        price: item.price,
      },
      slot: null,
    });
  }

  return (
    <>
      <StepShell
        eyebrow="Étape 3 sur 5"
        title="Quel forfait pour votre vélo ?"
        lead="Chaque forfait fixe un prix et une durée. C'est cette durée qui détermine les créneaux qui vous seront proposés."
      >
        <div className="mb-lg flex flex-wrap items-center gap-sm border border-line bg-surface p-md">
          <span className="t-label text-fg-subtle">Type d&apos;opération</span>
          <button
            type="button"
            onClick={() => setOperationTypeId(null)}
            className={`t-label border px-sm py-xs ${
              operationTypeId === null
                ? "border-accent bg-accent text-fg-on-accent"
                : "border-line-strong bg-surface"
            }`}
          >
            Tout
          </button>
          {operationTypes.map(([id, name]) => (
            <button
              key={id}
              type="button"
              onClick={() => setOperationTypeId(id)}
              className={`t-label border px-sm py-xs ${
                operationTypeId === id
                  ? "border-accent bg-accent text-fg-on-accent"
                  : "border-line-strong bg-surface"
              }`}
            >
              {name}
            </button>
          ))}
        </div>

        {isLoading && <p className="text-fg-subtle">Chargement des forfaits...</p>}

        <div className="flex flex-col gap-sm" role="radiogroup" aria-label="Choix du forfait">
          {visiblePackages.map((item) => {
            const isSelected = booking.selectedPackage?.id === item.id;

            return (
              <button
                key={item.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => handleSelect(item)}
                className={`grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-lg border bg-surface p-xl text-left ${
                  isSelected ? "border-accent shadow-[inset_0_0_0_1px_var(--color-accent)]" : "border-line hover:border-line-strong"
                }`}
              >
                <span
                  className={`mt-1 grid size-[22px] shrink-0 place-items-center rounded-full border-2 ${
                    isSelected ? "border-accent" : "border-line-strong"
                  }`}
                >
                  {isSelected && <span className="size-[10px] rounded-full bg-accent" />}
                </span>

                <span>
                  <span className="t-display-3 block">{item.name}</span>
                  <span className="mt-2xs block text-sm text-fg-muted">{item.description}</span>
                </span>

                <span className="text-right">
                  <span className="block font-data text-3xl italic text-fg-accent">
                    {item.price.toFixed(0)} €
                  </span>
                  <span className="mt-2xs inline-block bg-contrast px-xs py-3xs font-data text-sm italic text-fg-on-inverse">
                    {item.duration} min
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-lg border-l-[6px] border-l-warning-500 bg-warning-50 p-md">
          <b className="t-label block">Pièces éventuelles non comprises</b>
          <p className="mt-2xs text-sm text-fg-muted">
            Le forfait couvre la main d&apos;œuvre et les consommables. Si une pièce doit être
            remplacée, le technicien annonce le prix avant de poser quoi que ce soit.
          </p>
        </div>
      </StepShell>

      <ActionBar
        backHref="/reservation/velo"
        nextLabel="Continuer vers les produits"
        onNext={() => router.push("/reservation/produits")}
        isNextDisabled={!booking.selectedPackage}
      />
    </>
  );
}
