"use client";

import { useState } from "react";
import type { ZoneListItem } from "@/server/zones";
import type { PolygonInput } from "@/lib/validation/zone";

type Technician = { id: number; name: string };

type Props = {
  zone: ZoneListItem | null;
  technicians: Technician[];
  draftBoundary: PolygonInput | null;
  isDrawing: boolean;
  isSaving: boolean;
  isDeleting: boolean;
  errorMessage: string;
  onBack: () => void;
  onStartDrawing: () => void;
  onSave: (values: {
    name: string;
    description: string;
    color: string;
    technicianId: number | null;
    active: boolean;
  }) => void;
  onDelete: () => void;
};

const colorChoices = ["#f46036", "#0b5581", "#17795c", "#d69e12"];

export default function ZoneForm({
  zone,
  technicians,
  draftBoundary,
  isDrawing,
  isSaving,
  isDeleting,
  errorMessage,
  onBack,
  onStartDrawing,
  onSave,
  onDelete,
}: Props) {
  const [name, setName] = useState(zone?.name ?? "");
  const [description, setDescription] = useState(zone?.description ?? "");
  const [color, setColor] = useState(zone?.color ?? colorChoices[0]!);
  const [technicianId, setTechnicianId] = useState<number | null>(zone?.technicianId ?? null);
  const [active, setActive] = useState(zone?.active ?? true);

  const hasBoundary = Boolean(draftBoundary ?? zone?.boundary);

  return (
    <>
      <div className="border-b border-b-line p-lg">
        <button type="button" onClick={onBack} className="t-label mb-sm text-fg-accent">
          Toutes les zones
        </button>
        <div className="flex items-center justify-between gap-sm">
          <span className="flex items-center gap-sm">
            <span className="size-[18px]" style={{ backgroundColor: color }} />
            <span className="t-display-3">{name || "Nouvelle zone"}</span>
          </span>
          {zone && (
            <span
              className={`t-label-sm px-xs py-3xs ${
                active ? "bg-success-50 text-success-500" : "border border-line text-fg-subtle"
              }`}
            >
              {active ? "Active" : "En pause"}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-md p-lg">
        {errorMessage && (
          <p role="alert" className="border-l-4 border-l-danger-500 bg-danger-50 p-md text-sm">
            {errorMessage}
          </p>
        )}

        {zone && (
          <div className="grid grid-cols-2 gap-px bg-line">
            <div className="bg-surface p-sm px-md">
              <b className="block font-data text-xl italic text-fg-accent">{zone.areaKm2} km²</b>
              <span className="t-label-sm text-fg-subtle">superficie</span>
            </div>
            <div className="bg-surface p-sm px-md">
              <b className="block font-data text-xl italic text-fg-accent">
                {zone.availabilityCount}
              </b>
              <span className="t-label-sm text-fg-subtle">plages ouvertes</span>
            </div>
          </div>
        )}

        <div>
          <label htmlFor="zone-name" className="t-label mb-2xs block text-fg-muted">
            Nom de la zone
          </label>
          <input
            id="zone-name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="min-h-[44px] w-full border border-line-strong bg-surface px-sm py-xs"
          />
        </div>

        <div>
          <label htmlFor="zone-technician" className="t-label mb-2xs block text-fg-muted">
            Technicien affecté
          </label>
          <select
            id="zone-technician"
            value={technicianId ?? ""}
            onChange={(event) =>
              setTechnicianId(event.target.value ? Number(event.target.value) : null)
            }
            className="min-h-[44px] w-full border border-line-strong bg-surface px-sm py-xs"
          >
            <option value="">Aucun pour le moment</option>
            {technicians.map((technician) => (
              <option key={technician.id} value={technician.id}>
                {technician.name}
              </option>
            ))}
          </select>
          <p className="mt-2xs text-xs text-fg-subtle">
            Sans référent, aucun créneau ne sera proposé sur cette zone.
          </p>
        </div>

        <div>
          <label htmlFor="zone-description" className="t-label mb-2xs block text-fg-muted">
            Description
          </label>
          <textarea
            id="zone-description"
            rows={2}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className="w-full border border-line-strong bg-surface px-sm py-xs"
          />
        </div>

        <div>
          <span className="t-label mb-2xs block text-fg-muted">Couleur sur la carte</span>
          <div className="flex gap-xs">
            {colorChoices.map((choice) => (
              <button
                key={choice}
                type="button"
                aria-label={`Couleur ${choice}`}
                onClick={() => setColor(choice)}
                className={`size-9 border-2 ${color === choice ? "border-line-strong" : "border-transparent"}`}
                style={{ backgroundColor: choice }}
              />
            ))}
          </div>
        </div>

        <div className="border border-line p-md">
          <span className="t-label block">Tracé</span>
          <p className="mt-2xs text-xs text-fg-subtle">
            {hasBoundary
              ? "Cliquez sur « Redessiner » pour remplacer le tracé actuel."
              : "Dessinez le contour de la zone sur la carte."}
          </p>
          <button
            type="button"
            onClick={onStartDrawing}
            className={`t-label mt-sm min-h-[44px] w-full border border-line-strong px-lg ${
              isDrawing ? "bg-accent text-fg-on-accent" : "bg-surface text-fg"
            }`}
          >
            {isDrawing ? "Cliquez sur la carte..." : hasBoundary ? "Redessiner" : "Dessiner"}
          </button>
        </div>

        <label className="flex items-start gap-sm text-sm">
          <input
            type="checkbox"
            checked={active}
            onChange={(event) => setActive(event.target.checked)}
            className="mt-1 size-[18px] accent-accent"
          />
          <span>
            Zone ouverte aux réservations
            <span className="mt-3xs block text-xs text-fg-subtle">
              Décochez pour la mettre en pause sans la supprimer.
            </span>
          </span>
        </label>

        <div className="flex gap-xs">
          <button
            type="button"
            disabled={isSaving || !name || !hasBoundary}
            onClick={() => onSave({ name, description, color, technicianId, active })}
            className="t-label min-h-[44px] flex-1 bg-accent px-lg text-fg-on-accent disabled:bg-sunken disabled:text-fg-disabled"
          >
            {isSaving ? "Enregistrement..." : "Enregistrer"}
          </button>
          {zone && (
            <button
              type="button"
              onClick={onDelete}
              disabled={isDeleting}
              className="t-label min-h-[44px] border border-danger-500 px-lg text-danger-500 disabled:border-line disabled:text-fg-disabled"
            >
              {isDeleting ? "Suppression..." : "Supprimer"}
            </button>
          )}
        </div>
      </div>
    </>
  );
}
