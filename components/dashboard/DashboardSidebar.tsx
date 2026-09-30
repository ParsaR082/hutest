"use client";

import Link from "next/link";
import {
  CalendarDays,
  ChefHat,
  History,
  LayoutDashboard,
  LogOut,
  Settings,
  UtensilsCrossed,
} from "lucide-react";
import { LocalImage } from "@/components/ui/LocalImage";
import {
  DASHBOARD_NAV,
  type DashboardTab,
  type MockUser,
} from "@/lib/dashboard-data";

const ICONS = {
  "layout-dashboard": LayoutDashboard,
  "chef-hat": ChefHat,
  history: History,
  calendar: CalendarDays,
} as const;

interface DashboardSidebarProps {
  user: MockUser;
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
  onLogout: () => void;
}

export function DashboardSidebar({
  user,
  activeTab,
  onTabChange,
  onLogout,
}: DashboardSidebarProps) {
  return (
    <aside className="hidden w-72 shrink-0 flex-col border-e border-gray-800 bg-[#0a0a0a] lg:flex">
      <div className="border-b border-gray-800 px-6 py-8">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F97316] text-white">
            <UtensilsCrossed className="h-4 w-4" strokeWidth={2.2} />
          </span>
          <span lang="en" className="font-script text-2xl text-white">Humazd</span>
        </Link>
      </div>

      <div className="border-b border-gray-800 px-6 py-8">
        <div className="relative mx-auto h-20 w-20">
          <div className="absolute inset-0 rounded-full bg-[#F97316]/20 blur-md" />
          <div className="relative h-full w-full overflow-hidden rounded-full ring-2 ring-[#F97316] ring-offset-4 ring-offset-[#0a0a0a]">
            <LocalImage
              src={user.avatar}
              alt={user.name}
              fill
              className="object-cover"
              sizes="80px"
            />
          </div>
        </div>
        <p className="mt-5 text-center font-serif text-lg font-semibold text-white">
          {user.name}
        </p>
        <p className="mt-1 text-center text-xs text-gray-500">{user.email}</p>
        <div className="mt-4 flex justify-center">
          <span className="rounded-full border border-[#F97316]/40 bg-[#F97316]/10 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-[#F97316]">
            {user.tier}
          </span>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-4 py-6">
        {DASHBOARD_NAV.map((item) => {
          const Icon = ICONS[item.icon];
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onTabChange(item.id)}
              className={`relative flex items-center gap-3 rounded-lg px-4 py-3 text-start text-sm font-medium transition-colors ${
                isActive
                  ? "bg-[#111111]/80 text-[#F97316]"
                  : "text-gray-400 hover:bg-[#111111]/50 hover:text-white"
              }`}
            >
              {isActive && (
                <span className="absolute start-0 top-1/2 h-8 w-0.5 -translate-y-1/2 rounded-e bg-[#F97316]" />
              )}
              <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="border-t border-gray-800 px-4 py-3">
        <Link
          href="/dashboard/settings"
          className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-gray-400 transition hover:bg-[#111111]/50 hover:text-white"
        >
          <Settings className="h-4 w-4" strokeWidth={1.75} />
          تنظیمات پروفایل
        </Link>
      </div>

      <div className="border-t border-gray-800 p-4">
        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-gray-500 transition hover:bg-[#111111]/50 hover:text-white"
        >
          <LogOut className="h-4 w-4" strokeWidth={1.75} />
          خروج
        </button>
      </div>
    </aside>
  );
}
