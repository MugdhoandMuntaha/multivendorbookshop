"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { Locale } from "@/lib/i18n/types";
import { COOKIE_NAME } from "@/lib/i18n/server";

export async function setLocaleAction(locale: Locale) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 year
    sameSite: "lax",
  });

  revalidatePath("/", "layout");
  return { success: true, locale };
}
