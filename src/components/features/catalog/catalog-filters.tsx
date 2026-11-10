"use client";

import { useState, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  SlidersHorizontal,
  X,
  RotateCcw,
  Search,
  Check,
  ChevronDown,
} from "lucide-react";
import { Dictionary, Locale } from "@/lib/i18n/types";
import { CategoryRow } from "@/server/queries/categories";
import { VendorRow } from "@/server/queries/vendors";

interface CatalogFiltersProps {
  categories: CategoryRow[];
  vendors: VendorRow[];
  dict: Dictionary;
  locale: Locale;
}

export function CatalogFilters({
  categories,
  vendors,
  dict,
  locale,
}: CatalogFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Read current active params
  const currentCategory = searchParams.get("category") || "all";
  const currentCondition = searchParams.get("condition") || "all";
  const currentVendor = searchParams.get("vendor") || "all";
  const currentMinPrice = searchParams.get("minPrice") || "";
  const currentMaxPrice = searchParams.get("maxPrice") || "";
  const currentSearch = searchParams.get("q") || "";

  // Local state for price inputs
  const [minPrice, setMinPrice] = useState(currentMinPrice);
  const [maxPrice, setMaxPrice] = useState(currentMaxPrice);
  const [localSearch, setLocalSearch] = useState(currentSearch);

  function applyFilters(updates: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());

    // Reset to page 1 whenever filters change
    params.delete("page");

    Object.entries(updates).forEach(([key, val]) => {
      if (!val || val === "all") {
        params.delete(key);
      } else {
        params.set(key, val);
      }
    });

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  }

  function handleClearAll() {
    setMinPrice("");
    setMaxPrice("");
    setLocalSearch("");
    startTransition(() => {
      router.push(pathname, { scroll: false });
    });
    setIsMobileOpen(false);
  }

  const conditions = [
    { value: "all", label: locale === "bn" ? "সকল অবস্থা" : "All Conditions" },
    { value: "new", label: dict.catalog.conditions.new },
    { value: "like_new", label: dict.catalog.conditions.like_new },
    { value: "good", label: dict.catalog.conditions.good },
    { value: "fair", label: dict.catalog.conditions.fair },
  ];

  const filterContent = (
    <div className="space-y-6">
      {/* Search Input Filter */}
      <div>
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
          {locale === "bn" ? "কীওয়ার্ড সার্চ" : "Search Query"}
        </label>
        <div className="relative">
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                applyFilters({ q: localSearch.trim() || null });
              }
            }}
            placeholder={
              locale === "bn"
                ? "বই বা লেখকের নাম..."
                : "Title, author, keyword..."
            }
            className="neo-input-recessed w-full pl-9 pr-8 py-2 text-xs rounded-xl"
          />
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
          {localSearch && (
            <button
              type="button"
              onClick={() => {
                setLocalSearch("");
                applyFilters({ q: null });
              }}
              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Category Section */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            {dict.common.allCategories}
          </label>
          {currentCategory !== "all" && (
            <button
              onClick={() => applyFilters({ category: null })}
              className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-700"
            >
              {dict.catalog.clearFilters}
            </button>
          )}
        </div>
        <div className="space-y-1 max-h-56 overflow-y-auto pr-1 text-xs">
          <button
            type="button"
            onClick={() => applyFilters({ category: null })}
            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-all ${
              currentCategory === "all"
                ? "bg-emerald-600 text-white font-bold shadow-xs"
                : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-800"
            }`}
          >
            <span>{dict.catalog.allVendors.replace("Booksellers", "Categories").replace("সকল বিক্রেতা", "সকল ক্যাটাগরি")}</span>
            {currentCategory === "all" && <Check className="h-3.5 w-3.5" />}
          </button>
          {categories.map((cat) => {
            const isSelected =
              currentCategory === cat.slug || currentCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => applyFilters({ category: cat.slug })}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-all ${
                  isSelected
                    ? "bg-emerald-600 text-white font-bold shadow-xs"
                    : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-800"
                }`}
              >
                <span className="truncate">{cat.name}</span>
                {isSelected && <Check className="h-3.5 w-3.5 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Book Condition Filter */}
      <div>
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
          {dict.catalog.condition}
        </label>
        <div className="space-y-1 text-xs">
          {conditions.map((cond) => {
            const isSelected = currentCondition === cond.value;
            return (
              <button
                key={cond.value}
                type="button"
                onClick={() => applyFilters({ condition: cond.value })}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-all ${
                  isSelected
                    ? "bg-emerald-100/80 text-emerald-900 font-bold border border-emerald-300/80"
                    : "text-slate-600 hover:bg-slate-100/60"
                }`}
              >
                <span>{cond.label}</span>
                {isSelected && (
                  <Check className="h-3.5 w-3.5 text-emerald-700" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range Filter (in BDT) */}
      <div>
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
          {dict.catalog.priceRange}
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            step={50}
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder={dict.catalog.minPrice}
            className="neo-input-recessed w-full px-2.5 py-1.5 text-xs rounded-xl"
          />
          <span className="text-slate-400 font-bold text-xs">-</span>
          <input
            type="number"
            min={0}
            step={50}
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder={dict.catalog.maxPrice}
            className="neo-input-recessed w-full px-2.5 py-1.5 text-xs rounded-xl"
          />
          <button
            type="button"
            onClick={() =>
              applyFilters({
                minPrice: minPrice || null,
                maxPrice: maxPrice || null,
              })
            }
            className="neo-button-green shrink-0 px-3 py-1.5 text-xs font-bold rounded-xl"
          >
            {dict.catalog.apply}
          </button>
        </div>
      </div>

      {/* Bookseller / Vendor Filter */}
      <div>
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
          {dict.catalog.vendor}
        </label>
        <div className="relative">
          <select
            value={currentVendor}
            onChange={(e) => applyFilters({ vendor: e.target.value })}
            className="neo-input-recessed w-full px-3 py-2 text-xs rounded-xl appearance-none pr-8 cursor-pointer text-slate-700 font-medium"
          >
            <option value="all">{dict.catalog.allVendors}</option>
            {vendors.map((v) => (
              <option key={v.id} value={v.slug}>
                {v.shop_name}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-2.5 h-3.5 w-3.5 pointer-events-none text-slate-400" />
        </div>
      </div>

      {/* Clear All Filters Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={handleClearAll}
          className="neo-button-light w-full flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-xl text-slate-600 hover:text-rose-600 transition-colors"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>{dict.catalog.clearFilters}</span>
        </button>
      </div>
    </div>
  );

  return (
    <div>
      {/* Desktop Faceted Sidebar (.neo-card) */}
      <div className="hidden lg:block neo-card p-5 sticky top-24">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-emerald-100/60">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-emerald-600" />
            <span className="text-sm font-bold text-slate-800">
              {dict.catalog.filters}
            </span>
          </div>
          {isPending && (
            <div className="h-3.5 w-3.5 rounded-full border-2 border-emerald-600 border-t-transparent animate-spin" />
          )}
        </div>
        {filterContent}
      </div>

      {/* Mobile Drawer Trigger Pill */}
      <div className="lg:hidden flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={() => setIsMobileOpen(true)}
          className="neo-button-light flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-slate-700"
        >
          <SlidersHorizontal className="h-3.5 w-3.5 text-emerald-600" />
          <span>{dict.catalog.filters}</span>
          {(currentCategory !== "all" ||
            currentCondition !== "all" ||
            currentVendor !== "all" ||
            currentMinPrice ||
            currentMaxPrice ||
            currentSearch) && (
            <span className="h-2 w-2 rounded-full bg-emerald-600 inline-block ml-1" />
          )}
        </button>
      </div>

      {/* Mobile Drawer Modal */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 flex bg-slate-900/40 backdrop-blur-xs lg:hidden">
          <div className="relative ml-auto h-full w-full max-w-xs bg-white p-5 shadow-2xl flex flex-col overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-emerald-600" />
                <span className="text-sm font-bold text-slate-800">
                  {dict.catalog.filters}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1">{filterContent}</div>
            <div className="pt-4 border-t border-slate-100 mt-4">
              <button
                type="button"
                onClick={() => setIsMobileOpen(false)}
                className="neo-button-green w-full py-2.5 text-xs font-bold rounded-xl"
              >
                {locale === "bn" ? "ফলাফল দেখুন" : "View Results"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
