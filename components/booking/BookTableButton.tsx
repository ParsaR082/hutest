"use client";

import type { ReactNode } from "react";
import { useBookingOptional } from "@/components/booking/BookingProvider";

interface BookTableButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function BookTableButton({
  children,
  className,
  onClick,
}: BookTableButtonProps) {
  const booking = useBookingOptional();

  return (
    <button
      type="button"
      onClick={() => {
        booking?.openBooking();
        onClick?.();
      }}
      className={className}
    >
      {children}
    </button>
  );
}
