"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminMobileNav } from "@/components/admin/AdminMobileNav";
import { logout } from "@/lib/api/auth";
import { isStaffRole } from "@/lib/auth/roles";
import {
  clearAuthSession,
  getAccessToken,
  getRefreshToken,
  getStoredUser,
} from "@/lib/auth/storage";

export function AdminGate({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const user = getStoredUser();
    const token = getAccessToken();

    if (!token || !user || !isStaffRole(user.role)) {
      router.replace("/admin-login?next=/admin");
      return;
    }

    setReady(true);
  }, [router]);

  const handleLogout = async () => {
    const access = getAccessToken();
    const refresh = getRefreshToken();
    if (access && refresh) {
      try {
        await logout(refresh, access);
      } catch {
        /* ignore */
      }
    }
    clearAuthSession();
    router.push("/auth");
  };

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] text-sm text-gray-500">
        در حال بررسی دسترسی...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#0a0a0a] text-white/85 lg:flex-row">
      <AdminSidebar onLogout={() => void handleLogout()} />
      <div className="flex min-h-screen flex-1 flex-col overflow-x-hidden">
        <AdminMobileNav />
        {children}
      </div>
    </div>
  );
}
