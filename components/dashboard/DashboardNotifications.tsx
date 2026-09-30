"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import { fetchNotifications, markNotificationRead } from "@/lib/api/notifications";
import { getAccessToken } from "@/lib/auth/storage";

export function DashboardNotifications() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Awaited<ReturnType<typeof fetchNotifications>>>([]);

  const load = async () => {
    const token = getAccessToken();
    if (!token) return;
    try {
      const data = await fetchNotifications(token);
      setItems(data);
    } catch {
      setItems([]);
    }
  };

  useEffect(() => {
    void load();
    const interval = setInterval(() => void load(), 60000);
    return () => clearInterval(interval);
  }, []);

  const unread = items.filter((n) => !n.is_read).length;

  const handleRead = async (id: number) => {
    const token = getAccessToken();
    if (!token) return;
    await markNotificationRead(token, id);
    await load();
  };

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="اعلان‌ها"
        onClick={() => setOpen((o) => !o)}
        className="relative rounded-lg border border-gray-800 p-2 text-gray-400 hover:text-white"
      >
        <Bell className="h-5 w-5" />
        {unread > 0 && (
          <span className="absolute -top-1 -start-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#F97316] px-1 text-[0.6rem] font-bold text-white">
            {unread}
          </span>
        )}
      </button>
      {open && (
        <>
          <button
            type="button"
            aria-label="بستن"
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute end-0 top-full z-50 mt-2 w-72 rounded-xl border border-gray-800 bg-[#111111] p-3 shadow-xl">
            <p className="mb-2 text-xs font-medium uppercase tracking-widest text-gray-500">
              اعلان‌ها
            </p>
            {items.length === 0 ? (
              <p className="py-4 text-center text-xs text-gray-600">اعلانی نیست</p>
            ) : (
              <ul className="max-h-64 space-y-2 overflow-y-auto">
                {items.slice(0, 10).map((n) => (
                  <li key={n.id}>
                    <button
                      type="button"
                      onClick={() => void handleRead(n.id)}
                      className={`w-full rounded-lg px-3 py-2 text-start text-xs ${
                        n.is_read ? "text-gray-500" : "bg-[#0a0a0a] text-gray-200"
                      }`}
                    >
                      <p className="font-medium">{n.title}</p>
                      <p className="mt-0.5 text-gray-500">{n.body}</p>
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <Link
              href="/dashboard"
              onClick={() => setOpen(false)}
              className="mt-2 block text-center text-xs text-[#F97316] hover:underline"
            >
              داشبورد
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
