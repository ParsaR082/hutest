"use client";

import { useEffect, useState } from "react";
import { AnimatedButton } from "@/components/ui/AnimatedButton";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { createAdminStaff, fetchAdminStaff } from "@/lib/api/admin";
import type { UserProfile } from "@/lib/api/types";
import { getAccessToken, getStoredUser } from "@/lib/auth/storage";
import { isAdminRole } from "@/lib/auth/roles";
import { useRouter } from "next/navigation";

const ROLES = [
  { value: "staff", label: "Staff" },
  { value: "manager", label: "Manager" },
  { value: "admin", label: "Admin" },
] as const;

export function AdminStaffPage() {
  const router = useRouter();
  const [staff, setStaff] = useState<UserProfile[]>([]);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("staff");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const user = getStoredUser();
    if (!isAdminRole(user?.role)) {
      router.replace("/admin");
      return;
    }
    const token = getAccessToken();
    if (!token) return;
    fetchAdminStaff(token)
      .then(setStaff)
      .finally(() => setLoading(false));
  }, [router]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getAccessToken();
    if (!token) return;
    setSaving(true);
    setError(null);
    try {
      await createAdminStaff(token, { email, username, password, role });
      setEmail("");
      setUsername("");
      setPassword("");
      const updated = await fetchAdminStaff(token);
      setStaff(updated);
    } catch {
      setError("ایجاد کاربر ناموفق بود.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="px-4 py-8 sm:px-8 lg:px-10">
      <AdminPageHeader eyebrow="Staff" title="مدیریت پرسنل" />

      <form
        onSubmit={(e) => void handleCreate(e)}
        className="mb-8 max-w-2xl space-y-4 rounded-2xl border border-gray-800 bg-[#111111]/80 p-5"
      >
        <h2 className="text-sm font-medium text-gray-400">افزودن پرسنل</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <input
            placeholder="ایمیل"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-xl border border-gray-800 bg-[#0a0a0a] px-3 py-2 text-sm text-white outline-none focus:border-[#F97316]/50"
          />
          <input
            placeholder="نام کاربری"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="rounded-xl border border-gray-800 bg-[#0a0a0a] px-3 py-2 text-sm text-white outline-none focus:border-[#F97316]/50"
          />
          <input
            type="password"
            placeholder="رمز عبور"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-xl border border-gray-800 bg-[#0a0a0a] px-3 py-2 text-sm text-white outline-none focus:border-[#F97316]/50"
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="rounded-xl border border-gray-800 bg-[#0a0a0a] px-3 py-2 text-sm text-white outline-none focus:border-[#F97316]/50"
          >
            {ROLES.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <AnimatedButton type="submit" className="px-5 py-2.5 text-[0.65rem]" disabled={saving}>
          {saving ? "..." : "ایجاد"}
        </AnimatedButton>
      </form>

      {loading ? (
        <p className="text-sm text-gray-500">در حال بارگذاری...</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-gray-800">
          <table className="min-w-full text-sm">
            <thead className="bg-[#111111] text-gray-500">
              <tr>
                <th className="px-4 py-3 text-start">نام</th>
                <th className="px-4 py-3 text-start">ایمیل</th>
                <th className="px-4 py-3 text-start">نقش</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((s) => (
                <tr key={s.id} className="border-t border-gray-800/80">
                  <td className="px-4 py-3 text-white">
                    {[s.first_name, s.last_name].filter(Boolean).join(" ") || s.username}
                  </td>
                  <td className="px-4 py-3 text-gray-400">{s.email}</td>
                  <td className="px-4 py-3 text-[#F97316]">{s.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
