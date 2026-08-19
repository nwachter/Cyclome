import SummaryRail from "./SummaryRail";

type Props = {
  eyebrow: string;
  title: string;
  lead: string;
  children: React.ReactNode;
};

export default function StepShell({ eyebrow, title, lead, children }: Props) {
  return (
    <main className="mx-auto grid max-w-[1360px] items-start gap-2xl px-xl py-2xl lg:grid-cols-[minmax(0,1fr)_340px]">
      <div className="min-w-0">
        <p className="t-label-sm mb-sm flex items-center gap-xs text-fg-accent">
          <span className="h-[2px] w-6 bg-accent" />
          {eyebrow}
        </p>
        <h1 className="t-display-2 mb-sm">{title}</h1>
        <p className="mb-xl max-w-[56ch] text-fg-muted">{lead}</p>
        {children}
      </div>
      <SummaryRail />
    </main>
  );
}
