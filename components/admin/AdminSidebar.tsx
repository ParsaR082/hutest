"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BarChart3,
  CalendarDays,
  ChefHat,
  ClipboardList,
  GalleryThumbnails,
  Image as ImageIcon,
  LayoutDashboard,
  LayoutTemplate,
  LogOut,
  Mail,
  MessageSquare,
  Newspaper,
  Search,
  Settings,
  ShoppingBag,
  Table2,
  UserCog,
  UtensilsCrossed,
  Users,
  Utensils,
} from "lucide-react";

const NAV = [
  { href: "/admin", label: "داشبورد", icon: LayoutDashboard, exact: true },
  { href: "/admin/orders", label: "سفارش‌ها", icon: ShoppingBag },
  { href: "/admin/kitchen", label: "آشپزخانه", icon: ChefHat },
  { href: "/admin/reservations", label: "رزروها", icon: CalendarDays },
  { href: "/admin/tables", label: "میزها", icon: Table2 },
  { href: "/admin/menu", label: "منو", icon: Utensils },
  { href: "/admin/gallery", label: "گالری", icon: GalleryThumbnails },
  { href: "/admin/blog", label: "وبلاگ", icon: Newspaper },
  { href: "/admin/customers", label: "مشتریان", icon: Users },
  { href: "/admin/reports", label: "گزارش‌ها", icon: BarChart3 },
  { href: "/admin/contacts", label: "پیام‌ها", icon: Mail },
  { href: "/admin/testimonials", label: "نظرات", icon: MessageSquare },
  { href: "/admin/media", label: "رسانه", icon: ImageIcon },
  { href: "/admin/site-images", label: "تصاویر سایت", icon: LayoutTemplate },
  { href: "/admin/seo", label: "سئو", icon: Search },
  { href: "/admin/staff", label: "پرسنل", icon: UserCog, adminOnly: true },
  { href: "/admin/audit-logs", label: "لاگ", icon: ClipboardList, adminOnly: true },
  { href: "/admin/settings", label: "تنظیمات", icon: Settings },
] as const;

import { isAdminRole } from "@/lib/auth/roles";
import { getStoredUser } from "@/lib/auth/storage";

export function AdminSidebar({ onLogout }: { onLogout: () => void }) {
  const pathname = usePathname();
  const [userRole, setUserRole] = useState<string | undefined>();

  useEffect(() => {
    setUserRole(getStoredUser()?.role);
  }, []);

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-e border-gray-800 bg-[#0a0a0a] lg:flex">
      <div className="border-b border-gray-800 px-5 py-6">
        <Link href="/admin" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F97316] text-white">
            <UtensilsCrossed className="h-4 w-4" />
          </span>
          <div>
            <span lang="en" className="font-script block text-xl text-white">
              Humazd
            </span>
            <span className="text-[0.6rem] font-semibold uppercase tracking-widest text-gray-500">
              پنل مدیریت
            </span>
          </div>
        </Link>
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-5">
        {NAV.filter(
          (item) => !("adminOnly" in item && item.adminOnly) || isAdminRole(userRole)
        ).map((item) => {
          const Icon = item.icon;
          const active =
            "exact" in item && item.exact
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
                active
                  ? "bg-[#111111] text-[#F97316]"
                  : "text-gray-400 hover:bg-[#111111]/60 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1 border-t border-gray-800 p-3">
        <Link
          href="/"
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm text-gray-500 transition hover:text-white"
        >
          ← بازگشت به سایت
        </Link>
        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm text-gray-500 transition hover:text-white"
        >
          <LogOut className="h-4 w-4" />
          خروج
        </button>
      </div>
    </aside>
  );
}
