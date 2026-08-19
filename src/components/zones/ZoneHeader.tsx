"use client";

type Props = {
  mode: "list" | "detail";
  title: string;
  subtitle: string;
  accentColor?: string;
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
  onBack?: () => void;
  onCreate?: () => void;
};

export default function ZoneHeader({
  mode,
  title,
  subtitle,
  accentColor,
  searchTerm = "",
  onSearchChange,
  onBack,
  onCreate,
}: Props) {
  return (
    <header className="bg-inverse p-sm text-fg-on-inverse">
      <div className="flex min-h-[48px] items-center gap-sm">
        {mode === "detail" && (
          <button
            type="button"
            onClick={onBack}
            aria-label="Retour à la liste des zones"
            className="grid size-10 shrink-0 place-items-center border border-line-inverse"
          >
            <svg
              viewBox="0 0 24 24"
              className="size-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
            >
              <path d="M15 5l-7 7 7 7" />
            </svg>
          </button>
        )}

        <span className="min-w-0 flex-1 px-2xs">
          <span className="t-display-4 block truncate">{title}</span>
          <span className="block truncate text-xs opacity-70">{subtitle}</span>
        </span>

        {
          // mode === "detail" && accentColor && (
          //   <span
          //     className="size-5 shrink-0 border border-line-inverse"
          //     style={{ backgroundColor: accentColor }}
          //     aria-hidden="true"
          //   />
          // )
        }
      </div>

      {mode === "list" && (
        <div className="mt-sm flex gap-xs">
          <label className="flex min-h-[44px] flex-1 items-center gap-xs bg-surface px-sm text-fg">
            <svg
              viewBox="0 0 24 24"
              className="size-4 shrink-0 opacity-50"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-4-4" />
            </svg>
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => onSearchChange?.(event.target.value)}
              placeholder="Rechercher une zone ou commune..."
              aria-label="Rechercher une zone"
              className="w-full bg-transparent text-sm outline-none"
            />
          </label>
          <button
            type="button"
            onClick={onCreate}
            aria-label="Créer une zone"
            className="grid size-11 shrink-0 place-items-center bg-accent text-fg-on-accent"
          >
            <svg
              viewBox="0 0 24 24"
              className="size-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.6"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
        </div>
      )}
    </header>
  );
}
