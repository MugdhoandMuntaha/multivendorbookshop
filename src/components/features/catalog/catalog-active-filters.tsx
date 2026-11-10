"use client";

import { useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { X } from "lucide-react";
import { Dictionary, Locale } from "@/lib/i18n/types";
import { CategoryRow } from "@/server/queries/categories";
import { VendorRow } from "@/server/queries/vendors";

interface CatalogActiveFiltersProps {
  categories: CategoryRow[];
  vendors: VendorRow[];
  dict: Dictionary;
  locale: Locale;
  total: number;
}

export function CatalogActiveFilters({
  categories,
  vendors,
  dict,
  locale,
  total,
}: CatalogActiveFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const q = searchParams.get("q");
  const category = searchParams.get("category");
  const condition = searchParams.get("condition");
  const vendor = searchParams.get("vendor");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");

  const hasFilters = Boolean(
    q || category || condition || vendor || minPrice || maxPrice
  );

  function removeFilter(key: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    params.delete("page");
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  }

  function clearAll() {
    startTransition(() => {
      router.push(pathname, { scroll: false });
    });
  }

  const categoryName = category
    ? categories.find((c) => c.slug === category || c.id === category)?.name ||
      category
    : null;

  const vendorName = vendor
    ? vendors.find((v) => v.slug === vendor || v.id === vendor)?.shop_name ||
      vendor
    : null;

  const conditionLabel = condition
    ? dict.catalog.conditions[
        condition as keyof typeof dict.catalog.conditions
      ] || condition
    : null;

  return (
    <div className="flex flex-wrap items-center justify-between gap-2.5 pb-4">
      {/* Results Count Text */}
      <div className="text-xs font-bold text-slate-700">
        {locale === "bn"
          ? `${total} টি বই পাওয়া গেছে`
          : dict.catalog.resultsCount.replace("{count}", total.toString())}
      </div>

      {/* Active Filter Pills */}
      {hasFilters && (
        <div className="flex flex-wrap items-center gap-1.5">
          {q && (
            <span className="neo-pill-mint inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold">
              <span>&ldquo;{q}&rdquo;</span>
              <button
                type="button"
                onClick={() => removeFilter("q")}
                className="hover:text-emerald-950"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {categoryName && (
            <span className="neo-pill-mint inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold">
              <span>{categoryName}</span>
              <button
                type="button"
                onClick={() => removeFilter("category")}
                className="hover:text-emerald-950"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {conditionLabel && (
            <span className="neo-pill-mint inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold">
              <span>{conditionLabel}</span>
              <button
                type="button"
                onClick={() => removeFilter("condition")}
                className="hover:text-emerald-950"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {vendorName && (
            <span className="neo-pill-mint inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold">
              <span>{vendorName}</span>
              <button
                type="button"
                onClick={() => removeFilter("vendor")}
                className="hover:text-emerald-950"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {(minPrice || maxPrice) && (
            <span className="neo-pill-mint inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold">
              <span>
                ৳{minPrice || "0"} - ৳{maxPrice || "∞"}
              </span>
              <button
                type="button"
                onClick={() => {
                  const params = new URLSearchParams(searchParams.toString());
                  params.delete("minPrice");
                  params.delete("maxPrice");
                  params.delete("page");
                  startTransition(() => {
                    router.push(`${pathname}?${params.toString()}`, {
                      scroll: false,
                    });
                  });
                }}
                className="hover:text-emerald-950"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          <button
            type="button"
            onClick={clearAll}
            className="text-[11px] font-bold text-rose-600 hover:text-rose-700 underline underline-offset-2 ml-1"
          >
            {dict.catalog.clearFilters}
          </button>
        </div>
      )}
    </div>
  );
}
