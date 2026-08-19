import { NextResponse } from "next/server";
import { getSession, type UserRole } from "./session";

// Renvoie une reponse d'erreur si l'acces est refuse, ou null si tout va bien.
export async function requireApiRole(allowedRoles: UserRole[]) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ message: "Connexion requise" }, { status: 401 });
  }

  if (session.user.status !== "ACTIVE") {
    return NextResponse.json({ message: "Compte désactivé" }, { status: 403 });
  }

  if (!allowedRoles.includes(session.user.role as UserRole)) {
    return NextResponse.json({ message: "Accès refusé" }, { status: 403 });
  }

  return null;
}
