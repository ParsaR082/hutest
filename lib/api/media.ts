import { apiFetch, getApiBaseUrl } from "./fetch";
import { ApiError } from "./client";

export type MediaUsage = { location: string; field: string };

export type MediaFile = {
  id: number;
  name: string;
  path: string;
  url: string;
  alt_text: string;
  description: string;
  content_type: string;
  size: number | null;
  width: number | null;
  height: number | null;
  uploaded_at: string | null;
  usage: MediaUsage[];
};

type ApiEnvelope<T> = {
  success: boolean;
  data?: T;
  error?: { code: string; message: string; details?: unknown };
};

export function fetchAdminMedia(token: string, query?: string) {
  const qs = query ? `?q=${encodeURIComponent(query)}` : "";
  return apiFetch<MediaFile[]>(`/admin/media/${qs}`, { token, cache: "no-store" });
}

export async function uploadAdminMedia(
  token: string,
  file: File,
  extra?: { alt_text?: string; description?: string }
): Promise<MediaFile> {
  const formData = new FormData();
  formData.append("file", file);
  if (extra?.alt_text) formData.append("alt_text", extra.alt_text);
  if (extra?.description) formData.append("description", extra.description);
  const res = await fetch(`${getApiBaseUrl()}/admin/media/upload/`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  const json: ApiEnvelope<MediaFile> = await res.json();
  if (!json.success) throw new ApiError(json.error ?? { code: "UNKNOWN", message: "Request failed" });
  return json.data as MediaFile;
}

export function updateAdminMedia(token: string, id: number, data: { alt_text?: string; description?: string }) {
  return apiFetch<MediaFile>("/admin/media/", {
    method: "PATCH",
    token,
    body: JSON.stringify({ id, ...data }),
  });
}

export async function deleteAdminMedia(token: string, id: number, force = false): Promise<void> {
  const res = await fetch(`${getApiBaseUrl()}/admin/media/`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, force }),
  });
  const json: ApiEnvelope<{ deleted: boolean }> = await res.json();
  if (!json.success) throw new ApiError(json.error ?? { code: "UNKNOWN", message: "Request failed" });
}
