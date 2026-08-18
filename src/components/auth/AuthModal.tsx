"use client";

import { useState } from "react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

type Tab = "signup" | "login";

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  defaultTab?: Tab;
  title?: string;
  subtitle?: string;
};

export default function AuthModal({
  open,
  onClose,
  onSuccess,
  defaultTab = "login",
  title = "Bienvenue",
  subtitle,
}: Props) {
  const [tab, setTab] = useState<Tab>(defaultTab);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <button
        type="button"
        aria-label="Fermer"
        onClick={onClose}
        className="fixed inset-0 bg-contrast/60"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        className="relative mx-auto my-2xl w-[540px] max-w-[calc(100%-32px)] border border-line-strong bg-surface"
      >
        <div className="flex items-start justify-between gap-md bg-inverse p-lg text-fg-on-inverse">
          <div>
            <h2 id="auth-modal-title" className="t-display-3">
              {title}
            </h2>
            {subtitle && <p className="mt-3xs text-sm opacity-75">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="size-9 border border-line-inverse"
          >
            ×
          </button>
        </div>

        <div className="grid grid-cols-2 border-b border-line">
          <button
            type="button"
            onClick={() => setTab("signup")}
            className={`t-label border-b-[3px] p-md ${
              tab === "signup" ? "border-b-accent text-fg" : "border-b-transparent text-fg-subtle"
            }`}
          >
            Créer un compte
          </button>
          <button
            type="button"
            onClick={() => setTab("login")}
            className={`t-label border-b-[3px] p-md ${
              tab === "login" ? "border-b-accent text-fg" : "border-b-transparent text-fg-subtle"
            }`}
          >
            J&apos;ai déjà un compte
          </button>
        </div>

        <div className="p-lg">
          {tab === "signup" ? (
            <SignupForm onSwitchToLogin={() => setTab("login")} onSuccess={onSuccess} />
          ) : (
            <LoginForm onSwitchToSignup={() => setTab("signup")} onSuccess={onSuccess} />
          )}
        </div>
      </div>
    </div>
  );
}
