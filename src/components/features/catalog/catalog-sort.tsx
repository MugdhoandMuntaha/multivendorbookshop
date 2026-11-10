"use client";

import { useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ArrowUpDown, ChevronDown } from "lucide-react";
import { Dictionary } from "@/lib/i18n/types";

interface CatalogSortProps {
  dict: Dictionary;
}

export function CatalogSort({ dict }: CatalogSortProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const currentSort = searchParams.get("sort") || "newest";

  function handleSortChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "newest") {
      params.delete("sort");
    } else {
      params.set("sort", value);
    }
    // Reset to page 1 on sort change
    params.delete("page");

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  }

  return (
    <div className="flex items-center gap-2">
      <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
        <ArrowUpDown className="h-3.5 w-3.5 text-emerald-600" />
        <span>{dict.catalog.sortBy}:</span>
      </div>
      <div className="relative">
        <select
          value={currentSort}
          onChange={(e) => handleSortChange(e.target.value)}
          className="neo-input-recessed text-xs font-bold text-slate-700 py-1.5 pl-3 pr-8 rounded-xl appearance-none cursor-pointer border border-emerald-950/5 focus:outline-emerald-500"
        >
          <option value="newest">{dict.catalog.sortOptions.newest}</option>
          <option value="price_asc">{dict.catalog.sortOptions.price_asc}</option>
          <option value="price_desc">{dict.catalog.sortOptions.price_desc}</option>
          <option value="title_asc">{dict.catalog.sortOptions.title_asc}</option>
        </select>
        <ChevronDown className="absolute right-2.5 top-2.5 h-3.5 w-3.5 pointer-events-none text-slate-400" />
      </div>
    </div>
  );
}
