import { PrismaClient } from "@prisma/client";

// En dev, Next recharge les modules à chaque modification. Sans ce cache, chaque refresh = nouveau pool de connexions.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
