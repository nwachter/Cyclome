import { Suspense } from "react";
import type { Metadata } from "next";
import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = { title: "Connexion — Cyclôme" };

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-[480px] flex-col justify-center px-lg py-3xl">
      <p className="t-label-sm mb-sm text-fg-accent">Cyclôme</p>
      <h1 className="t-display-2 mb-lg">Se connecter</h1>
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
      <a href="/mot-de-passe-oublie" className="t-label mt-lg text-fg-accent">
        Mot de passe oublié ?
      </a>
    </main>
  );
}
