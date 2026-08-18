import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { prisma } from "./prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 12,
    requireEmailVerification: false,
  },

  session: {
    expiresIn: 60 * 60 * 24 * 30,
    updateAge: 60 * 60 * 24,
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

  databaseHooks: {
    user: {
      create: {
        // Chaque nouveau compte User = créer client, on lui cree sa fiche tout de suite pour  la reservation
        after: async (user) => {
          const parts = user.name.trim().split(" ");
          const firstname = parts[0] ?? user.name;
          const lastname = parts.slice(1).join(" ") || parts[0] || "";

          await prisma.client.create({
            data: {
              userId: user.id,
              firstname,
              lastname,
              address: "",
              postalCode: "",
              city: "",
            },
          });
        },
      },
    },
  },

  plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
export type SessionUser = Session["user"];
