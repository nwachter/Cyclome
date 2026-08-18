import { requireRole } from "@/lib/session";
import AdminSidebar from "@/components/layout/AdminSidebar";
import AdminBottomNav from "@/components/layout/AdminBottomNav";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireRole(["ADMIN"]);

  return (
    <div className="flex min-h-screen bg-canvas">
      <AdminSidebar userName={user.name} />
      <div className="flex min-w-0 flex-1 flex-col pb-[60px] lg:pb-0">{children}</div>
      <AdminBottomNav />
    </div>
  );
}
