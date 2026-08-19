import Link from "next/link";

export default function FinalCta() {
  return (
    <section className="bg-accent py-3xl text-fg-on-accent">
      <div className="mx-auto flex max-w-[1360px] flex-wrap items-center justify-between gap-xl px-xl">
        <div>
          <h2 className="t-display-1">
            Partez
            <br />
            En roue Libre
          </h2>
          <p className="mt-sm max-w-[34ch] opacity-80">
            Renseignez votre adresse, nous nous occupons du reste.
          </p>
        </div>
        <Link
          href="/reservation"
          className="t-label min-h-[44px] content-center bg-contrast px-lg text-fg-on-inverse"
        >
          Réserver maintenant
        </Link>
      </div>
    </section>
  );
}
