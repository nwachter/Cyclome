"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/brand/Logo";

type NavItem = { href: string; label: string; count?: number };

const mainLinks: NavItem[] = [
  { href: "/admin", label: "Tableau de bord" },
  { href: "/admin/planning", label: "Planning" },
  { href: "/admin/interventions", label: "Interventions" },
  { href: "/admin/zones", label: "Zones" },
];

const referenceLinks: NavItem[] = [
  { href: "/admin/utilisateurs", label: "Utilisateurs" },
  { href: "/admin/forfaits", label: "Forfaits" },
  { href: "/admin/produits", label: "Produits" },
  { href: "/admin/societe", label: "Société" },
];

function NavLink({ item, isActive }: { item: NavItem; isActive: boolean }) {
  return (
    <Link
      href={item.href}
      className={`t-label flex items-center gap-sm border-l-[3px] px-md py-sm ${
        isActive
          ? "border-l-fg-on-accent bg-accent text-fg-on-accent"
          : "border-l-transparent text-fg-on-inverse hover:bg-inverse"
      }`}
    >
      <span>{item.label}</span>
      {item.count !== undefined && (
        <span className="ml-auto font-data text-xs italic">{item.count}</span>
      )}
    </Link>
  );
}

type Props = { userName: string; counts?: Record<string, number> };

export default function AdminSidebar({ userName, counts = {} }: Props) {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  }

  const initials = userName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <aside className="hidden w-[264px] flex-col bg-inverse-deep pt-lg lg:flex">
      <div className="px-lg pb-lg">
        <Logo variant="inverse" href="/admin" size={32} />
      </div>

      <nav aria-label="Navigation administrateur" className="flex flex-col">
        {mainLinks.map((item) => (
          <NavLink
            key={item.href}
            item={{ ...item, count: counts[item.href] }}
            isActive={isActive(item.href)}
          />
        ))}
      </nav>

      <nav aria-label="Référentiel" className="flex flex-col">
        {referenceLinks.map((item) => (
          <NavLink
            key={item.href}
            item={{ ...item, count: counts[item.href] }}
            isActive={isActive(item.href)}
          />
        ))}
      </nav>

      <div className="mt-auto flex items-center gap-sm border-t border-t-line-inverse p-lg">
        <span className="grid size-11 place-items-center rounded-full bg-accent font-data text-sm italic text-fg-on-accent">
          {initials}
        </span>
        <span className="t-label text-fg-on-inverse">
          {userName}
          <span className="mt-3xs block text-xs font-normal normal-case tracking-normal text-fg-on-inverse/60">
            Administratrice
          </span>
        </span>
      </div>
    </aside>
  );
}
