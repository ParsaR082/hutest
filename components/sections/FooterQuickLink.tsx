"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useBookingOptional } from "@/components/booking/BookingProvider";
import type { footerQuickLinks } from "@/lib/data";

export function FooterQuickLink({ link }: { link: (typeof footerQuickLinks)[number] }) {
  const booking = useBookingOptional();
  const className = "flex items-center gap-1.5 text-sm transition hover:text-orange-brand";
  const icon = <ChevronRight className="h-3.5 w-3.5 rotate-180 text-orange-brand" />;

  if (link.action === "openBooking") {
    return (
      <button type="button" onClick={() => booking?.openBooking()} className={className}>
        {icon}
        {link.label}
      </button>
    );
  }

  return (
    <Link href={link.href} className={className}>
      {icon}
      {link.label}
    </Link>
  );
}
