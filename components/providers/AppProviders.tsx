"use client";

import type { ReactNode } from "react";
import { BookingProvider } from "@/components/booking/BookingProvider";
import { CartProvider } from "@/components/cart/CartProvider";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <BookingProvider>
      <CartProvider>{children}</CartProvider>
    </BookingProvider>
  );
}
