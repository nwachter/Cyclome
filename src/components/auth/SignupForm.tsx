"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUp } from "@/lib/auth-client";
import { signupSchema, getPasswordScore, type SignupInput } from "@/lib/validation/auth";

type Props = {
  onSwitchToLogin?: () => void;
  onSuccess?: () => void;
};

export default function SignupForm({ onSwitchToLogin, onSuccess }: Props) {
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupInput>({ resolver: zodResolver(signupSchema) });

  const password = watch("password") ?? "";
  const score = getPasswordScore(password);

  async function onSubmit(values: SignupInput) {
    setServerError("");
    setIsLoading(true);

    const result = await signUp.email({
      email: values.email,
      password: values.password,
      name: `${values.firstname} ${values.lastname}`,
    });

    setIsLoading(false);

    if (result.error) {
      if (result.error.status === 422) {
        setServerError("Un compte existe déjà avec cette adresse.");
      } else {
        setServerError("La création du compte a échoué. Réessayez dans un instant.");
      }
      return;
    }

    if (onSuccess) {
      onSuccess();
      return;
    }

    router.push("/mon-espace");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-md">
      {serverError && (
        <p role="alert" className="border-l-4 border-l-danger-500 bg-danger-50 p-md text-sm">
          {serverError}
        </p>
      )}

      <div className="grid grid-cols-2 gap-md">
        <div>
          <label htmlFor="signup-firstname" className="t-label mb-2xs block text-fg-muted">
            Prénom
          </label>
          <input
            id="signup-firstname"
            type="text"
            autoComplete="given-name"
            {...register("firstname")}
            className="min-h-[44px] w-full border border-line-strong bg-surface px-sm py-xs"
          />
          {errors.firstname && (
            <p className="mt-2xs text-xs text-danger-500">{errors.firstname.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="signup-lastname" className="t-label mb-2xs block text-fg-muted">
            Nom
          </label>
          <input
            id="signup-lastname"
            type="text"
            autoComplete="family-name"
            {...register("lastname")}
            className="min-h-[44px] w-full border border-line-strong bg-surface px-sm py-xs"
          />
          {errors.lastname && (
            <p className="mt-2xs text-xs text-danger-500">{errors.lastname.message}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="signup-email" className="t-label mb-2xs block text-fg-muted">
          Adresse e-mail
        </label>
        <input
          id="signup-email"
          type="email"
          autoComplete="email"
          {...register("email")}
          className="min-h-[44px] w-full border border-line-strong bg-surface px-sm py-xs"
        />
        {errors.email && <p className="mt-2xs text-xs text-danger-500">{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="signup-phone" className="t-label mb-2xs block text-fg-muted">
          Téléphone
        </label>
        <input
          id="signup-phone"
          type="tel"
          autoComplete="tel"
          {...register("phone")}
          className="min-h-[44px] w-full border border-line-strong bg-surface px-sm py-xs"
        />
        {errors.phone && <p className="mt-2xs text-xs text-danger-500">{errors.phone.message}</p>}
      </div>

      <div>
        <label htmlFor="signup-password" className="t-label mb-2xs block text-fg-muted">
          Mot de passe
        </label>
        <input
          id="signup-password"
          type="password"
          autoComplete="new-password"
          {...register("password")}
          className="min-h-[44px] w-full border border-line-strong bg-surface px-sm py-xs"
        />
        <div className="mt-2xs flex gap-3xs" aria-hidden="true">
          {[1, 2, 3, 4].map((level) => (
            <span
              key={level}
              className={`h-[4px] flex-1 ${score >= level ? "bg-success-500" : "bg-sunken"}`}
            />
          ))}
        </div>
        <p className="mt-2xs text-xs text-fg-subtle">
          12 caractères, une majuscule, un chiffre.
        </p>
        {errors.password && (
          <p className="mt-2xs text-xs text-danger-500">{errors.password.message}</p>
        )}
      </div>

      <label className="flex items-start gap-sm text-sm">
        <input
          type="checkbox"
          {...register("acceptTerms")}
          className="mt-1 size-[18px] accent-accent"
        />
        <span>
          J&apos;accepte les conditions générales et la politique de confidentialité.
          {errors.acceptTerms && (
            <span className="mt-2xs block text-xs text-danger-500">
              {errors.acceptTerms.message}
            </span>
          )}
        </span>
      </label>

      <button
        type="submit"
        disabled={isLoading}
        className="t-label min-h-[44px] bg-accent px-lg text-fg-on-accent transition-colors hover:bg-accent-hover disabled:bg-sunken disabled:text-fg-disabled"
      >
        {isLoading ? "Création..." : "Créer mon compte"}
      </button>

      {onSwitchToLogin && (
        <button type="button" onClick={onSwitchToLogin} className="t-label text-fg-accent">
          Déjà client ? Se connecter
        </button>
      )}
    </form>
  );
}
