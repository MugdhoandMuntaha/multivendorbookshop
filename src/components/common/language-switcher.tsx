"use client";

import { useTransition } from "react";
import { Globe } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";

interface LanguageSwitcherProps {
  className?: string;
  variant?: "pill" | "header" | "compact";
}

export function LanguageSwitcher({
  className = "",
  variant = "header",
}: LanguageSwitcherProps) {
  const { locale, setLocale } = useLanguage();
  const [isPending, startTransition] = useTransition();

  const toggleLocale = (target: "en" | "bn") => {
    if (target === locale) return;
    startTransition(async () => {
      await setLocale(target);
    });
  };

  if (variant === "compact") {
    return (
      <div
        className={`inline-flex items-center rounded-xl border border-emerald-200/80 bg-white/90 p-0.5 text-xs font-bold shadow-xs ${className}`}
      >
        <button
          type="button"
          disabled={isPending}
          onClick={() => toggleLocale("en")}
          className={`rounded-lg px-2 py-1 transition-all ${
            locale === "en"
              ? "bg-emerald-600 text-white shadow-xs"
              : "text-slate-600 hover:text-emerald-700"
          }`}
        >
          EN
        </button>
        <button
          type="button"
          disabled={isPending}
          onClick={() => toggleLocale("bn")}
          className={`rounded-lg px-2 py-1 transition-all ${
            locale === "bn"
              ? "bg-emerald-600 text-white shadow-xs"
              : "text-slate-600 hover:text-emerald-700"
          }`}
        >
          বাং
        </button>
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-1 rounded-2xl border border-emerald-200/90 bg-white/95 p-1 text-xs font-bold shadow-[2px_2px_6px_rgba(5,150,105,0.08),-1px_-1px_4px_rgba(255,255,255,0.9)] ${className}`}
      role="group"
      aria-label="Language Selector"
    >
      <div className="flex items-center gap-1 pl-1.5 pr-1 text-emerald-700">
        <Globe className="h-3.5 w-3.5" />
      </div>

      <button
        type="button"
        disabled={isPending}
        onClick={() => toggleLocale("en")}
        className={`rounded-xl px-2.5 py-1 text-xs font-bold transition-all ${
          locale === "en"
            ? "bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-xs"
            : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-800"
        }`}
      >
        English
      </button>

      <button
        type="button"
        disabled={isPending}
        onClick={() => toggleLocale("bn")}
        className={`rounded-xl px-2.5 py-1 text-xs font-bold transition-all ${
          locale === "bn"
            ? "bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-xs"
            : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-800"
        }`}
      >
        বাংলা
      </button>
    </div>
  );
}
