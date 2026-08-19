"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useBooking } from "@/lib/booking-context";
import { CYCLE_BRANDS, CYCLE_CATEGORIES } from "@/lib/cycles";
import { cycleSchema } from "@/lib/validation/booking";
import StepShell from "./StepShell";
import ActionBar from "./ActionBar";

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 26 }, (_, index) => currentYear - index);

export default function CycleStep() {
  const router = useRouter();
  const { booking, update } = useBooking();

  const [category, setCategory] = useState(booking.cycle?.category ?? "");
  const [isElectric, setIsElectric] = useState(booking.cycle?.type === "ELECTRICAL");
  const [brand, setBrand] = useState(booking.cycle?.brand ?? CYCLE_BRANDS[0]!);
  const [model, setModel] = useState(booking.cycle?.model ?? "");
  const [year, setYear] = useState(booking.cycle?.year ?? currentYear);
  const [motorisation, setMotorisation] = useState(booking.cycle?.motorisation ?? "");
  const [description, setDescription] = useState(booking.description);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  function handleNext() {
    const parsed = cycleSchema.safeParse({
      type: isElectric ? "ELECTRICAL" : "MECHANICAL",
      category,
      brand,
      model,
      year,
      motorisation,
    });

    if (!parsed.success) {
      setErrors(parsed.error.flatten().fieldErrors);
      return;
    }

    if (description.trim().length < 5) {
      setErrors({ description: ["Décrivez le problème en quelques mots"] });
      return;
    }

    update({ cycle: parsed.data, description });
    router.push("/reservation/forfait");
  }

  return (
    <>
      <StepShell
        eyebrow="Étape 2 sur 5"
        title="Quel vélo réparons-nous ?"
        lead="Le type de vélo détermine les forfaits proposés à l'étape suivante. Un vélo à assistance électrique ouvre les forfaits de diagnostic."
      >
        <div className="mb-lg">
          <span className="t-label mb-2xs block text-fg-muted">Catégorie</span>
          <div className="flex flex-wrap gap-xs">
            {CYCLE_CATEGORIES.map((item) => (
              <button
                key={item}
                type="button"
                aria-pressed={category === item}
                onClick={() => setCategory(item)}
                className={`t-label border px-sm py-xs ${
                  category === item
                    ? "border-accent bg-accent text-fg-on-accent"
                    : "border-line-strong bg-surface text-fg hover:bg-sunken"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
          {errors.category && <p className="mt-2xs text-xs text-danger-500">{errors.category[0]}</p>}
        </div>

        <label className="mb-lg flex items-start gap-sm text-sm">
          <input
            type="checkbox"
            checked={isElectric}
            onChange={(event) => setIsElectric(event.target.checked)}
            className="mt-1 size-[18px] accent-accent"
          />
          <span>
            Vélo à assistance électrique
            <span className="mt-3xs block text-xs text-fg-subtle">
              Cochez si votre vélo a un moteur, quelle que soit sa catégorie.
            </span>
          </span>
        </label>

        <div className="mb-md grid gap-md md:grid-cols-2">
          <div>
            <label htmlFor="cycle-brand" className="t-label mb-2xs block text-fg-muted">
              Marque
            </label>
            <select
              id="cycle-brand"
              value={brand}
              onChange={(event) => setBrand(event.target.value)}
              className="min-h-[44px] w-full border border-line-strong bg-surface px-sm py-xs"
            >
              {CYCLE_BRANDS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="cycle-model" className="t-label mb-2xs block text-fg-muted">
              Modèle
            </label>
            <input
              id="cycle-model"
              type="text"
              value={model}
              onChange={(event) => setModel(event.target.value)}
              className="min-h-[44px] w-full border border-line-strong bg-surface px-sm py-xs"
            />
            {errors.model && <p className="mt-2xs text-xs text-danger-500">{errors.model[0]}</p>}
          </div>
        </div>

        <div className="mb-lg grid gap-md md:grid-cols-2">
          <div>
            <label htmlFor="cycle-year" className="t-label mb-2xs block text-fg-muted">
              Année
            </label>
            <select
              id="cycle-year"
              value={year}
              onChange={(event) => setYear(Number(event.target.value))}
              className="min-h-[44px] w-full border border-line-strong bg-surface px-sm py-xs"
            >
              {years.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          {isElectric && (
            <div>
              <label htmlFor="cycle-motor" className="t-label mb-2xs block text-fg-muted">
                Motorisation
              </label>
              <input
                id="cycle-motor"
                type="text"
                value={motorisation}
                placeholder="Ex. Bosch, moteur central"
                onChange={(event) => setMotorisation(event.target.value)}
                className="min-h-[44px] w-full border border-line-strong bg-surface px-sm py-xs"
              />
              <p className="mt-2xs text-xs text-fg-subtle">Demandé uniquement pour les VAE.</p>
            </div>
          )}
        </div>

        <div>
          <label htmlFor="cycle-issue" className="t-label mb-2xs block text-fg-muted">
            Décrivez le problème
          </label>
          <textarea
            id="cycle-issue"
            rows={4}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className="w-full border border-line-strong bg-surface px-sm py-xs"
          />
          <p className="mt-2xs text-xs text-fg-subtle">
            {description.length} / 1000 caractères, visible par le technicien avant son déplacement.
          </p>
          {errors.description && (
            <p className="mt-2xs text-xs text-danger-500">{errors.description[0]}</p>
          )}
        </div>
      </StepShell>

      <ActionBar
        backHref="/reservation/adresse"
        nextLabel="Continuer vers le forfait"
        onNext={handleNext}
      />
    </>
  );
}
