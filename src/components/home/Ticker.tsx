const words = [
  "Vélo musculaire",
  "VAE",
  "Pièces d'origine",
  "7j/7",
  "Devis fixe",
  "Métropole de Lyon",
];

export default function Ticker() {
  return (
    <div aria-hidden="true" className="overflow-hidden whitespace-nowrap bg-accent py-sm text-fg-on-accent">
      <div className="inline-flex gap-xl">
        {[0, 1].map((copy) => (
          <span key={copy} className="inline-flex gap-xl">
            {words.map((word) => (
              <span key={word} className="t-display-4">
                {word} <span className="opacity-55">✳</span>
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}
