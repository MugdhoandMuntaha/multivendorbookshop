import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format money stored as integer minor units (e.g. paisa).
 * Dedicated to Bangladeshi Taka (৳ BDT) marketplace formatting.
 */
export function formatPrice(
  amountMinor: number,
  currency: string = "BDT",
  locale: string = "en-BD"
): string {
  const majorAmount = amountMinor / 100;
  if (currency.toUpperCase() === "BDT") {
    const hasFractions = majorAmount % 1 !== 0;
    const formatted = new Intl.NumberFormat("en-BD", {
      minimumFractionDigits: hasFractions ? 2 : 0,
      maximumFractionDigits: 2,
    }).format(majorAmount);
    return `৳ ${formatted}`;
  }

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2,
  }).format(majorAmount);
}

/**
 * Convert user decimal input into integer minor units (e.g. 450.50 -> 45050 paisa)
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
  const baseUrl =
    process.env.NEXT_PUBLIC_R2_PUBLIC_URL ||
    "https://pub-aeaa730b76614ca59dda803402a739a3.r2.dev";
  const cleanBase = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  const cleanKey = r2Key.startsWith("/") ? r2Key.slice(1) : r2Key;
  return `${cleanBase}/${cleanKey}`;
}
