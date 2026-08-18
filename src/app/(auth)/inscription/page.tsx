import type { Metadata } from "next";
import SignupForm from "@/components/auth/SignupForm";

export const metadata: Metadata = { title: "Créer un compte — Cyclôme" };

export default function SignupPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-[560px] flex-col justify-center px-lg py-3xl">
      <p className="t-label-sm mb-sm text-fg-accent">Cyclôme</p>
      <h1 className="t-display-2 mb-lg">Créer un compte</h1>
      <SignupForm />
    </main>
  );
}
