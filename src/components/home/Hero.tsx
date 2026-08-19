import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="mx-auto max-w-[1360px] px-xl lg:py-3xl py-2xl">
      <div className="grid items-center gap-xl lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
        <div className="bg-inverse p-xl text-fg-on-inverse lg:-mr-[44px] lg:p-2xl">
          <h1 className="t-display-1">
            <span className="block">On répare</span>
            <span className="block text-accent">votre vélo.</span>
            <span className="block">Chez vous.</span>
          </h1>

          <p className="mt-lg max-w-[33ch] text-fg-on-inverse/80">
            Un technicien formé en atelier se déplace avec les pièces et le matériel. Vous
            choisissez un forfait et un créneau, il fait le reste devant chez vous.
          </p>

          <div className="mt-xl flex flex-wrap gap-sm">
            <Link
              href="/reservation"
              className="t-label min-h-[44px] content-center bg-accent px-lg text-fg-on-accent transition-colors hover:bg-accent-hover"
            >
              Réserver un créneau
            </Link>
            <Link
              href="/#forfaits"
              className="t-label min-h-[44px] content-center border border-line-inverse px-lg text-fg-on-inverse hover:bg-surface hover:text-fg"
            >
              Voir les forfaits
            </Link>
          </div>
        </div>

        {/* <HeroArtwork /> */}
        <Image
          src="/image-bg-hero.svg"
          alt="Image de technicien en fond du hero de l'accueil"
          width={820}
          height={600}
          className="hidden lg:block"
        />
      </div>
    </section>
  );
}

function HeroArtwork() {
  return (
    <div className="relative">
      <svg
        viewBox="0 0 820 600"
        role="img"
        aria-label="Un technicien règle la transmission d'un vélo sur pied d'atelier"
        className="w-full"
      >
        <defs>
          <pattern id="hero-halftone" width="10" height="10" patternUnits="userSpaceOnUse">
            <circle cx="5" cy="5" r="1.7" fill="var(--color-flame-700)" opacity="0.32" />
          </pattern>
        </defs>

        <circle cx="430" cy="300" r="276" fill="var(--color-accent)" />
        <circle cx="430" cy="300" r="276" fill="url(#hero-halftone)" />

        <g
          fill="none"
          stroke="var(--color-inverse)"
          strokeWidth="11"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="320" cy="372" r="112" />
          <circle cx="606" cy="372" r="112" />
          <path d="M320 372 L416 224 L530 372 M416 224 L568 224 L320 372 M568 224 L606 372" />
          <path d="M416 224 L404 180 M374 172 L438 184" />
          <path d="M568 224 L584 172 M548 162 L622 172" />
        </g>
        <g stroke="var(--color-inverse)" strokeWidth="3.5" opacity="0.45">
          <path d="M320 260v224M208 372h224M240 292l160 160M400 292L240 452" />
          <path d="M606 260v224M494 372h224M526 292l160 160M686 292L526 452" />
        </g>
        <circle
          cx="462"
          cy="372"
          r="29"
          fill="none"
          stroke="var(--color-inverse)"
          strokeWidth="10"
        />
        <circle cx="320" cy="372" r="13" fill="var(--color-inverse)" />
        <circle cx="606" cy="372" r="13" fill="var(--color-inverse)" />
        <path
          d="M462 372 L482 484 M414 580 L552 580 M482 484 L482 580"
          fill="none"
          stroke="var(--color-inverse-deep)"
          strokeWidth="10"
          strokeLinecap="round"
        />

        <g>
          <polygon points="238,572 258,452 334,472 306,580" fill="var(--color-inverse)" />
          <polygon points="222,572 320,572 326,596 216,596" fill="var(--color-inverse-deep)" />
          <polygon points="254,466 288,318 372,340 340,484" fill="var(--color-inverse)" />
          <polygon points="336,340 428,398 412,430 320,378" fill="var(--color-inverse)" />
          <circle cx="332" cy="268" r="55" fill="var(--color-inverse)" />
          <path d="M279 262a55 55 0 0 1 108-13l-4 15z" fill="var(--color-inverse-deep)" />
          <g transform="translate(434,414) rotate(28)">
            <rect x="-8" y="-48" width="16" height="76" fill="var(--color-surface)" />
            <path
              d="M-22,-76 L-7,-76 L-7,-65 L7,-65 L7,-76 L22,-76 L22,-46 L-22,-46 Z"
              fill="var(--color-surface)"
            />
          </g>
        </g>
      </svg>

      <div className="absolute right-[2%] top-[6%] grid aspect-square w-[130px] content-center rounded-full bg-contrast px-md text-fg-on-inverse">
        <b className="t-display-4 block">Rapide.</b>
        <b className="t-display-4 block">Pro.</b>
        <b className="t-display-4 block">Local.</b>
        <b className="t-display-4 block text-accent">Fiable.</b>
      </div>
    </div>
  );
}
