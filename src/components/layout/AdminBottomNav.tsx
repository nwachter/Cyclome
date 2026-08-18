"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_HEIGHT = 60;

const tabs = [
  { href: "/admin", label: "Accueil" },
  { href: "/admin/zones", label: "Zones" },
  { href: "/admin/planning", label: "Planning" },
  { href: "/admin/interventions", label: "Historique" },
];

const moreLinks = [
  { href: "/admin/forfaits", label: "Forfaits" },
  { href: "/admin/utilisateurs", label: "Utilisateurs" },
  { href: "/admin/produits", label: "Produits" },
  { href: "/admin/societe", label: "Paramètres" },
];

export default function AdminBottomNav() {
  const pathname = usePathname();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  }

  function closeSheet() {
    setIsSheetOpen(false);
  }

  return (
    <>
      {isSheetOpen && (
        <button
          type="button"
          aria-label="Fermer le menu"
          onClick={closeSheet}
          className="fixed inset-0 z-[1090] bg-contrast/60 lg:hidden"
        />
      )}

      {isSheetOpen && (
        <div
          className="fixed inset-x-0 z-[1095] border-t-2 border-t-line-strong bg-surface p-md lg:hidden"
          style={{ bottom: NAV_HEIGHT }}
        >
          <span className="mx-auto mb-md block h-1 w-11 bg-line" />
          <div className="grid grid-cols-2 gap-2xs">
            {moreLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeSheet}
                className={`t-label border p-md ${
                  isActive(link.href)
                    ? "border-accent-subtle text-fg-accent"
                    : "border-line  text-fg"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      <nav
        aria-label="Navigation administrateur"
        className="fixed inset-x-0 bottom-0 z-[1100] flex border-t-2 border-t-line-strong bg-surface lg:hidden"
        style={{ height: NAV_HEIGHT }}
      >
        {tabs.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            onClick={closeSheet}
            className={`t-label-sm flex flex-1 items-center justify-center text-center ${
              isActive(tab.href)
                ? "text-fg-accent shadow-[inset_0_3px_0_var(--color-accent)]"
                : "text-fg-subtle"
            }`}
          >
            {tab.label}
          </Link>
        ))}
        <button
          type="button"
          aria-expanded={isSheetOpen}
          onClick={() => setIsSheetOpen((open) => !open)}
          className={`t-label-sm flex flex-1 items-center justify-center text-center ${
            isSheetOpen ? "text-fg-on-accent  shadow-[inset_0_3px_0_#000000]" : "text-fg-subtle"
          }`}
        >
          Plus
        </button>
      </nav>
    </>
  );
}
