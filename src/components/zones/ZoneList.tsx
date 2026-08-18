"use client";

import type { ZoneListItem } from "@/server/zones";

type Props = {
  zones: ZoneListItem[];
  onSelect: (zoneId: number) => void;
  onCreate: () => void;
};

export default function ZoneList({ zones, onSelect, onCreate }: Props) {
  const communesCovered = zones.filter((zone) => zone.active).length;

  return (
    <>
      <div className="border-b border-b-line p-lg">
        <div className="flex items-center justify-between gap-sm">
          <span className="t-display-4">{zones.length} zones</span>
          <span className="text-xs text-fg-subtle">{communesCovered} actives</span>
        </div>
        <button
          type="button"
          onClick={onCreate}
          className="t-label mt-md min-h-[44px] w-full bg-accent px-lg text-fg-on-accent transition-colors hover:bg-accent-hover"
        >
          Nouvelle zone
        </button>
      </div>

      <div className="flex flex-col">
        {zones.map((zone) => (
          <button
            key={zone.id}
            type="button"
            onClick={() => onSelect(zone.id)}
            className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-sm border-b border-b-line-subtle border-l-[6px] border-l-transparent p-md px-lg text-left hover:bg-sunken"
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
