const steps = [
  {
    number: "01",
    title: "Réservez en ligne",
    text: "Adresse vérifiée, vélo renseigné, forfait choisi. Vingt secondes.",
  },
  {
    number: "02",
    title: "Un technicien se déplace",
    text: "Celui de votre zone, avec les pièces correspondant à votre forfait.",
  },
  {
    number: "03",
    title: "On répare chez vous",
    text: "Sur le trottoir, dans la cour ou au garage. Photos avant et après.",
  },
  {
    number: "04",
    title: "Vous roulez",
    text: "Compte rendu dans l'application, historique conservé pour la prochaine fois.",
  },
];

export default function HowItWorks() {
  return (
    <section id="process" className="bg-inverse-deep py-4xl text-fg-on-inverse">
      <div className="mx-auto max-w-[1360px] px-xl">
        <p className="t-label-sm mb-md flex items-center gap-xs text-accent">
          <span className="h-[2px] w-6 bg-accent" />
          Comment ça marche
        </p>
        <h2 className="t-display-1 max-w-[16ch]">
          De l&apos;adresse au <span className="text-accent">coup de pédale</span>
        </h2>

        <div className="mt-2xl grid gap-xl md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <div key={step.number} className="relative border-t border-t-line-inverse pt-lg">
              <span className="absolute -top-[2px] left-0 h-[3px] w-[38px] bg-accent" />
              <span className="block font-data text-4xl italic text-accent">{step.number}</span>
              <h3 className="t-display-4 mt-sm">{step.title}</h3>
              <p className="mt-xs text-sm opacity-75">{step.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
