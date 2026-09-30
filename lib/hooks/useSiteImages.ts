"use client";

import { useEffect, useState } from "react";
import { fetchSiteImages } from "@/lib/api/site-images";

/** Admin-assignable site images, keyed by slug. Falls back to an empty map
 * until the request resolves, so every call site should fall back to its
 * existing static asset when a slug is missing (`images[slug] ?? fallback`). */
export function useSiteImages() {
  const [images, setImages] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchSiteImages()
      .then(setImages)
      .catch(() => null);
  }, []);

  return images;
}
