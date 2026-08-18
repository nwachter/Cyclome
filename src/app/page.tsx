export default function Home() {
  return (
    <main className="mx-auto max-w-[1360px] px-xl py-4xl">
      <p className="t-label-sm text-fg-accent">Cyclôme</p>
      <h1 className="t-display-1 mt-md">La réparation vélo à domicile</h1>
      <p className="mt-lg max-w-[60ch] text-fg-muted">
        Squelette de départ. Le thème Tailwind est branché sur les tokens de design : cette page
        utilise déjà <code>text-fg-accent</code>, <code>py-4xl</code> et les classes typographiques.
      </p>
      <a
        href="/api/health"
        className="mt-xl inline-flex min-h-[44px] items-center bg-accent px-lg py-md text-fg-on-accent t-label transition-colors hover:bg-accent-hover"
      >
        Vérifier la santé de l&apos;application
      </a>
    </main>
  );
}
