import { z } from "zod";

export const addressSchema = z.object({
  street: z.string().trim().min(4, "Adresse trop courte").max(150),
  complement: z.string().trim().max(150).optional().or(z.literal("")),
  postalCode: z.string().trim().regex(/^\d{5}$/, "Code postal invalide"),
  city: z.string().trim().min(2).max(60),
  latitude: z.number(),
  longitude: z.number(),
});

export const cycleSchema = z.object({
  type: z.enum(["MECHANICAL", "ELECTRICAL"]),
  category: z.string().trim().min(2, "Choisissez une catégorie"),
  brand: z.string().trim().min(2, "Marque requise").max(50),
  model: z.string().trim().min(1, "Modèle requis").max(50),
  year: z.number().int().min(1950).max(new Date().getFullYear() + 1),
  motorisation: z.string().trim().max(60).optional().or(z.literal("")),
});

export const bookingSchema = z.object({
  address: addressSchema,
  cycle: cycleSchema,
  packageId: z.number().int().positive(),
  startSlotId: z.number().int().positive(),
  description: z.string().trim().min(5, "Décrivez le problème en quelques mots").max(1000),
  products: z
    .array(z.object({ productId: z.number().int().positive(), quantity: z.number().int().min(1) }))
    .default([]),
});

export type AddressInput = z.infer<typeof addressSchema>;
export type CycleInput = z.infer<typeof cycleSchema>;
export type BookingInput = z.infer<typeof bookingSchema>;
