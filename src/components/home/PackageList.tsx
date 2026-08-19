import Link from "next/link";
import type { PackageItem } from "@/server/catalog";

function formatPrice(price: number) {
  return `${price.toFixed(0)} €`;
}

export default function PackageList({ packages }: { packages: PackageItem[] }) {
  return (
    <section id="forfaits" className="mx-auto max-w-[1360px] px-xl py-4xl">
      <div className="mb-2xl flex flex-wrap items-end justify-between gap-xl">
        <div>
          <p className="t-label-sm mb-md flex items-center gap-xs text-fg-accent">
            <span className="h-[2px] w-6 bg-accent" />
            Nos forfaits
          </p>
          <h2 className="t-display-1">
            Un prix fixe,
            <br />
            <span className="text-fg-accent-display">une durée fixe</span>
          </h2>
        </div>
        <p className="max-w-[38ch] text-fg-muted">
          Le forfait détermine la durée de l&apos;intervention, et la durée détermine les créneaux
          qui vous sont proposés. Aucune surprise à l&apos;arrivée.
        </p>
      </div>

      <div className="grid gap-lg md:grid-cols-2 lg:grid-cols-3">
        {packages.map((item) => (
          <article
            key={item.id}
            className="flex flex-col border border-line bg-surface p-xl transition-colors hover:border-accent"
          >
            <div className="mb-md flex items-baseline justify-between gap-sm">
              <h3 className="t-display-3">{item.name}</h3>
              <span className="font-data text-3xl italic text-fg-accent">
                {formatPrice(item.price)}
              </span>
            </div>

            <p className="mb-lg text-sm text-fg-muted">{item.description}</p>

            <div className="mt-auto flex items-center justify-between pt-md">
              <span className="t-label-sm text-fg-subtle">{item.operationTypeName}</span>
              <span className="bg-contrast px-xs py-3xs font-data text-sm italic text-fg-on-inverse">
                {item.duration} min
              </span>
            </div>
          </article>
        ))}
      </div>

      <Link
        href="/reservation"
        className="t-label mt-2xl inline-flex min-h-[44px] items-center bg-accent px-lg text-fg-on-accent transition-colors hover:bg-accent-hover"
      >
        Réserver un créneau
      </Link>
    </section>
  );
}
