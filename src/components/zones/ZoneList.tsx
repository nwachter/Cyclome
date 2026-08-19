"use client";

import type { ZoneListItem } from "@/server/zones";

type Props = {
  zones: ZoneListItem[];
  onSelect: (zoneId: number) => void;
};

export default function ZoneList({ zones, onSelect }: Props) {
  if (zones.length === 0) {
    return (
      <p className="p-lg text-sm text-fg-subtle">Aucune zone ne correspond à cette recherche.</p>
    );
  }

  return (
    <>
      <div className="flex flex-col">
        {zones.map((zone) => (
          <button
            key={zone.id}
            type="button"
            onClick={() => onSelect(zone.id)}
            className="grid grid-cols-[auto_minmax(0,1fr)_auto_auto] items-center gap-sm border-b border-b-line-subtle border-l-[6px] border-l-transparent px-lg py-md text-left hover:bg-sunken"
          >
            <span
              className="size-[14px] shrink-0"
              style={{ backgroundColor: zone.color, opacity: zone.active ? 1 : 0.45 }}
            />
            <span>
              <span className={`t-label block ${zone.active ? "text-fg" : "text-fg-disabled"}`}>
                {zone.name}
              </span>
              <span className="block text-xs text-fg-subtle">
                {zone.technicianName ?? "Aucun technicien"} · {zone.areaKm2} km²
              </span>
            </span>
            <span
              className={`t-label-sm px-xs py-3xs ${
                zone.active ? "bg-success-50 text-success-500" : "border border-line text-fg-subtle"
              }`}
            >
              {zone.active ? "Active" : "En pause"}
            </span>
            <svg
              viewBox="0 0 24 24"
              className="size-4 text-fg-subtle"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
            >
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ))}
      </div>

      <p className="mt-auto border-t border-t-line p-lg text-xs text-fg-subtle">
        Une zone en pause reste enregistrée mais n&apos;est plus proposée aux clients. Les
        rendez-vous déjà pris sont conservés.
      </p>
    </>
  );
}
