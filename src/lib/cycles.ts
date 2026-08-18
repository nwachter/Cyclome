/* Catégories de cycles proposées à l'étape 2 de la réservation. */
export const CYCLE_CATEGORIES = ["Ville", "VTC", "VTT", "Route", "Pliant", "Cargo"] as const;

export type CycleCategory = (typeof CYCLE_CATEGORIES)[number];
