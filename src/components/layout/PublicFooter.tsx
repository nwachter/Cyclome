import Logo from "@/components/brand/Logo";

const serviceLinks = ["Forfaits d'entretien", "Diagnostic VAE", "Pièces et accessoires"];
const zoneLinks = ["Lyon 1er au 9e", "Villeurbanne, Caluire", "Bron, Vénissieux", "Écully, Tassin"];

export default function PublicFooter() {
  return (
    <footer className="bg-inverse-deep pb-xl pt-3xl text-fg-on-inverse">
      <div className="mx-auto max-w-[1360px] px-xl">
        <div className="grid gap-xl md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo variant="inverse" showBaseline={false} />
            <p className="mt-sm max-w-[30ch] text-sm opacity-70">
              Le réflexe vélo à domicile. Un service de l&apos;atelier LeCycleLyonnais, ouvert
              depuis 1958.
            </p>
          </div>

          <div>
            <h3 className="t-label-sm mb-md text-accent">Service</h3>
            <ul className="flex flex-col gap-2xs text-sm opacity-80">
              {serviceLinks.map((link) => (
                <li key={link}>{link}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="t-label-sm mb-md text-accent">Zones</h3>
            <ul className="flex flex-col gap-2xs text-sm opacity-80">
              {zoneLinks.map((link) => (
                <li key={link}>{link}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="t-label-sm mb-md text-accent">Contact</h3>
            <ul className="flex flex-col gap-2xs text-sm opacity-80">
              <li>14 rue de la Villette, Lyon 3e</li>
              <li>04 78 00 00 00</li>
              <li>bonjour@cyclome.fr</li>
            </ul>
          </div>
        </div>

        <div className="mt-2xl flex flex-wrap justify-between gap-sm border-t border-t-line-inverse pt-lg text-xs opacity-60">
          <span>© {new Date().getFullYear()} LeCycleLyonnais</span>
          <span>Mentions légales · Données personnelles · CGV</span>
        </div>
      </div>
    </footer>
  );
}
