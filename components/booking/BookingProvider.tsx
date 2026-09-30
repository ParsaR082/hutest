"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { BookingModal } from "@/components/booking/BookingModal";

interface BookingContextValue {
  openBooking: () => void;
  closeBooking: () => void;
  isOpen: boolean;
}

const BookingContext = createContext<BookingContextValue | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openBooking = useCallback(() => setIsOpen(true), []);
  const closeBooking = useCallback(() => setIsOpen(false), []);

  return (
    <BookingContext.Provider value={{ openBooking, closeBooking, isOpen }}>
      {children}
      <BookingModal isOpen={isOpen} onClose={closeBooking} />
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) {
    throw new Error("useBooking must be used within BookingProvider");
  }
  return ctx;
}

/** Safe hook for optional provider (e.g. pages without modal) */
export function useBookingOptional() {
  return useContext(BookingContext);
}
