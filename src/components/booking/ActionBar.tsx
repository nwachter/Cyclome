"use client";

import { useRouter } from "next/navigation";

type Props = {
  backLabel?: string;
  backHref?: string;
  nextLabel: string;
  onNext: () => void;
  isNextDisabled?: boolean;
  isLoading?: boolean;
  secondary?: { label: string; onClick: () => void };
};

export default function ActionBar({
  backLabel = "Étape précédente",
  backHref,
  nextLabel,
  onNext,
  isNextDisabled = false,
  isLoading = false,
  secondary,
}: Props) {
  const router = useRouter();

  return (
    <div className="sticky bottom-0 border-t-2 border-t-line-strong bg-surface">
      <div className="mx-auto flex max-w-[1360px] items-center justify-between gap-md px-xl py-md">
        <button
          type="button"
          onClick={() => (backHref ? router.push(backHref) : router.back())}
          className="t-label text-fg-muted"
        >
          {backLabel}
        </button>

        <div className="flex items-center gap-md">
          {secondary && (
            <button type="button" onClick={secondary.onClick} className="t-label text-fg-accent">
              {secondary.label}
            </button>
          )}
          <button
            type="button"
            onClick={onNext}
            disabled={isNextDisabled || isLoading}
            className="t-label min-h-[44px] bg-accent px-lg text-fg-on-accent transition-colors hover:bg-accent-hover disabled:bg-sunken disabled:text-fg-disabled"
          >
            {isLoading ? "Patientez..." : nextLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
