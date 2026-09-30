"use client";

import { useEffect, useState } from "react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { fetchAdminAuditLogs, type AdminAuditLog } from "@/lib/api/admin";
import { getAccessToken, getStoredUser } from "@/lib/auth/storage";
import { isAdminRole } from "@/lib/auth/roles";
import { useRouter } from "next/navigation";

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString("fa-IR");
  } catch {
    return iso;
  }
}

export function AdminAuditLogsPage() {
  const router = useRouter();
  const [logs, setLogs] = useState<AdminAuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getStoredUser();
    if (!isAdminRole(user?.role)) {
      router.replace("/admin");
      return;
    }
    const token = getAccessToken();
    if (!token) return;
    fetchAdminAuditLogs(token)
      .then(setLogs)
      .finally(() => setLoading(false));
  }, [router]);

  return (
    <div className="px-4 py-8 sm:px-8 lg:px-10">
      <AdminPageHeader eyebrow="Audit" title="لاگ فعالیت‌ها" />

      {loading ? (
        <p className="text-sm text-gray-500">در حال بارگذاری...</p>
      ) : logs.length === 0 ? (
        <p className="text-sm text-gray-500">لاگی ثبت نشده</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-gray-800">
          <table className="min-w-full text-sm">
            <thead className="bg-[#111111] text-gray-500">
              <tr>
                <th className="px-4 py-3 text-start">زمان</th>
                <th className="px-4 py-3 text-start">عملیات</th>
                <th className="px-4 py-3 text-start">موجودیت</th>
                <th className="px-4 py-3 text-start">کاربر</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-t border-gray-800/80">
                  <td className="px-4 py-3 text-gray-500">{formatDate(log.created_at)}</td>
                  <td className="px-4 py-3 text-white">{log.action}</td>
                  <td className="px-4 py-3 text-gray-400">
                    {log.entity_type} #{log.entity_id}
                  </td>
                  <td className="px-4 py-3 text-gray-400">{log.actor ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
