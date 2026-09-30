/**
 * Cache-bust local public images after you replace files.
 * Bump NEXT_PUBLIC_ASSET_VERSION in .env.local and restart dev server.
 */
export function assetSrc(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  const version = process.env.NEXT_PUBLIC_ASSET_VERSION ?? "1";
  return `${path}?v=${version}`;
}
