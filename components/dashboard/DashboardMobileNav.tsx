"use client";

import {
  CalendarDays,
  ChefHat,
  History,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import { DASHBOARD_NAV, type DashboardTab } from "@/lib/dashboard-data";

const ICONS = {
  "layout-dashboard": LayoutDashboard,
  "chef-hat": ChefHat,
  history: History,
  calendar: CalendarDays,
} as const;

interface DashboardMobileNavProps {
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
  onLogout: () => void;
}

export function DashboardMobileNav({
  activeTab,
  onTabChange,
  onLogout,
}: DashboardMobileNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-around border-t border-gray-800 bg-[#0a0a0a]/95 px-2 py-2 backdrop-blur-md lg:hidden">
      {DASHBOARD_NAV.map((item) => {
        const Icon = ICONS[item.icon];
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onTabChange(item.id)}
            className={`flex flex-col items-center gap-1 rounded-lg px-3 py-2 transition-colors ${
              isActive ? "text-[#F97316]" : "text-gray-500"
            }`}
          >
            <Icon className="h-5 w-5" strokeWidth={isActive ? 2 : 1.75} />
            <span className="text-[0.6rem] font-medium uppercase tracking-wide">
              {item.shortLabel}
            </span>
          </button>
        );
      })}
      <button
        type="button"
        onClick={onLogout}
        className="flex flex-col items-center gap-1 rounded-lg px-3 py-2 text-gray-500"
      >
        <LogOut className="h-5 w-5" strokeWidth={1.75} />
        <span className="text-[0.6rem] font-medium uppercase tracking-wide">
          خروج
        </span>
      </button>
    </nav>
  );
}
