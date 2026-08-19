const words = [
  "Vélo musculaire",
  "VAE",
  "Pièces d'origine",
  "7j/7",
  "Devis fixe",
  "Métropole de Lyon",
  "Vélo musculaire",
  "VAE",
  "Pièces d'origine",
  "7j/7",
  "Devis fixe",
  "Métropole de Lyon",
  "Vélo musculaire",
  "VAE",
  "Pièces d'origine",
  "7j/7",
  "Devis fixe",
  "Métropole de Lyon",
];

export default function Ticker() {
  return (
    <div
      aria-hidden="true"
      className="overflow-hidden whitespace-nowrap bg-accent py-sm text-fg-on-accent"
    >
      <style>{`
        @keyframes ticker {
          from { transform: translateX(0%); }
          to { transform: translateX(-100%); }
        }

        .ticker-track {
          animation: ticker 60s linear infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .ticker-track { animation: none; }
        }
      `}</style>
      <div className="ticker-track inline-flex gap-xl">
        {[0, 1].map((copy) => (
          <span key={copy} className="inline-flex gap-xl">
            {words.map((word, i) => (
              <span key={`${word}-${i}`} className="t-display-4">
                {word} <span className="opacity-55">✳</span>
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}
