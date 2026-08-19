const stats = [
  { value: "68", label: "ans d'atelier" },
  { value: "32", label: "communes couvertes" },
  { value: "48 h", label: "délai moyen" },
  { value: "4,9", label: "note clients" },
];

export default function StatsBar() {
  return (
    <section className="bg-contrast text-fg-on-inverse">
      <div className="mx-auto grid max-w-[1360px] grid-cols-2 px-xl lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="border-r border-r-line-inverse px-lg py-xl last:border-r-0">
            <b className="block font-data text-5xl italic text-accent">{stat.value}</b>
            <span className="t-label-sm mt-xs block opacity-80">{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
