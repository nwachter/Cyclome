"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { AddressInput, CycleInput } from "@/lib/validation/booking";

export type SelectedZone = {
  id: number;
  name: string;
  color: string;
  technicianName: string | null;
};
export type SelectedPackage = { id: number; name: string; duration: number; price: number };
export type SelectedSlot = { id: number; startDate: string; endDate: string };
export type CartLine = { productId: number; name: string; unitPrice: number; quantity: number };

export type BookingState = {
  address: AddressInput | null;
  zone: SelectedZone | null;
  cycle: CycleInput | null;
  description: string;
  selectedPackage: SelectedPackage | null;
  cart: CartLine[];
  slot: SelectedSlot | null;
};

const emptyBooking: BookingState = {
  address: null,
  zone: null,
  cycle: null,
  description: "",
  selectedPackage: null,
  cart: [],
  slot: null,
};

type ContextValue = {
  booking: BookingState;
  update: (partial: Partial<BookingState>) => void;
  addProduct: (line: CartLine) => void;
  removeProduct: (productId: number) => void;
  reset: () => void;
  cartTotal: number;
  grandTotal: number;
};

const BookingContext = createContext<ContextValue | null>(null);
const STORAGE_KEY = "cyclome-booking";

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [booking, setBooking] = useState<BookingState>(emptyBooking);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setBooking(JSON.parse(saved));
      } catch {
        sessionStorage.removeItem(STORAGE_KEY);
      }
    }
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (isReady) sessionStorage.setItem(STORAGE_KEY, JSON.stringify(booking));
  }, [booking, isReady]);

  function update(partial: Partial<BookingState>) {
    setBooking((current) => ({ ...current, ...partial }));
  }

  function addProduct(line: CartLine) {
    setBooking((current) => {
      const existing = current.cart.find((item) => item.productId === line.productId);
      if (!existing) return { ...current, cart: [...current.cart, line] };

      return {
        ...current,
        cart: current.cart.map((item) =>
          item.productId === line.productId
            ? { ...item, quantity: item.quantity + line.quantity }
            : item,
        ),
      };
    });
  }

  function removeProduct(productId: number) {
    setBooking((current) => {
      const existing = current.cart.find((item) => item.productId === productId);
      if (!existing) return current;

      if (existing.quantity <= 1) {
        return { ...current, cart: current.cart.filter((item) => item.productId !== productId) };
      }

      return {
        ...current,
        cart: current.cart.map((item) =>
          item.productId === productId ? { ...item, quantity: item.quantity - 1 } : item,
        ),
      };
    });
  }

  function reset() {
    setBooking(emptyBooking);
    sessionStorage.removeItem(STORAGE_KEY);
  }

  const cartTotal = booking.cart.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0);
  const grandTotal = cartTotal + (booking.selectedPackage?.price ?? 0);

  return (
    <BookingContext.Provider
      value={{ booking, update, addProduct, removeProduct, reset, cartTotal, grandTotal }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) throw new Error("useBooking doit être utilisé dans un BookingProvider");
  return context;
}
