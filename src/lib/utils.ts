import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format money stored as integer minor units (e.g. paisa/cents).
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
  const publicBase =
    process.env.NEXT_PUBLIC_R2_PUBLIC_URL?.replace(/\/$/, "") ||
    "https://pub-aeaa730b76614ca59dda803402a739a3.r2.dev";
  const cleanKey = r2Key.startsWith("/") ? r2Key.slice(1) : r2Key;
  return `${publicBase}/${cleanKey}`;
}

/**
 * Generates an active consignment tracking URL for top Bangladeshi logistics partners.
 */
export function getCourierTrackingUrl(
  trackingNumber: string | null | undefined
): string | null {
  if (!trackingNumber) return null;
  const num = trackingNumber.trim();
  if (num.startsWith("http://") || num.startsWith("https://")) return num;

  // Extract clean code if prefix is present (e.g. "Steadfast: ST-12345" or "ST-12345")
  const cleanCode = num.includes(":") ? num.split(":")[1].trim() : num;

  if (
    cleanCode.toUpperCase().startsWith("ST-") ||
    cleanCode.toUpperCase().startsWith("SF-") ||
    num.toLowerCase().includes("steadfast")
  ) {
    return `https://steadfast.com.bd/t/${cleanCode}`;
  }
  if (
    cleanCode.toUpperCase().startsWith("PT-") ||
    cleanCode.toUpperCase().startsWith("PATHAO-") ||
    num.toLowerCase().includes("pathao")
  ) {
    const code = cleanCode.replace(/^(PT-|PATHAO-)/i, "");
    return `https://merchant.pathao.com/tracking?consignment_id=${code}`;
  }
  if (
    cleanCode.toUpperCase().startsWith("REDX-") ||
    num.toLowerCase().includes("redx")
  ) {
    const code = cleanCode.replace(/^REDX-/i, "");
    return `https://redx.com.bd/track-order/?trackingId=${code}`;
  }
  if (
    cleanCode.toUpperCase().startsWith("PF-") ||
    cleanCode.toUpperCase().startsWith("PAPERFLY-") ||
    num.toLowerCase().includes("paperfly")
  ) {
    const code = cleanCode.replace(/^(PF-|PAPERFLY-)/i, "");
    return `https://paperfly.com.bd/tracking.php?orderId=${code}`;
  }

  // Default to Steadfast courier format
  return `https://steadfast.com.bd/t/${cleanCode}`;
}

