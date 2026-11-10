import { cookies } from "next/headers";
import { Locale, Dictionary } from "./types";
import { enDictionary } from "./dictionaries/en";
import { bnDictionary } from "./dictionaries/bn";

export const COOKIE_NAME = "rtds_locale";
export const DEFAULT_LOCALE: Locale = "en";

export async function getServerLocale(): Promise<Locale> {
  try {
    const cookieStore = await cookies();
    const val = cookieStore.get(COOKIE_NAME)?.value;
    if (val === "bn" || val === "en") {
      return val;
    }
    return DEFAULT_LOCALE;
  } catch {
    return DEFAULT_LOCALE;
  }
}

export function getDictionary(locale: Locale = DEFAULT_LOCALE): Dictionary {
  return locale === "bn" ? bnDictionary : enDictionary;
}

