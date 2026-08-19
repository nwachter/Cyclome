"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { useBooking } from "@/lib/booking-context";
import type { ProductItem } from "@/server/catalog";
import StepShell from "./StepShell";
import ActionBar from "./ActionBar";

export default function ProductStep() {
  const router = useRouter();
  const { booking, addProduct, removeProduct } = useBooking();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await api.get<ProductItem[]>("/products");
      return response.data;
    },
  });

  function quantityFor(productId: number) {
    return booking.cart.find((line) => line.productId === productId)?.quantity ?? 0;
  }

  return (
    <>
      <StepShell
        eyebrow="Étape 4 sur 5 · facultative"
        title="Besoin de pièces ou d'accessoires ?"
        lead="Le technicien les apporte le jour de l'intervention, montage compris. Vous pouvez aussi passer cette étape et décider sur place."
      >
        {isLoading && <p className="text-fg-subtle">Chargement du catalogue...</p>}

        <div className="grid gap-sm md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => {
            const quantity = quantityFor(product.id);

            return (
              <article
                key={product.id}
                className={`flex flex-col border bg-surface p-md ${
                  quantity > 0 ? "border-accent shadow-[inset_0_0_0_1px_var(--color-accent)]" : "border-line"
                }`}
              >
                <span className="t-display-4 block">{product.name}</span>
                <span className="mt-3xs block text-xs text-fg-subtle">{product.reference}</span>
                <span className="mt-2xs block text-sm text-fg-muted">{product.description}</span>

                <div className="mt-auto flex items-center justify-between gap-sm pt-md">
                  <span className="font-data text-2xl italic text-fg-accent">
                    {product.price.toFixed(2)} €
                  </span>

                  {quantity > 0 ? (
                    <span className="flex items-center border border-line-strong">
                      <button
                        type="button"
                        aria-label={`Retirer un ${product.name}`}
                        onClick={() => removeProduct(product.id)}
                        className="size-9 hover:bg-sunken"
                      >
                        -
                      </button>
                      <span className="w-9 text-center font-data text-sm italic">{quantity}</span>
                      <button
                        type="button"
                        aria-label={`Ajouter un ${product.name}`}
                        onClick={() =>
                          addProduct({
                            productId: product.id,
                            name: product.name,
                            unitPrice: product.price,
                            quantity: 1,
                          })
                        }
                        className="size-9 hover:bg-sunken"
                      >
                        +
                      </button>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() =>
                        addProduct({
                          productId: product.id,
                          name: product.name,
                          unitPrice: product.price,
                          quantity: 1,
                        })
                      }
                      className="t-label min-h-[36px] border border-line-strong px-md hover:bg-sunken"
                    >
                      Ajouter
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-lg border-l-[6px] border-l-marine-500 bg-marine-50 p-md">
          <b className="t-label block">Rien n&apos;est prélevé maintenant</b>
          <p className="mt-2xs text-sm text-fg-muted">
            Les articles s&apos;ajoutent à la facture de l&apos;intervention. Si une pièce se révèle
            inutile sur place, le technicien la retire du total.
          </p>
        </div>
      </StepShell>

      <ActionBar
        backHref="/reservation/forfait"
        nextLabel="Continuer vers le créneau"
        onNext={() => router.push("/reservation/creneau")}
        secondary={{
          label: "Passer cette étape",
          onClick: () => router.push("/reservation/creneau"),
        }}
      />
    </>
  );
}
