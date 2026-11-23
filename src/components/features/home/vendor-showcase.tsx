"use client";

import Link from "next/link";
import { Store, Star, ArrowRight } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";

interface VendorCardData {
  id: string;
  nameBn: string;
  nameEn: string;
  slug: string;
  rating: string;
  salesCount: string;
  initials: string;
  badgeBg: string;
}

const FEATURED_VENDORS: VendorCardData[] = [
  {
    id: "v-1",
    nameBn: "পথপ্রদীপ প্রকাশনী",
    nameEn: "Pothprodip Prokashoni",
    slug: "rtds-publications-depot",
    rating: "4.8",
    salesCount: "12k+ sold",
    initials: "পথ",
    badgeBg: "bg-stone-100 text-stone-800 border-stone-200",
  },
  {
    id: "v-2",
    nameBn: "জ্ঞানবাণী প্রকাশন",
    nameEn: "Gyanbani Publications",
    slug: "banglabazar-boi-bhaban",
    rating: "4.7",
    salesCount: "8k+ sold",
    initials: "জ্ঞান",
    badgeBg: "bg-stone-100 text-stone-800 border-stone-200",
  },
  {
    id: "v-3",
    nameBn: "বইস্বত্ব বুক হাব",
    nameEn: "Boiswatto Book Hub",
    slug: "banglabazar-boi-bhaban",
    rating: "4.7",
    salesCount: "5k+ sold",
    initials: "বই",
    badgeBg: "bg-stone-100 text-stone-800 border-stone-200",
  },
  {
    id: "v-4",
    nameBn: "অক্ষর প্রকাশ ও প্রকাশনী",
    nameEn: "Okkhor Publications",
    slug: "nilkhet-engineering-corner",
    rating: "4.8",
    salesCount: "10k+ sold",
    initials: "অক্ষর",
    badgeBg: "bg-stone-100 text-stone-800 border-stone-200",
  },
];

export function VendorShowcase() {
  const { locale } = useLanguage();

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100/70 text-emerald-800">
            <Store className="h-4 w-4 stroke-[1.5]" />
          </div>
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-slate-900">
              {locale === "bn"
                ? "আমাদের সেলারদের জনপ্রিয় বই"
                : "Popular Sellers & Publishers"}
            </h2>
            <p className="text-xs text-slate-500">
              {locale === "bn"
                ? "বিভিন্ন প্রকাশক ও বিক্রেতার সেরা সংগ্রহ"
                : "Curated books from verified Bangladeshi publishers and bookstores"}
            </p>
          </div>
        </div>

        <Link
          href="/vendors"
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#0c3823] hover:bg-[#124d31] px-3.5 py-1.5 text-xs font-medium text-white transition-colors"
        >
          <span>{locale === "bn" ? "সব দেখুন" : "View All"}</span>
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {FEATURED_VENDORS.map((vendor) => {
          const displayName = locale === "bn" ? vendor.nameBn : vendor.nameEn;

          return (
            <div
              key={vendor.id}
              className="group flex items-center justify-between gap-3 rounded-xl border border-stone-200/80 bg-white p-3.5 shadow-2xs transition-colors hover:border-stone-300"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border text-xs font-semibold ${vendor.badgeBg}`}
                >
                  {vendor.initials}
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-semibold text-slate-900 truncate group-hover:text-emerald-900 transition-colors">
                    {displayName}
                  </h4>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500 tabular-nums">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    <span className="font-semibold text-slate-800">
                      {vendor.rating}
                    </span>
                    <span>({vendor.salesCount})</span>
                  </div>
                </div>
              </div>

              <Link
                href={`/vendors/${vendor.slug}`}
                className="shrink-0 inline-flex items-center gap-1 rounded-md border border-stone-200 px-2 py-1 text-[10px] font-medium text-stone-600 hover:border-[#0c3823] hover:text-[#0c3823] transition-colors"
              >
                <span>Visit Shop</span>
                <ArrowRight className="h-2.5 w-2.5" />
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}
