// Categories d'usage proposees a l'etape 2 de la reservation.
export const CYCLE_CATEGORIES = ["Ville", "VTC", "VTT", "Route", "Pliant", "Cargo"] as const;

export type CycleCategory = (typeof CYCLE_CATEGORIES)[number];

export const CYCLE_BRANDS = [
  "Btwin",
  "Gitane",
  "Moustache",
  "Riese & Müller",
  "Specialized",
  "Trek",
  "Autre",
];
