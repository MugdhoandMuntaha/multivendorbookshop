import Link from "next/link";
import {
  BookOpen,
  Search,
  Truck,
  LayoutGrid,
  ChevronDown,
} from "lucide-react";
import { getCurrentProfile } from "@/server/queries/auth";
import { getServerLocale } from "@/lib/i18n/server";
import { LanguageSwitcher } from "./language-switcher";
import { UserNav } from "./user-nav";
import { HeaderCartButton } from "./header-cart-button";
import { HeaderWishlistButton } from "./header-wishlist-button";

export function HeaderFallback() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold tracking-tight text-emerald-800"
        >
          <BookOpen className="h-6 w-6 text-emerald-700" />
          <span>RTDS Bookshop</span>
        </Link>
        <div className="bg-slate-100 h-9 w-48 animate-pulse rounded-full" />
      </div>
    </header>
  );
}

export async function Header() {
  const [{ profile }, locale] = await Promise.all([
    getCurrentProfile(),
    getServerLocale(),
  ]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white shadow-xs">
      {/* 1. Main Header Row */}
      <div className="container mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Brand Logo with Open Book Icon */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-3 text-2xl font-black tracking-tight"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200/60 shadow-xs">
            <BookOpen className="h-6 w-6 text-emerald-800" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
              {locale === "bn" ? "বইঘর" : "RTDS Bookshop"}
            </span>
            <span className="text-[10px] font-semibold tracking-wider text-slate-500 uppercase">
              Read • Learn • Grow
            </span>
          </div>
        </Link>

        {/* Central Search Bar (Pill Search Bar with Ctrl+K shortcut) */}
        <form
          action="/books"
          method="GET"
          className="relative hidden max-w-xl flex-1 items-center md:flex"
        >
          <div className="relative flex w-full items-center rounded-full border border-slate-200 bg-slate-50/60 py-2 pl-11 pr-14 transition-all focus-within:border-emerald-800 focus-within:bg-white focus-within:shadow-xs">
            <Search className="pointer-events-none absolute left-4 h-4 w-4 text-slate-400" />

            <input
              type="text"
              name="q"
              placeholder={
                locale === "bn"
                  ? "বই, লেখক বা প্রকাশনীর নাম দিয়ে খুঁজুন..."
                  : "Search for books, authors, or categories..."
              }
              className="w-full bg-transparent text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none font-medium"
            />

            <kbd className="pointer-events-none absolute right-3 hidden rounded-md border border-slate-200 bg-white px-2 py-0.5 font-mono text-[10px] font-semibold text-slate-400 sm:inline-block shadow-2xs">
              Ctrl + K
            </kbd>
          </div>
        </form>

        {/* Right Actions: Wishlist, Cart, Login / Profile, Language Switcher */}
        <div className="flex shrink-0 items-center gap-2.5 sm:gap-4">
          <HeaderWishlistButton />
          <HeaderCartButton />
          <UserNav profile={profile} />
          <div className="hidden sm:block border-l border-slate-200 pl-2">
            <LanguageSwitcher variant="header" />
          </div>
        </div>
      </div>

      {/* 2. Sub-Nav Bar (Categories & Nav Links) */}
      <div className="border-t border-slate-100 bg-white">
        <div className="container mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-xs sm:px-6 lg:px-8">
          <div className="flex items-center gap-6 overflow-x-auto scrollbar-none py-0.5">
            {/* All Categories Dropdown Button */}
            <Link
              href="/categories"
              className="flex shrink-0 items-center gap-2 rounded-lg bg-[#0c3823] hover:bg-[#124d31] px-3.5 py-2 font-bold text-white shadow-xs transition-colors"
            >
              <LayoutGrid className="h-4 w-4" />
              <span>{locale === "bn" ? "সকল বিভাগ" : "All Categories"}</span>
              <ChevronDown className="h-3.5 w-3.5 opacity-80" />
            </Link>

            {/* Navigation Links */}
            <nav className="flex items-center gap-6 font-semibold text-slate-600 shrink-0">
              <Link
                href="/"
                className="text-emerald-800 font-bold hover:text-emerald-950 transition-colors"
              >
                {locale === "bn" ? "হোম" : "Home"}
              </Link>
              <Link
                href="/books"
                className="hover:text-emerald-800 transition-colors"
              >
                {locale === "bn" ? "আমাদের প্রকাশনা" : "Our Publication"}
              </Link>
              <Link
                href="/vendors"
                className="hover:text-emerald-800 transition-colors"
              >
                {locale === "bn" ? "সেলারগণ" : "Sellers"}
              </Link>
              <Link
                href="/books?offer=true"
                className="hover:text-emerald-800 transition-colors"
              >
                {locale === "bn" ? "অফার সমূহ" : "Offers"}
              </Link>
              <Link
                href="/categories"
                className="hover:text-emerald-800 transition-colors"
              >
                {locale === "bn" ? "আমাদের সম্পর্কে" : "About Us"}
              </Link>
              <Link
                href="/buyer/orders"
                className="hover:text-emerald-800 transition-colors"
              >
                {locale === "bn" ? "যোগাযোগ" : "Contact"}
              </Link>
            </nav>
          </div>

          {/* Free Delivery Right Notice */}
          <div className="hidden lg:flex items-center gap-1.5 font-bold text-slate-800 text-[11px] shrink-0 bg-slate-50 border border-slate-200/60 rounded-full px-3 py-1">
            <Truck className="h-3.5 w-3.5 text-emerald-700" />
            <span>
              {locale === "bn" ? "ফ্রি ডেলিভারি ৳৩৯৯+" : "Free Delivery ৳399+"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
