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
