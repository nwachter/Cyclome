"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import ZoneHeader from "./ZoneHeader";
import ZoneList from "./ZoneList";
import ZoneForm, { type ZoneFormValues } from "./ZoneForm";
import { useZoneDrawing } from "@/hooks/useZoneDrawing";
import { useZoneMutations, type ZonePayload } from "@/hooks/useZoneMutations";
import type { ZoneListItem } from "@/server/zones";

// Leaflet utilise window, donc peut pas etre rendu cote serveur.
const ZoneMap = dynamic(() => import("./ZoneMap"), {
  ssr: false,
  loading: () => (
    <div className="grid h-full place-items-center bg-sunken">
      <span className="t-label text-fg-subtle">Chargement de la carte...</span>
    </div>
  ),
});

type Technician = { id: number; name: string };
type Props = { zones: ZoneListItem[]; technicians: Technician[] };

export default function ZonesView({ zones, technicians }: Props) {
  const drawing = useZoneDrawing();
  const mutations = useZoneMutations(drawing.openList);
  const [searchTerm, setSearchTerm] = useState("");

  const selectedZone = zones.find((zone) => zone.id === drawing.selectedZoneId) ?? null;
  const isList = drawing.mode.kind === "list";

  const visibleZones = zones.filter((zone) =>
    zone.name.toLowerCase().includes(searchTerm.trim().toLowerCase()),
  );

  const activeCount = zones.filter((zone) => zone.active).length;

  function handleBack() {
    mutations.resetErrors();
    drawing.openList();
  }

  function handleSave(values: ZoneFormValues) {
    const boundary = drawing.draftBoundary ?? selectedZone?.boundary;
    if (!boundary) return;

    const payload: ZonePayload = { ...values, boundary };

    if (drawing.mode.kind === "create") {
      mutations.createZone.mutate(payload);
    } else if (drawing.selectedZoneId) {
      mutations.updateZone.mutate({ zoneId: drawing.selectedZoneId, payload });
    }
  }

  function handleDelete() {
    if (!drawing.selectedZoneId) return;
    const confirmed = window.confirm("Supprimer définitivement cette zone ?");
    if (!confirmed) return;
    mutations.deleteZone.mutate(drawing.selectedZoneId);
  }

  const detailSubtitle = selectedZone
    ? `${selectedZone.technicianName ?? "Sans technicien"} · ${selectedZone.active ? "active" : "en pause"}`
    : "Nouveau tracé";

  return (
    <div className="flex min-h-screen flex-col lg:min-h-[820px]">
      <ZoneHeader
        mode={isList ? "list" : "detail"}
        title={isList ? "Zones" : (selectedZone?.name ?? "Nouvelle zone")}
        subtitle={isList ? `${zones.length} zones · ${activeCount} actives` : detailSubtitle}
        accentColor={selectedZone?.color}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onBack={handleBack}
        onCreate={drawing.openCreation}
      />

      <div className="flex flex-1 flex-col lg:grid lg:grid-cols-[400px_minmax(0,1fr)]">
        <div className="h-[280px] shrink-0 lg:order-2 lg:h-auto lg:min-h-[640px]">
          <ZoneMap
            zones={zones}
            selectedZoneId={drawing.selectedZoneId}
            isDrawing={drawing.isDrawing}
            draftBoundary={drawing.draftBoundary}
            onSelectZone={drawing.openZone}
            onShapeDrawn={drawing.finishDrawing}
          />
        </div>

        <aside className="flex flex-1 flex-col bg-surface lg:order-1 lg:border-r lg:border-r-line-strong">
          {isList ? (
            <ZoneList zones={visibleZones} onSelect={drawing.openZone} />
          ) : (
            <ZoneForm
              key={drawing.selectedZoneId ?? "new"}
              zone={selectedZone}
              technicians={technicians}
              draftBoundary={drawing.draftBoundary}
              isDrawing={drawing.isDrawing}
              isSaving={mutations.isSaving}
              isDeleting={mutations.deleteZone.isPending}
              errorMessage={mutations.errorMessage}
              onStartDrawing={drawing.startDrawing}
              onSave={handleSave}
              onDelete={handleDelete}
            />
          )}
        </aside>
      </div>
    </div>
  );
}
