import type { ReactNode } from "react";
import Link from "next/link";
import {
  ChevronRight,
  Leaf,
  Mail,
  MapPin,
  Phone,
  UtensilsCrossed,
} from "lucide-react";
import { fetchPublicSettings } from "@/lib/api/settings";
import { contactInfo as fallbackContact, footerQuickLinks, openingHours as fallbackHours } from "@/lib/data";
import { FooterQuickLink } from "@/components/sections/FooterQuickLink";

function SocialIcon({ children, label, href }: { children: ReactNode; label: string; href?: string }) {
  return (
    <a
      href={href || "#"}
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/70 transition hover:border-orange-brand hover:text-orange-brand"
    >
      {children}
    </a>
  );
}

const socialIcons = [
  {
    label: "فیسبوک",
    key: "social_facebook" as const,
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    label: "اینستاگرام",
    key: "social_instagram" as const,
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    label: "توییتر",
    key: "social_twitter" as const,
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "یوتیوب",
    key: "social_youtube" as const,
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
];

export async function Footer() {
  let contact = fallbackContact;
  let hours = fallbackHours;
  let socialLinks: Record<string, string> = {};

  try {
    const settings = await fetchPublicSettings();
    if (settings?.contact_info) {
      contact = settings.contact_info;
    }
    if (settings?.opening_hours?.length) {
      hours = settings.opening_hours;
    }
    socialLinks = {
      social_facebook: settings.social_facebook ?? "",
      social_instagram: settings.social_instagram ?? "",
      social_twitter: settings.social_twitter ?? "",
      social_youtube: settings.social_youtube ?? "",
    };
  } catch {
    // use fallbacks
  }

  return (
    <footer id="contact" className="relative overflow-hidden bg-charcoal pt-16 pb-8 text-white/70">
      <Leaf className="animate-float pointer-events-none absolute right-[8%] top-[12%] h-10 w-10 text-orange-brand/20" />
      <Leaf className="animate-float-slow pointer-events-none absolute right-[18%] top-[45%] h-8 w-8 text-orange-brand/15" />
      <span className="animate-float pointer-events-none absolute right-[4%] top-[65%] text-3xl opacity-20">
        🍅
      </span>
      <span className="animate-float-slow pointer-events-none absolute right-[14%] top-[28%] text-2xl opacity-15">
        🌿
      </span>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <div>
            <a href="#home" className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-brand text-white">
                <UtensilsCrossed className="h-5 w-5" />
              </span>
              <span lang="en" className="font-script text-2xl text-white">Humazd</span>
            </a>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/55">
              غذای خوشمزه با عشق. برای یک تجربه غذایی فراموش‌نشدنی در قلب شهر
              به ما سر بزنید.
            </p>
            <div className="mt-5 flex gap-3">
              {socialIcons.map(({ icon, label, key }) => (
                <SocialIcon key={label} label={label} href={socialLinks[key] || undefined}>
                  {icon}
                </SocialIcon>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-5 text-sm font-semibold uppercase tracking-wider text-white">
              لینک‌های سریع
            </h4>
            <ul className="space-y-3">
              {footerQuickLinks.map((link) => (
                <li key={link.href}>
                  <FooterQuickLink link={link} />
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-5 text-sm font-semibold uppercase tracking-wider text-white">
              ساعات کاری
            </h4>
            <ul className="space-y-3 text-sm">
              {hours.map((h) => (
                <li key={h.days} className="flex justify-between gap-4">
                  <span>{h.days}</span>
                  <span className="text-white/50">{h.time}</span>
                </li>
              ))}
            </ul>
            <p lang="en" className="font-script mt-4 text-lg text-orange-brand">
              We are Open Everyday!
            </p>
          </div>

          <div>
            <h4 className="mb-5 text-sm font-semibold uppercase tracking-wider text-white">
              تماس با ما
            </h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-orange-brand" />
                <a href={`tel:${contact.phone}`} className="hover:text-orange-brand">
                  {contact.phone}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-orange-brand" />
                <a href={`mailto:${contact.email}`} className="hover:text-orange-brand">
                  {contact.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-orange-brand" />
                <span>{contact.address}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-white/40 sm:flex-row">
          <p>© {new Date().getFullYear()} رستوران Humazd. تمامی حقوق محفوظ است.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-white">حریم خصوصی</Link>
            <Link href="/terms" className="hover:text-white">شرایط استفاده</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
