"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "@/lib/auth-client";
import { loginSchema, type LoginInput } from "@/lib/validation/auth";

type Props = {
  onSwitchToSignup?: () => void;
  onSuccess?: () => void;
};

export default function LoginForm({ onSwitchToSignup, onSuccess }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { rememberMe: true },
  });

  async function onSubmit(values: LoginInput) {
    setServerError("");
    setIsLoading(true);

    const result = await signIn.email({
      email: values.email,
      password: values.password,
      rememberMe: values.rememberMe,
    });

    setIsLoading(false);

    if (result.error) {
      // Evite de dire si c'est email ou mdp qui est faux, sinon on donne un moyen de savoir quelles adresses existent.
      setServerError("Adresse ou mot de passe invalide.");
      return;
    }

    if (onSuccess) {
      onSuccess();
      return;
    }

    const redirectTo = searchParams.get("redirect") ?? "/mon-espace";
    router.push(redirectTo);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-md">
      {serverError && (
        <p role="alert" className="border-l-4 border-l-danger-500 bg-danger-50 p-md text-sm">
          {serverError}
        </p>
      )}

      <div>
        <label htmlFor="login-email" className="t-label mb-2xs block text-fg-muted">
          Adresse e-mail
        </label>
        <input
          id="login-email"
          type="email"
          autoComplete="email"
          {...register("email")}
          className="min-h-[44px] w-full border border-line-strong bg-surface px-sm py-xs"
        />
        {errors.email && <p className="mt-2xs text-xs text-danger-500">{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="login-password" className="t-label mb-2xs block text-fg-muted">
          Mot de passe
        </label>
        <input
          id="login-password"
          type="password"
          autoComplete="current-password"
          {...register("password")}
          className="min-h-[44px] w-full border border-line-strong bg-surface px-sm py-xs"
        />
        {errors.password && (
          <p className="mt-2xs text-xs text-danger-500">{errors.password.message}</p>
        )}
      </div>

      <label className="flex items-center gap-sm text-sm">
        <input type="checkbox" {...register("rememberMe")} className="size-[18px] accent-accent" />
        Rester connecté 30 jours
      </label>

      <button
        type="submit"
        disabled={isLoading}
        className="t-label min-h-[44px] bg-accent px-lg text-fg-on-accent transition-colors hover:bg-accent-hover disabled:bg-sunken disabled:text-fg-disabled"
      >
        {isLoading ? "Connexion..." : "Se connecter"}
      </button>

      {onSwitchToSignup && (
        <button type="button" onClick={onSwitchToSignup} className="t-label text-fg-accent">
          Pas encore de compte ? En créer un
        </button>
      )}
    </form>
  );
}
