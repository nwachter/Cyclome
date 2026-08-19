import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./auth";

export type UserRole = "CLIENT" | "TECHNICIAN" | "ADMIN";

export async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

export async function getCurrentUser() {
  const session = await getSession();
  return session?.user ?? null;
}

// Pour pages protégées. Renvoie vers /connexion si non connecté, vers l'accueil si le compte a ete desactive.
export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/connexion");
  if (user.status !== "ACTIVE") redirect("/compte-desactive");
  return user;
}

export async function requireRole(allowedRoles: UserRole[]) {
  const user = await requireUser();
  if (!allowedRoles.includes(user.role as UserRole)) redirect("/");
  return user;
}

export function homePathForRole(role: string) {
  if (role === "ADMIN") return "/admin";
  if (role === "TECHNICIAN") return "/technicien";
  return "/mon-espace";
}
