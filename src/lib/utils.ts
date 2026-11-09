import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format money stored as integer minor units (e.g. cents, paisa).
 * Never use floats for monetary calculations.
 */
export function formatPrice(
  amountMinor: number,
  currency: string = "USD",
  locale: string = "en-US"
): string {
  // Minor units to major units for Intl formatter
  const majorAmount = amountMinor / 100;
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2,
  }).format(majorAmount);
}

/**
 * Convert user decimal input into integer minor units (e.g. 19.99 -> 1999)
 */
export function toMinorUnits(amount: number): number {
  return Math.round(amount * 100);
}

/**
 * Resolves a Cloudflare R2 object key into a public CDN URL.
 */
export function getR2ImageUrl(r2Key: string | null | undefined): string {
  if (!r2Key) {
    return "/placeholder-book.svg";
  }
  if (r2Key.startsWith("http://") || r2Key.startsWith("https://")) {
    return r2Key;
  }
  const publicBase =
    process.env.NEXT_PUBLIC_R2_PUBLIC_URL?.replace(/\/$/, "") ||
    "https://pub-aeaa730b76614ca59dda803402a739a3.r2.dev";
  const cleanKey = r2Key.startsWith("/") ? r2Key.slice(1) : r2Key;
  return `${publicBase}/${cleanKey}`;
}
