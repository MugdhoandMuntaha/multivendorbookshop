import Link from "next/link";
import {
  BookOpen,
  ShoppingBag,
  Search,
  PhoneCall,
  Store,
  Heart,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCurrentProfile } from "@/server/queries/auth";
import { getStorefrontSettings } from "@/server/queries/storefront";
import { getServerLocale, getDictionary } from "@/lib/i18n/server";
import { LanguageSwitcher } from "./language-switcher";
import { UserNav } from "./user-nav";

export function HeaderFallback() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-emerald-100 bg-white/90 shadow-xs">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold tracking-tight text-emerald-700"
        >
          <BookOpen className="h-6 w-6 text-emerald-600" />
          <span>RTDS Bookshop</span>
        </Link>
        <div className="bg-muted h-9 w-48 animate-pulse rounded-lg" />
      </div>
    </header>
  );
}

export async function Header() {
  const [{ profile }, settings, locale] = await Promise.all([
    getCurrentProfile(),
    getStorefrontSettings(),
    getServerLocale(),
  ]);

  const t = getDictionary(locale);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-emerald-100/80 bg-white/95 shadow-sm backdrop-blur-md">
      {/* 1. Top Announcement Bar & Language Switcher */}
      {settings.announcement_enabled && (
        <div className="border-b border-emerald-900/80 bg-emerald-950 px-4 py-1.5 text-xs text-emerald-100">
          <div className="container mx-auto flex max-w-7xl items-center justify-between">
            <div className="flex items-center gap-4 text-[11px]">
              <span className="flex items-center gap-1.5 font-medium">
                <PhoneCall className="h-3 w-3 text-emerald-400" />
                <span>
                  {t.common.helpline}: {settings.helpline_phone || "09612-007837"} ({settings.helpline_hours || t.common.serviceHours})
                </span>
              </span>
              <span className="hidden text-emerald-700 sm:inline-block">|</span>
              <span className="hidden font-medium text-amber-300 sm:inline-block">
                {locale === "bn"
                  ? (settings.announcement_text || t.header.announcement)
                  : "⚡ Nationwide Cash on Delivery | Free shipping on orders over ৳1,000"}
              </span>
            </div>

            <div className="flex items-center gap-3 text-[11px]">
              <Link
                href="/vendor/apply"
                className="hidden items-center gap-1.5 font-semibold text-emerald-300 transition-colors hover:text-white sm:flex"
              >
                <Store className="h-3 w-3 text-emerald-400" />
                <span>{t.header.sellBooksLink}</span>
              </Link>
              <span className="hidden text-emerald-800 sm:inline-block">|</span>
              <LanguageSwitcher variant="header" />
            </div>
          </div>
        </div>
      )}

      {/* 2. Main Header with Neomorphic Omnisearch */}
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Brand Logo with Neomorphic Tactile Container */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5 text-2xl font-black tracking-tight"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-[3px_3px_10px_rgba(5,150,105,0.25),-2px_-2px_6px_rgba(255,255,255,0.8)]">
            <BookOpen className="h-5 w-5" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-xl font-black tracking-tight text-slate-900">
              RTDS <span className="text-emerald-600">Bookshop</span>
            </span>
            <span className="text-[10px] font-semibold tracking-wide text-emerald-700">
              Official Book Marketplace
            </span>
          </div>
        </Link>

        {/* Central Search Bar (Neomorphic Recessed Inset Container) */}
        <form
          action="/books"
          method="GET"
          className="relative hidden max-w-2xl flex-1 items-center md:flex"
        >
          <div className="neo-input-recessed flex w-full items-center rounded-2xl px-1 py-1">
            <select
              name="category"
              className="max-w-[140px] cursor-pointer truncate border-r border-emerald-100 bg-transparent px-3 py-1.5 text-xs font-semibold text-emerald-900 focus:outline-none"
            >
              <option value="">{t.common.allCategories}</option>
              <option value="medical">Medical Admission Prep</option>
              <option value="engineering">Engineering & Varsity</option>
              <option value="academic">HSC & SSC Academic</option>
              <option value="fiction">Literature & Fiction</option>
              <option value="islamic">Islamic Literature</option>
              <option value="rare">Rare & Vintage Books</option>
            </select>

            <input
              type="text"
              name="q"
              placeholder={t.common.searchPlaceholder}
              className="w-full bg-transparent px-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none sm:text-sm"
            />

            <button
              type="submit"
              className="neo-button-green m-0.5 flex h-9 shrink-0 items-center gap-1.5 rounded-xl px-4 text-xs font-bold"
            >
              <Search className="h-4 w-4" />
              <span className="hidden lg:inline">{t.common.searchButton}</span>
            </button>
          </div>
        </form>

        {/* Right User Actions (Neomorphic Soft Light Buttons) */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <Link href="/buyer/wishlist" className="hidden sm:inline-flex">
            <Button
              variant="ghost"
              size="sm"
              className="neo-button-light relative h-9 w-9 rounded-xl p-0 hover:text-emerald-700"
            >
              <Heart className="h-4 w-4 text-emerald-700" />
              <span className="sr-only">{t.common.wishlist}</span>
            </Button>
          </Link>

          <Link href="/cart">
            <Button
              variant="outline"
              size="sm"
              className="neo-button-light relative h-9 gap-2 rounded-xl border-emerald-200/80 px-3.5 font-bold text-emerald-800"
            >
              <ShoppingBag className="h-4 w-4 text-emerald-600" />
              <span className="hidden text-xs sm:inline">{t.common.cart}</span>
              <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-emerald-600 px-1.5 text-[10px] font-bold text-white shadow-xs">
                0
              </span>
            </Button>
          </Link>

          <UserNav profile={profile} />
        </div>
      </div>

      {/* 3. Category Strip (Soft Mint Neomorphic Shelf Strip) */}
      <div className="hidden border-t border-emerald-100/60 bg-gradient-to-r from-emerald-50/50 via-white to-emerald-50/50 sm:block">
        <div className="container mx-auto flex max-w-7xl scrollbar-none items-center gap-6 overflow-x-auto px-4 py-2.5 text-xs font-semibold text-slate-700 sm:px-6 lg:px-8">
          <Link
            href="/categories"
            className="flex shrink-0 items-center gap-1.5 font-bold text-emerald-800 hover:text-emerald-600"
          >
            <Menu className="h-3.5 w-3.5 text-emerald-600" />
            <span>{t.header.categories.all}</span>
          </Link>

          <span className="text-emerald-200">|</span>

          <Link
            href="/books?category=medical"
            className="shrink-0 font-bold text-emerald-700 transition-colors hover:text-emerald-900"
          >
            {t.header.categories.medical}
          </Link>

          <Link
            href="/books?category=engineering"
            className="shrink-0 transition-colors hover:text-emerald-700"
          >
            {t.header.categories.engineering}
          </Link>

          <Link
            href="/books?category=fiction"
            className="shrink-0 transition-colors hover:text-emerald-700"
          >
            {t.header.categories.fiction}
          </Link>

          <Link
            href="/books?category=non-fiction"
            className="shrink-0 transition-colors hover:text-emerald-700"
          >
            {t.header.categories.nonFiction}
          </Link>

          <Link
            href="/books?category=islamic"
            className="shrink-0 transition-colors hover:text-emerald-700"
          >
            {t.header.categories.islamic}
          </Link>

          <Link
            href="/books?category=rare"
            className="shrink-0 transition-colors hover:text-emerald-700"
          >
            {t.header.categories.rare}
          </Link>

          <Link
            href="/vendors"
            className="ml-auto shrink-0 font-bold text-emerald-800 transition-colors hover:text-emerald-600"
          >
            {t.header.categories.verifiedShops}
          </Link>
        </div>
      </div>
    </header>
  );
}
