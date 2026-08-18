import type { Metadata } from "next";
import AdminHeader from "@/components/layout/AdminHeader";
import ZonesView from "@/components/zones/ZonesView";
import { getTechnicians, getZones } from "@/server/zones";

export const metadata: Metadata = { title: "Zones d'intervention | Cyclôme" };

export default async function AdminZonesPage() {
  const [zones, technicians] = await Promise.all([getZones(), getTechnicians()]);

  return (
    <>
      <AdminHeader breadcrumb="Exploitation" title="Zones d'intervention" />
      <ZonesView zones={zones} technicians={technicians} />
    </>
  );
}
