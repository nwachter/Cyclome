import { requireUser } from "@/lib/session";

export default async function ClientLayout({ children }: { children: React.ReactNode }) {
  await requireUser();
  return <>{children}</>;
}
