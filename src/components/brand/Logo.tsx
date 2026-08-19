import Image from "next/image";
import Link from "next/link";

type Props = {
  variant?: "accent" | "contrast" | "inverse";
  size?: number;
  showBaseline?: boolean;
  href?: string;
};

export default function Logo({
  variant = "contrast",
  size = 36,
  showBaseline = true,
  href = "/",
}: Props) {
  const file =
    variant === "accent"
      ? "/logo-accent.svg"
      : variant === "inverse"
        ? "/logo-inverse.svg"
        : "/logo-contrast.svg";
  const wordColor =
    variant === "inverse"
      ? "text-fg-on-inverse"
      : variant === "accent"
        ? "text-fg-on-accent"
        : "text-fg";
  //const baselineColor = variant === "inverse" ? "text-fg-on-inverse/70" : "text-fg-subtle";

  const baselineColor =
    variant === "inverse"
      ? "text-fg-on-inverse"
      : variant === "accent"
        ? "text-fg-on-accent"
        : "text-fg-subtle";

  return (
    <Link href={href} className="flex  items-center gap-sm" aria-label="Cyclôme, accueil">
      <Image src={file} alt="" width={size} height={Math.round((size * 1024) / 806)} priority />
      <span>
        <span
          className={`block uppercase font-body text-xl font-extrabold leading-none ${wordColor}`}
        >
          Cyclôme
        </span>
        {showBaseline && (
          <span className={`t-label-sm mt-3xs block ${baselineColor}`}>
            La réparation vélo à domicile
          </span>
        )}
      </span>
    </Link>
  );
}
