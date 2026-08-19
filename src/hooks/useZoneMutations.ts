"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { api } from "@/lib/axios";
import type { PolygonInput } from "@/lib/validation/zone";

export const zoneKeys = {
  all: ["zones"] as const,
  detail: (zoneId: number) => ["zones", zoneId] as const,
};

export type ZonePayload = {
  name: string;
  description: string;
  color: string;
  technicianId: number | null;
  active: boolean;
  boundary: PolygonInput;
};

export function useZoneMutations(onDone: () => void) {
  const queryClient = useQueryClient();
  const router = useRouter();

  function refreshZones() {
    queryClient.invalidateQueries({ queryKey: zoneKeys.all });
    // Les zones sont chargees par un Server Component, il faut donc aussi
    // demander a Next de recalculer la page.
    router.refresh();
    onDone();
  }

  const createZone = useMutation({
    mutationFn: (payload: ZonePayload) => api.post("/zones", payload),
    onSuccess: refreshZones,
  });

  const updateZone = useMutation({
    mutationFn: ({ zoneId, payload }: { zoneId: number; payload: ZonePayload }) =>
      api.patch(`/zones/${zoneId}`, payload),
    onSuccess: refreshZones,
  });

  const deleteZone = useMutation({
    mutationFn: (zoneId: number) => api.delete(`/zones/${zoneId}`),
    onSuccess: refreshZones,
  });

  const isSaving = createZone.isPending || updateZone.isPending;
  const errorMessage =
    createZone.error?.message ?? updateZone.error?.message ?? deleteZone.error?.message ?? "";

  function resetErrors() {
    createZone.reset();
    updateZone.reset();
    deleteZone.reset();
  }

  return { createZone, updateZone, deleteZone, isSaving, errorMessage, resetErrors };
}
