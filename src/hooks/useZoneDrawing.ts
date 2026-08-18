"use client";

import { useState } from "react";
import type { PolygonInput } from "@/lib/validation/zone";

export type ZoneMode = { kind: "list" } | { kind: "edit"; zoneId: number } | { kind: "create" };

// Regroupe l'etat de navigation du panneau et du trace en cours,
// pour que ZonesView ne porte plus cinq useState.
export function useZoneDrawing() {
  const [mode, setMode] = useState<ZoneMode>({ kind: "list" });
  const [draftBoundary, setDraftBoundary] = useState<PolygonInput | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  function openList() {
    setMode({ kind: "list" });
    setDraftBoundary(null);
    setIsDrawing(false);
  }

  function openZone(zoneId: number) {
    setMode({ kind: "edit", zoneId });
    setDraftBoundary(null);
    setIsDrawing(false);
  }

  function openCreation() {
    setMode({ kind: "create" });
    setDraftBoundary(null);
    setIsDrawing(true);
  }

  function finishDrawing(boundary: PolygonInput) {
    setDraftBoundary(boundary);
    setIsDrawing(false);
  }

  const selectedZoneId = mode.kind === "edit" ? mode.zoneId : null;

  return {
    mode,
    selectedZoneId,
    draftBoundary,
    isDrawing,
    openList,
    openZone,
    openCreation,
    startDrawing: () => setIsDrawing(true),
    finishDrawing,
  };
}
