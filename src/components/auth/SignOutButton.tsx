"use client";

import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";

export default function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <button type="button" onClick={handleSignOut} className="t-label text-fg-accent">
      Se déconnecter
    </button>
  );
}
