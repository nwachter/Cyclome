"use client";

import dynamic from "next/dynamic";
import ZoneList from "./ZoneList";
import ZoneForm from "./ZoneForm";
import { useZoneDrawing } from "@/hooks/useZoneDrawing";
import { useZoneMutations, type ZonePayload } from "@/hooks/useZoneMutations";
import type { ZoneListItem } from "@/server/zones";

// Leaflet touche a window, il ne peut donc pas etre rendu cote serveur.
const ZoneMap = dynamic(() => import("./ZoneMap"), {
  ssr: false,
  loading: () => (
    <div className="grid h-full min-h-[620px] place-items-center bg-sunken">
      <span className="t-label text-fg-subtle">Chargement de la carte...</span>
    </div>
  ),
});

type Technician = { id: number; name: string };
type Props = { zones: ZoneListItem[]; technicians: Technician[] };

export default function ZonesView({ zones, technicians }: Props) {
  const drawing = useZoneDrawing();
  const mutations = useZoneMutations(drawing.openList);

  const selectedZone = zones.find((zone) => zone.id === drawing.selectedZoneId) ?? null;

  function handleBack() {
    mutations.resetErrors();
    drawing.openList();
  }

  function handleSave(values: Omit<ZonePayload, "boundary">) {
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

  return (
    <div className="grid min-h-[760px] grid-cols-1 lg:grid-cols-[400px_minmax(0,1fr)]">
      <aside className="flex flex-col border-r border-r-line-strong bg-surface">
        {drawing.mode.kind === "list" ? (
          <ZoneList zones={zones} onSelect={drawing.openZone} onCreate={drawing.openCreation} />
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
            onBack={handleBack}
            onStartDrawing={drawing.startDrawing}
            onSave={handleSave}
            onDelete={handleDelete}
          />
        )}
      </aside>

      <div className="relative bg-sunken">
        <ZoneMap
          zones={zones}
          selectedZoneId={drawing.selectedZoneId}
          isDrawing={drawing.isDrawing}
          draftBoundary={drawing.draftBoundary}
          onSelectZone={drawing.openZone}
          onShapeDrawn={drawing.finishDrawing}
        />
      </div>
    </div>
  );
}
