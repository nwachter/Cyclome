import type { Metadata } from "next";
import { Oswald, Blinker, Exo_2 } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/lib/query-client";

const display = Oswald({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-oswald",
});
const body = Blinker({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700", "800"],
  variable: "--font-blinker",
});
const data = Exo_2({
  subsets: ["latin"],
  weight: ["800", "900"],
  style: ["italic"],
  variable: "--font-exo",
});

export const metadata: Metadata = {
  title: "Cyclôme : La réparation vélo à domicile",
  description:
    "Un technicien se déplace chez vous pour entretenir ou réparer votre vélo. Choisissez un forfait et un créneau, il arrive avec les pièces.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${display.variable} ${body.variable} ${data.variable}`}>
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
