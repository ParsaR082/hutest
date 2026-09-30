"use client";

import { useEffect, useState } from "react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { fetchAdminContacts, type AdminContact } from "@/lib/api/admin";
import { getAccessToken } from "@/lib/auth/storage";

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString("fa-IR");
  } catch {
    return iso;
  }
}

export function AdminContactsPage() {
  const [contacts, setContacts] = useState<AdminContact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) return;
    fetchAdminContacts(token)
      .then(setContacts)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="px-4 py-8 sm:px-8 lg:px-10">
      <AdminPageHeader eyebrow="Inbox" title="پیام‌های تماس" />

      {loading ? (
        <p className="text-sm text-gray-500">در حال بارگذاری...</p>
      ) : contacts.length === 0 ? (
        <p className="text-sm text-gray-500">پیامی دریافت نشده</p>
      ) : (
        <div className="space-y-4">
          {contacts.map((c) => (
            <article
              key={c.id}
              className="rounded-2xl border border-gray-800 bg-[#111111]/80 p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-medium text-white">{c.name}</h2>
                  <p className="mt-1 text-xs text-gray-500">
                    {c.email} · {c.phone || "بدون تلفن"}
                  </p>
                </div>
                <time className="text-xs text-gray-600">{formatDate(c.created_at)}</time>
              </div>
              {c.subject && (
                <p className="mt-3 text-sm font-medium text-[#F97316]">{c.subject}</p>
              )}
              <p className="mt-2 text-sm leading-relaxed text-gray-300">{c.message}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
