"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode, type RefObject } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ChevronDown,
  Clock,
  ExternalLink,
  Headset,
  MapPin,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { ShaderBackground } from "@/components/ui/shader-background";
import {
  contactInfo as fallbackContact,
  getMapDirectionsUrl,
  getMapEmbedUrl,
  openingHours as fallbackHours,
} from "@/lib/data";
import type { PublicSettings } from "@/lib/api/types";
import { submitContact } from "@/lib/api/forms";

const OTHER_CONTACT_CARDS = (
  contact: { email: string; phone: string },
  hours: { days: string; time: string }[]
) => [
  {
    icon: Clock,
    title: "ساعات کاری",
    body: `${hours[0]?.days ?? ""} · ${hours[0]?.time ?? ""}`,
    linkLabel: "بیشتر بدانید",
    href: "/about",
  },
  {
    icon: Headset,
    title: "ارتباط مستقیم",
    body: `${contact.email}\n${contact.phone}`,
    linkLabel: "پشتیبانی",
    href: `mailto:${contact.email}`,
  },
] as const;

function ContactCard({
  icon: Icon,
  title,
  body,
  linkLabel,
  href,
}: {
  icon: typeof Clock;
  title: string;
  body: string;
  linkLabel: string;
  href: string;
}) {
  const isExternal = href.startsWith("http");

  return (
    <article className="rounded-xl border border-gray-800 bg-[#111111] p-8 transition-colors hover:border-[#F97316]/30">
      <Icon className="h-7 w-7 text-[#F97316]" strokeWidth={1.75} />
      <h3 className="mt-5 font-serif text-lg font-bold text-white">{title}</h3>
      <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-gray-400">
        {body}
      </p>
      <Link
        href={href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[#F97316] transition hover:gap-2.5"
      >
        {linkLabel}
        <ArrowLeft className="h-4 w-4" strokeWidth={2} />
      </Link>
    </article>
  );
}

function LocationCard({
  mapOpen,
  onToggleMap,
  contact,
}: {
  mapOpen: boolean;
  onToggleMap: () => void;
  contact: { address: string; coordinates: { lat: number; lng: number } };
}) {
  const { lat, lng } = contact.coordinates;

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={onToggleMap}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onToggleMap();
        }
      }}
      aria-expanded={mapOpen}
      aria-controls="contact-map-panel"
      className={`cursor-pointer rounded-xl border bg-[#111111] p-8 transition-colors ${
        mapOpen
          ? "border-[#F97316] ring-1 ring-[#F97316]/40"
          : "border-gray-800 hover:border-[#F97316]/30"
      }`}
    >
      <MapPin className="h-7 w-7 text-[#F97316]" strokeWidth={1.75} />
      <h3 className="mt-5 font-serif text-lg font-bold text-white">
        آدرس رستوران
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-gray-400">
        {contact.address}
      </p>
      <div className="mt-5 flex flex-wrap items-center gap-4">
        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#F97316]">
          {mapOpen ? "بستن نقشه" : "نمایش روی نقشه"}
          <ChevronDown
            className={`h-4 w-4 transition-transform duration-300 ${mapOpen ? "rotate-180" : ""}`}
            strokeWidth={2}
          />
        </span>
        <a
          href={getMapDirectionsUrl(lat, lng)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 transition hover:text-[#F97316]"
        >
          مسیریابی
          <ExternalLink className="h-3.5 w-3.5" strokeWidth={2} />
        </a>
      </div>
    </article>
  );
}

