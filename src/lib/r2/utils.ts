/**
 * Returns the public CDN URL for an R2 object key.
 * If the key is already a full URL or null, handles gracefully.
 */
export function getR2PublicUrl(key: string | null | undefined): string {
  if (!key) return "/placeholder-book.svg";
  if (key.startsWith("http://") || key.startsWith("https://")) {
    return key;
  }
  const baseUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL?.replace(/\/$/, "");
  if (!baseUrl) {
    return `/${key.replace(/^\//, "")}`;
  }
  return `${baseUrl}/${key.replace(/^\//, "")}`;
}
