import { z } from "zod";

/*
 * Validation des variables d'environnement au démarrage. 1 variable manquante=  lancement échoue avec un message clair, plutôt qu'une erreur non attrapée au 1e appel db.
 */
const schema = z.object({
  DATABASE_URL: z.string().url(),
  BETTER_AUTH_SECRET: z.string().min(32, "Générez une clé d'au moins 32 caractères"),
  BETTER_AUTH_URL: z.string().url(),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  ADDRESS_API_URL: z.string().url().default("https://api-adresse.data.gouv.fr"),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  console.error("Variables d'environnement invalides :", parsed.error.flatten().fieldErrors);
  throw new Error("Configuration incomplète : voir .env.example");
}

export const env = parsed.data;
