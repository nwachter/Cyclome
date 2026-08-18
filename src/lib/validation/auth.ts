import { z } from "zod";

export const passwordSchema = z
  .string()
  .min(12, "12 caractères minimum")
  .regex(/[A-Z]/, "Il faut au moins une majuscule")
  .regex(/[0-9]/, "Il faut au moins un chiffre");

export const loginSchema = z.object({
  email: z.string().email("Adresse e-mail invalide"),
  password: z.string().min(1, "Mot de passe requis"),
  rememberMe: z.boolean().default(true),
});

export const signupSchema = z.object({
  firstname: z.string().trim().min(2, "Prénom trop court").max(30),
  lastname: z.string().trim().min(2, "Nom trop court").max(30),
  email: z.string().email("Adresse e-mail invalide"),
  phone: z.string().trim().min(10, "Numéro invalide").max(20),
  password: passwordSchema,
  acceptTerms: z.literal(true, {
    errorMap: () => ({ message: "Vous devez accepter les conditions" }),
  }),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Adresse e-mail invalide"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;

export function getPasswordScore(password: string) {
  let score = 0;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
}
