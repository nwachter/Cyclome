import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { prisma } from "./prisma";

//Auth par e-mail et mot de passe. Les mots de passe  hachés par BetterAuth,
//  session dans cookie HttpOnly + SameSite=Lax. rôle est stocké sur User et sert au contrôle d'accès dans le middleware et les routes API.

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 12,
    requireEmailVerification: false,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 jours
    updateAge: 60 * 60 * 24, // prolongée une fois par jour
  },
  advanced: {
    cookiePrefix: "cyclome",
    useSecureCookies: process.env.NODE_ENV === "production",
  },
  user: {
    additionalFields: {
      role: { type: "string", defaultValue: "CLIENT", input: false },
      status: { type: "string", defaultValue: "ACTIVE", input: false },
    },
  },
  plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
