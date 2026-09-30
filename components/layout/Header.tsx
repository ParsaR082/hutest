"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, ShoppingBag, User, UtensilsCrossed } from "lucide-react";
import { BookTableButton } from "@/components/booking/BookTableButton";
import { useBookingOptional } from "@/components/booking/BookingProvider";
import { useCartOptional } from "@/components/cart/CartProvider";
import { getStoredUser } from "@/lib/auth/storage";
import { navLinks } from "@/lib/data";
import { fetchPublicSettings } from "@/lib/api/settings";

function NavLink({
  link,
  active,
  className,
  onClick,
}: {
  link: (typeof navLinks)[number];
  active: boolean;
  className: string;
  onClick?: () => void;
}) {
  const booking = useBookingOptional();

  if (link.action === "openBooking") {
    return (
      <button
        type="button"
        onClick={() => {
          booking?.openBooking();
          onClick?.();
        }}
        className={className}
      >
        {link.label}
      </button>
    );
  }

  return (
    <Link href={link.href} className={className} onClick={onClick}>
      {link.label}
    </Link>
  );
}

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  if (href.startsWith("/#")) return false;
  return pathname === href;
}

export function Header() {
  const [open, setOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const pathname = usePathname();
  const cart = useCartOptional();

  useEffect(() => {
    setLoggedIn(Boolean(getStoredUser()));
  }, [pathname]);

  useEffect(() => {
    fetchPublicSettings()
      .then((s) => setLogoUrl(s.logo_url || null))
      .catch(() => null);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="absolute inset-x-0 top-0 z-50 px-4 pt-5 sm:px-6 lg:px-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <Link href="/" className="flex shrink-0 items-center gap-2.5">
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoUrl} alt="Humazd" className="h-10 w-auto max-w-[9rem] object-contain" />
            ) : (
              <>
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-brand text-white">
                  <UtensilsCrossed className="h-5 w-5" strokeWidth={2.2} />
                </span>
                <span className="leading-tight">
                  <span lang="en" className="font-script block text-2xl text-white sm:text-[1.65rem]">
                    Humazd
                  </span>
                  <span className="block text-[0.6rem] font-semibold tracking-[0.28em] text-white/70">
                    رستوران
                  </span>
                </span>
              </>
            )}
          </Link>

          <nav className="hidden flex-1 justify-center lg:flex">
            <ul className="flex items-center gap-6 xl:gap-8">
              {navLinks.map((link) => {
                const active = isActive(pathname, link.href);
                return (
                  <li key={link.href}>
                    <NavLink
                      link={link}
                      active={active}
                      className={`text-sm font-medium transition-colors ${
                        active
                          ? "text-orange-brand"
                          : "text-white/85 hover:text-white"
                      }`}
                    />
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            {loggedIn && cart && (
              <button
                type="button"
                aria-label="سبد سفارش"
                onClick={() => cart.openCart()}
                className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/25 text-white/90 transition hover:border-orange-brand hover:text-orange-brand sm:h-11 sm:w-11"
              >
                <ShoppingBag className="h-5 w-5" strokeWidth={1.75} />
                {cart.itemCount > 0 && (
                  <span className="absolute -top-1 -start-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-brand px-1 text-[0.65rem] font-bold text-white">
                    {cart.itemCount}
                  </span>
                )}
              </button>
            )}
            <Link
              href={loggedIn ? "/dashboard" : "/auth"}
              aria-label={loggedIn ? "داشبورد کاربری" : "ورود به حساب کاربری"}
              title={loggedIn ? "داشبورد" : "ورود / پروفایل"}
              className={`flex h-10 w-10 items-center justify-center rounded-full border transition sm:h-11 sm:w-11 ${
                pathname === "/auth" || pathname.startsWith("/dashboard")
                  ? "border-orange-brand bg-orange-brand/15 text-orange-brand"
                  : "border-white/25 text-white/90 hover:border-orange-brand hover:text-orange-brand"
              }`}
            >
              <User className="h-5 w-5" strokeWidth={1.75} />
            </Link>
            <BookTableButton className="hidden items-center gap-2 rounded-full bg-orange-brand px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-brand/30 transition hover:bg-orange-600 sm:inline-flex">
              <Calendar className="h-4 w-4" />
              رزرو میز
            </BookTableButton>
            <button
              type="button"
              aria-label="باز و بسته کردن منو"
              className="flex flex-col gap-1.5 p-2 lg:hidden"
              onClick={() => setOpen(!open)}
            >
              <span className="block h-0.5 w-6 bg-white" />
              <span className="block h-0.5 w-6 bg-white" />
              <span className="block h-0.5 w-6 bg-white" />
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-40 bg-charcoal/95 px-6 pt-24 lg:hidden">
          <nav className="flex flex-col gap-5">
            {navLinks.map((link) => {
              const active = isActive(pathname, link.href);
              return (
                <NavLink
                  key={link.href}
                  link={link}
                  active={active}
                  className={`font-serif text-2xl text-start ${
                    active ? "text-orange-brand" : "text-white"
                  }`}
                  onClick={() => setOpen(false)}
                />
              );
            })}
            <BookTableButton
              className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-orange-brand px-6 py-3 font-semibold text-white"
              onClick={() => setOpen(false)}
            >
              <Calendar className="h-4 w-4" />
              رزرو میز
            </BookTableButton>
            <Link
              href={loggedIn ? "/dashboard" : "/auth"}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-6 py-3 font-semibold text-white transition hover:border-orange-brand hover:text-orange-brand"
              onClick={() => setOpen(false)}
            >
              <User className="h-4 w-4" />
              {loggedIn ? "داشبورد" : "ورود"}
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}
