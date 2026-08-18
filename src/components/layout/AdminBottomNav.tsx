"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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

  return (
    <>
      {isSheetOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            aria-label="Fermer le menu"
            onClick={() => setIsSheetOpen(false)}
            className="absolute inset-0 bg-contrast/60"
          />
          <div className="absolute inset-x-0 bottom-0 border-t-2 border-t-line-strong bg-surface p-md">
            <span className="mx-auto mb-md block h-1 w-11 bg-line" />
            <div className="grid grid-cols-2 gap-2xs">
              {moreLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsSheetOpen(false)}
                  className={`t-label border p-md ${
                    isActive(link.href)
                      ? "border-accent bg-accent-subtle text-fg-accent"
                      : "border-line bg-canvas text-fg"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      <nav
        aria-label="Navigation administrateur"
        className="fixed inset-x-0 bottom-0 z-30 flex border-t-2 border-t-line-strong bg-surface lg:hidden"
      >
        {tabs.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className={`t-label-sm flex-1 py-sm text-center ${
              isActive(tab.href) ? "text-fg-accent shadow-[inset_0_3px_0_var(--color-accent)]" : "text-fg-subtle"
            }`}
          >
            {tab.label}
          </Link>
        ))}
        <button
          type="button"
          onClick={() => setIsSheetOpen(true)}
          className="t-label-sm flex-1 py-sm text-center text-fg-subtle"
        >
          Plus
        </button>
      </nav>
    </>
  );
}
