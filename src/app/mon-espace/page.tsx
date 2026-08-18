import { requireUser } from "@/lib/session";
import SignOutButton from "@/components/auth/SignOutButton";

export default async function MySpacePage() {
  const user = await requireUser();

  return (
    <main className="mx-auto max-w-[1360px] px-xl py-3xl">
      <p className="t-label-sm text-fg-accent">Mon espace</p>
      <h1 className="t-display-2 mt-sm">Bonjour {user.name}</h1>
      <p className="mt-md text-fg-muted">
        Connecté avec {user.email}, rôle {user.role}.
      </p>
      <div className="mt-lg">
        <SignOutButton />
      </div>
    </main>
  );
}
