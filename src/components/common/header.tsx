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
import { Badge } from "@/components/ui/badge";
import { getCurrentProfile } from "@/server/queries/auth";
import { UserNav } from "./user-nav";

export function HeaderFallback() {
  return (
    <header className="bg-background sticky top-0 z-50 w-full border-b shadow-xs">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold tracking-tight text-red-600"
        >
          <BookOpen className="h-6 w-6 text-red-600" />
          <span>RTDS Bookshop</span>
        </Link>
        <div className="bg-muted h-9 w-48 animate-pulse rounded-lg" />
      </div>
    </header>
  );
}

export async function Header() {
  const { profile } = await getCurrentProfile();

  return (
    <header className="bg-background/98 sticky top-0 z-50 w-full border-b shadow-2xs backdrop-blur">
      {/* 1. Top Announcement Bar (Bangladeshi Helpline & Delivery Info) */}
      <div className="border-b border-slate-800 bg-slate-900 px-4 py-1.5 text-xs text-slate-200">
        <div className="container mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1.5 font-medium">
              <PhoneCall className="h-3 w-3 text-red-400" />
              <span>হেল্পলাইন: ০৯৬১২-০০৭৮৩৭ (সকাল ৯টা - রাত ১০টা)</span>
            </span>
            <span className="hidden text-slate-500 sm:inline-block">|</span>
            <span className="hidden font-medium text-amber-300 sm:inline-block">
              ⚡ সারা দেশে ক্যাশ অন ডেলিভারি | ৳১,০০০ টাকার অর্ডারে ফ্রি
              ডেলিভারি
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            <Link
              href="/vendor/apply"
              className="flex items-center gap-1 font-medium text-amber-300 transition-colors hover:text-white"
            >
              <Store className="h-3 w-3" />
              <span>বই বিক্রি করুন (ভেন্ডর হোন)</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Main Header with RTDS Omnisearch */}
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 text-2xl font-black tracking-tight text-red-600"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-600 text-white shadow-md">
            <BookOpen className="h-5 w-5" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-foreground text-xl font-black">
              RTDS <span className="text-red-600">Bookshop</span>
            </span>
            <span className="text-muted-foreground text-[10px] font-medium tracking-normal">
              Official Book Marketplace
            </span>
          </div>
        </Link>

        {/* Central Search Bar */}
        <form
          action="/books"
          method="GET"
          className="relative hidden max-w-2xl flex-1 items-center md:flex"
        >
          <div className="bg-muted/20 focus-within:bg-background relative flex w-full items-center rounded-xl border-2 border-red-600/30 transition-all focus-within:border-red-600">
            <select
              name="category"
              className="text-muted-foreground border-border max-w-[140px] cursor-pointer truncate border-r bg-transparent px-3 py-2 text-xs font-semibold focus:outline-none"
            >
              <option value="">সকল ক্যাটাগরি</option>
              <option value="medical">মেডিকেল ভর্তি প্রস্তুতি</option>
              <option value="engineering">ইঞ্জিনিয়ারিং ও ভার্সিটি</option>
              <option value="academic">এইচএসসি ও এসএসসি</option>
              <option value="fiction">সাহিত্য ও উপন্যাস</option>
              <option value="islamic">ইসলামি সাহিত্য</option>
              <option value="rare">দুষ্প্রাপ্য ও পুরাতন বই</option>
            </select>

            <input
              type="text"
              name="q"
              placeholder="বইয়ের নাম, লেখক বা বিষয় দিয়ে অনুসন্ধান করুন... (Search books, authors, ISBNs)"
              className="text-foreground placeholder:text-muted-foreground/70 w-full bg-transparent px-3 py-2 text-xs focus:outline-none sm:text-sm"
            />

            <Button
              type="submit"
              size="sm"
              className="m-1 h-8 shrink-0 gap-1.5 rounded-lg bg-red-600 px-4 font-medium text-white shadow-sm hover:bg-red-700"
            >
              <Search className="h-4 w-4" />
              <span className="hidden text-xs lg:inline">অনুসন্ধান</span>
            </Button>
          </div>
        </form>

        {/* Right User Actions */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <Link href="/buyer/wishlist" className="hidden sm:inline-flex">
            <Button variant="ghost" size="sm" className="relative p-2.5">
              <Heart className="text-muted-foreground h-4 w-4 transition-colors hover:text-red-600" />
              <span className="sr-only">Wishlist</span>
            </Button>
          </Link>

          <Link href="/cart">
            <Button
              variant="outline"
              size="sm"
              className="border-primary/20 relative h-9 gap-2 px-3 font-semibold hover:border-red-600"
            >
              <ShoppingBag className="h-4 w-4 text-red-600" />
              <span className="text-foreground hidden text-xs font-bold sm:inline">
                কার্ট (Cart)
              </span>
              <Badge className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-600 px-1.5 py-0 text-[10px] font-bold text-white">
                0
              </Badge>
            </Button>
          </Link>

          <UserNav profile={profile} />
        </div>
      </div>

      {/* 3. Category Strip (RTDS Mega-Shelf) */}
      <div className="bg-muted/40 hidden border-t sm:block">
        <div className="text-muted-foreground container mx-auto flex max-w-7xl scrollbar-none items-center gap-6 overflow-x-auto px-4 py-2 text-xs font-semibold sm:px-6 lg:px-8">
          <Link
            href="/categories"
            className="text-foreground flex shrink-0 items-center gap-1.5 font-bold hover:text-red-600"
          >
            <Menu className="h-3.5 w-3.5 text-red-600" />
            <span>সকল বই (All Categories)</span>
          </Link>

          <span className="text-border">|</span>

          <Link
            href="/books?category=medical"
            className="shrink-0 font-bold text-red-600 transition-colors hover:text-red-600"
          >
            🩺 মেডিকেল ভর্তি প্রস্তুতি (RTDS Medical)
          </Link>

          <Link
            href="/books?category=engineering"
            className="shrink-0 transition-colors hover:text-red-600"
          >
            📐 ইঞ্জিনিয়ারিং ও ভার্সিটি
          </Link>

          <Link
            href="/books?category=fiction"
            className="shrink-0 transition-colors hover:text-red-600"
          >
            উপন্যাস ও সাহিত্য (Fiction)
          </Link>

          <Link
            href="/books?category=non-fiction"
            className="shrink-0 transition-colors hover:text-red-600"
          >
            ইতিহাস ও দর্শন (Non-Fiction)
          </Link>

          <Link
            href="/books?category=islamic"
            className="shrink-0 transition-colors hover:text-red-600"
          >
            ইসলামি বই (Islamic Books)
          </Link>

          <Link
            href="/books?category=rare"
            className="shrink-0 transition-colors hover:text-red-600"
          >
            দুষ্প্রাপ্য ও পুরাতন বই (Rare Books)
          </Link>

          <Link
            href="/vendors"
            className="text-foreground ml-auto shrink-0 font-bold transition-colors hover:text-red-600"
          >
            🏪 অনুমোদিত বুকশপ ও প্রকাশনী
          </Link>
        </div>
      </div>
    </header>
  );
}