function LocationMapPanel({
  open,
  panelRef,
  contact,
}: {
  open: boolean;
  panelRef: RefObject<HTMLDivElement | null>;
  contact: { address: string; coordinates: { lat: number; lng: number } };
}) {
  const { lat, lng } = contact.coordinates;
  const embedUrl = getMapEmbedUrl(lat, lng);

  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          ref={panelRef}
          id="contact-map-panel"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden"
        >
          <div className="mt-6 overflow-hidden rounded-2xl border border-gray-800 bg-[#111111]">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-800 px-5 py-4 sm:px-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#F97316]">
                  موقعیت ما
                </p>
                <p className="mt-1 text-sm text-gray-400">{contact.address}</p>
              </div>
              <a
                href={getMapDirectionsUrl(lat, lng)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-[#F97316]/40 px-4 py-2 text-sm font-medium text-[#F97316] transition hover:bg-[#F97316]/10"
              >
                باز کردن در گوگل مپ
                <ExternalLink className="h-4 w-4" strokeWidth={2} />
              </a>
            </div>
            <div className="relative aspect-[16/10] w-full min-h-[280px] sm:aspect-[21/9]">
              <iframe
                title="نقشه موقعیت رستوران Humazd"
                src={embedUrl}
                className="absolute inset-0 h-full w-full border-0 grayscale-[20%] contrast-[1.05]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function SocialButton({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <a
      href="#"
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-700 text-gray-400 transition-colors hover:border-[#F97316] hover:text-[#F97316]"
    >
      {children}
    </a>
  );
}

export function ContactPage({ settings }: { settings?: PublicSettings | null }) {
  const contact = settings?.contact_info ?? fallbackContact;
  const openingHours = settings?.opening_hours?.length
    ? settings.opening_hours
    : fallbackHours;
  const contactCards = OTHER_CONTACT_CARDS(contact, openingHours);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mapOpen, setMapOpen] = useState(false);
  const mapPanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mapOpen && mapPanelRef.current) {
      mapPanelRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [mapOpen]);

  function handleToggleMap() {
    setMapOpen((prev) => !prev);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      await submitContact({
        name: String(formData.get("name") ?? ""),
        email: String(formData.get("email") ?? ""),
        message: String(formData.get("message") ?? ""),
      });
      setSubmitted(true);
      form.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "ارسال پیام انجام نشد.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#0a0a0a] pt-28 sm:pt-32">
        {/* ── 1. Hero ───────────────────────────────────────────────── */}
        <section className="relative w-full overflow-hidden bg-transparent px-4 pb-4 sm:px-6 lg:px-10">
          <ShaderBackground />
          <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center py-12 text-center pointer-events-none sm:py-16">
            <h1 className="font-serif text-4xl font-bold text-white drop-shadow-[0_0_28px_rgba(249,115,22,0.45)] sm:text-5xl lg:text-6xl">
              تماس با ما
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-gray-300 sm:text-base">
              سوالی درباره منو، رزرو یا رویداد خصوصی دارید؟ تیم Humazd آماده
              پاسخگویی است — پیام بفرستید یا مستقیم با ما تماس بگیرید.
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          {/* ── 2. Info grid ──────────────────────────────────────────── */}
          <section className="mt-12 grid grid-cols-1 items-center gap-12 lg:mt-20 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#F97316]">
                تماس با ما
              </p>
              <h1 className="font-serif mt-4 text-4xl font-bold uppercase leading-[0.95] text-[#F97316] sm:text-5xl lg:text-[3.25rem]">
                در
                <br />
                ارتباط
                <br />
                باشید
              </h1>
            </div>

            <div className="lg:col-span-8">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <LocationCard mapOpen={mapOpen} onToggleMap={handleToggleMap} contact={contact} />
                {contactCards.map((card) => (
                  <ContactCard key={card.title} {...card} />
                ))}
              </div>
              <LocationMapPanel open={mapOpen} panelRef={mapPanelRef} contact={contact} />
            </div>
          </section>

          {/* ── 3. Form block ─────────────────────────────────────────── */}
          <section className="mt-16 rounded-2xl border border-gray-800 bg-[#111111] p-10 lg:p-16">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
              <div className="max-w-md">
                <p className="font-medium text-white">سوالی دارید؟</p>
                <h2 className="font-serif mt-2 text-4xl font-bold uppercase leading-tight text-[#F97316] sm:text-5xl">
                  تماس با ما
                </h2>
                <p className="mt-4 leading-relaxed text-gray-400">
                  فرم را پر کنید تا در اسرع وقت با شما تماس بگیریم. برای رزرو
                  فوری میز، می‌توانید مستقیم با شماره رستوران تماس بگیرید.
                </p>
              </div>

              <div>
                {submitted ? (
                  <div className="rounded-xl border border-[#F97316]/30 bg-[#0a0a0a] p-8 text-center">
                    <p className="font-serif text-2xl font-bold text-[#F97316]">
                      پیام شما ارسال شد!
                    </p>
                    <p className="mt-3 text-sm text-gray-400">
                      به زودی با شما تماس خواهیم گرفت.
                    </p>
                    <button
                      type="button"
                      onClick={() => setSubmitted(false)}
                      className="mt-6 text-sm font-medium text-[#F97316] transition hover:text-orange-400"
                    >
                      ارسال پیام جدید
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <label className="sr-only" htmlFor="contact-name">
                      نام
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      name="name"
                      required
                      placeholder="نام و نام خانوادگی"
                      className="mb-4 w-full rounded-lg border border-gray-700 bg-[#0a0a0a] p-4 text-white outline-none transition-colors placeholder:text-gray-500 focus:border-[#F97316]"
                    />

                    <label className="sr-only" htmlFor="contact-email">
                      ایمیل
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      name="email"
                      required
                      placeholder="ایمیل"
                      className="mb-4 w-full rounded-lg border border-gray-700 bg-[#0a0a0a] p-4 text-white outline-none transition-colors placeholder:text-gray-500 focus:border-[#F97316]"
                    />

                    <label className="sr-only" htmlFor="contact-message">
                      پیام
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      required
                      rows={5}
                      placeholder="پیام شما..."
                      className="mb-4 w-full resize-none rounded-lg border border-gray-700 bg-[#0a0a0a] p-4 text-white outline-none transition-colors placeholder:text-gray-500 focus:border-[#F97316]"
                    />

                    {error && (
                      <p className="mb-4 text-sm text-red-400" role="alert">
                        {error}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="rounded-md bg-[#F97316] px-8 py-3 font-medium text-white transition hover:bg-orange-600 disabled:opacity-60"
                    >
                      {loading ? "در حال ارسال..." : "ارسال پیام"}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </section>

          {/* ── 4. Let's talk footer area ─────────────────────────────── */}
          <section className="mt-32 border-t border-gray-800 pt-16 pb-8">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
              <div>
                <h2 className="font-serif text-4xl font-bold text-[#F97316] sm:text-5xl lg:text-6xl">
                  بیایید گفتگو کنیم
                </h2>
                <div className="mt-6 flex flex-wrap gap-3">
                  <SocialButton label="فیسبوک">
                    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </SocialButton>
                  <SocialButton label="اینستاگرام">
                    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                    </svg>
                  </SocialButton>
                  <SocialButton label="توییتر">
                    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </SocialButton>
                  <SocialButton label="لینکدین">
                    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 114.126 0 2.063 2.063 0 01-2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </SocialButton>
                </div>
              </div>

              <div className="space-y-6 text-sm text-gray-400 lg:text-end">
                <div>
                  <p className="mb-1 font-medium text-white">آدرس</p>
                  <p>{contact.address}</p>
                </div>
                <div>
                  <p className="mb-1 font-medium text-white">تماس</p>
                  <p>
                    <a
                      href={`mailto:${contact.email}`}
                      className="transition hover:text-[#F97316]"
                    >
                      {contact.email}
                    </a>
                  </p>
                  <p>
                    <a
                      href={`tel:${contact.phone.replace(/\s/g, "")}`}
                      className="transition hover:text-[#F97316]"
                    >
                      {contact.phone}
                    </a>
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-16 flex flex-col gap-4 border-t border-gray-800 pt-8 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between">
              <p>© {new Date().getFullYear()} رستوران Humazd. تمامی حقوق محفوظ است.</p>
              <div className="flex gap-6">
                <Link href="/privacy" className="transition hover:text-[#F97316]">
                  حریم خصوصی
                </Link>
                <Link href="/terms" className="transition hover:text-[#F97316]">
                  قوانین و مقررات
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
