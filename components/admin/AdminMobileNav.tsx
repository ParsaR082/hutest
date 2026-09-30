"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { isAdminRole } from "@/lib/auth/roles";
import { getStoredUser } from "@/lib/auth/storage";

const LINKS = [
  { href: "/admin", label: "داشبورد" },
  { href: "/admin/orders", label: "سفارش‌ها" },
  { href: "/admin/kitchen", label: "آشپزخانه" },
  { href: "/admin/reservations", label: "رزروها" },
  { href: "/admin/tables", label: "میزها" },
  { href: "/admin/menu", label: "منو" },
  { href: "/admin/gallery", label: "گالری" },
  { href: "/admin/blog", label: "وبلاگ" },
  { href: "/admin/customers", label: "مشتریان" },
  { href: "/admin/reports", label: "گزارش‌ها" },
  { href: "/admin/contacts", label: "پیام‌ها" },
  { href: "/admin/testimonials", label: "نظرات" },
  { href: "/admin/media", label: "رسانه" },
  { href: "/admin/site-images", label: "تصاویر سایت" },
  { href: "/admin/seo", label: "سئو" },
  { href: "/admin/staff", label: "پرسنل", adminOnly: true },
  { href: "/admin/audit-logs", label: "لاگ", adminOnly: true },
  { href: "/admin/settings", label: "تنظیمات" },
];

export function AdminMobileNav() {
  const [open, setOpen] = useState(false);
  const [userRole, setUserRole] = useState<string | undefined>();
  const pathname = usePathname();

  useEffect(() => {
    setUserRole(getStoredUser()?.role);
  }, []);

  const links = LINKS.filter((l) => !l.adminOnly || isAdminRole(userRole));

  return (
    <div className="border-b border-gray-800 bg-[#0a0a0a] lg:hidden">
      <div className="flex items-center justify-between px-4 py-3">
        <span className="font-script text-lg text-white">Humazd Admin</span>
        <button
          type="button"
          aria-label="منو"
          onClick={() => setOpen((o) => !o)}
          className="rounded-lg border border-gray-800 p-2 text-gray-400"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && (
        <nav className="flex flex-col gap-1 px-3 pb-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`rounded-lg px-3 py-2.5 text-sm ${
                pathname === link.href || pathname.startsWith(`${link.href}/`)
                  ? "bg-[#111111] text-[#F97316]"
                  : "text-gray-400"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}
