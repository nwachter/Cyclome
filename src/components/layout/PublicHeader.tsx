import Link from "next/link";
import Logo from "@/components/brand/Logo";
import { getCurrentUser } from "@/lib/session";
import { homePathForRole } from "@/lib/session";
import { HomeIcon } from "lucide-react";

export default async function PublicHeader() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-30 border-b border-b-line bg-canvas">
      <div className="mx-auto flex h-[88px] max-w-[1360px] items-center gap-lg px-xl">
        <div className="mr-auto">
          <Logo variant="contrast" />
        </div>

        <nav aria-label="Navigation principale" className="hidden gap-xl md:flex">
          <Link href="/#services" className="t-label">
            Services
          </Link>
          <Link href="/#forfaits" className="t-label">
            Forfaits
          </Link>
          <Link href="/#zones" className="t-label">
            Zones
          </Link>
        </nav>

        {user ? (
          <Link
            href={homePathForRole(user.role as string)}
            className="t-label min-h-[44px] min-w-[44px] flex transition-all items-center active:brightness-80 hover:brightness-[90%]  justify-center rounded-full content-center bg-accent text-fg-on-accent"
          >
            <HomeIcon className="inline h-5 w-5" color="#000000" strokeWidth={2.5} />
          </Link>
        ) : (
          <>
            <Link href="/connexion" className="t-label hidden md:block">
              Se connecter
            </Link>
            <Link
              href="/reservation"
              className="t-label min-h-[44px] content-center bg-accent px-lg text-fg-on-accent"
            >
              Réserver
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
