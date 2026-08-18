import { z } from "zod";

// Assoc [longitude, latitude] tel que produit par la carte.
const position = z.tuple([z.number().min(-180).max(180), z.number().min(-90).max(90)]);

//Anneau = au moins 4 points, le dernier identique au premier.
const linearRing = z
  .array(position)
  .min(4, "Un tracé demande au moins trois points distincts")
  .refine(
    (ring) => {
      const first = ring[0];
      const last = ring[ring.length - 1];
      return !!first && !!last && first[0] === last[0] && first[1] === last[1];
    },
    { message: "Le tracé doit être refermé sur son point de départ" },
  );

export const polygonSchema = z.object({
  type: z.literal("Polygon"),
  coordinates: z.array(linearRing).min(1),
});

export const zoneCreateSchema = z.object({
  name: z.string().trim().min(2).max(60),
  description: z.string().trim().max(500).optional(),
  boundary: polygonSchema,
  technicianId: z.number().int().positive().nullable(),
  active: z.boolean().default(true),
});

export const zoneUpdateSchema = zoneCreateSchema.partial();

export type ZoneCreateInput = z.infer<typeof zoneCreateSchema>;
