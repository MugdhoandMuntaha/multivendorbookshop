"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Locale, Dictionary } from "./types";
import { enDictionary } from "./dictionaries/en";
import { bnDictionary } from "./dictionaries/bn";
import { setLocaleAction } from "@/server/actions/locale";

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => Promise<void>;
  t: Dictionary;
}

const LanguageContext = createContext<LanguageContextType>({
  locale: "en",
  setLocale: async () => {},
  t: enDictionary,
});

export function LanguageProvider({
  initialLocale,
  children,
}: {
  initialLocale: Locale;
  children: React.ReactNode;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const router = useRouter();

  useEffect(() => {
    setLocaleState(initialLocale);
  }, [initialLocale]);

  const dictionary = locale === "bn" ? bnDictionary : enDictionary;

  async function handleSetLocale(newLocale: Locale) {
    setLocaleState(newLocale);
    // Set document cookie immediately for instant client feedback
    document.cookie = `rtds_locale=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    await setLocaleAction(newLocale);
    router.refresh();
  }

  return (
    <LanguageContext.Provider
      value={{
        locale,
        setLocale: handleSetLocale,
        t: dictionary,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    return {
      locale: "en" as Locale,
      setLocale: async () => {},
      t: enDictionary,
    };
  }
  return context;
}
