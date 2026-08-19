import type { Metadata } from "next";
import ZonesView from "@/components/zones/ZonesView";
import { getTechnicians, getZones } from "@/server/zones";

export const metadata: Metadata = { title: "Zones d'intervention | Cyclôme" };

export default async function AdminZonesPage() {
  const [zones, technicians] = await Promise.all([getZones(), getTechnicians()]);

  return <ZonesView zones={zones} technicians={technicians} />;
}
