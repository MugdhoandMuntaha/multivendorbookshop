import Link from "next/link";
import {
  BookOpen,
  ShieldCheck,
  PhoneCall,
  Mail,
  MapPin,
  Truck,
  CreditCard,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-slate-900 py-12 text-sm text-slate-300">
      <div className="container mx-auto max-w-7xl space-y-10 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand Info & Hotline */}
          <div className="space-y-4 lg:col-span-2">
            <Link
              href="/"
              className="flex items-center gap-2 text-xl font-black text-white"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600 text-white">
                <BookOpen className="h-5 w-5" />
              </div>
              <span>
                Book<span className="text-red-500">Market</span>
              </span>
            </Link>
            <p className="max-w-sm text-xs leading-relaxed text-slate-400">
              The premier multivendor book platform in Bangladesh bringing
              together independent bookshops, medical publishers (RTDS, Aspect
              Series), rare collectors, and nationwide readers in one unified
              marketplace.
            </p>

            <div className="space-y-2 pt-2 text-xs">
              <div className="flex items-center gap-2.5 text-slate-300">
                <PhoneCall className="h-4 w-4 shrink-0 text-red-500" />
                <span className="font-semibold">
                  09612-000000 / 01700-000000 (9 AM - 10 PM)
                </span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-300">
                <Mail className="h-4 w-4 shrink-0 text-red-500" />
                <span>support@bookmarket.com.bd</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-300">
                <MapPin className="h-4 w-4 shrink-0 text-red-500" />
                <span>Banglabazar / Nilkhet Book Hub, Dhaka, Bangladesh</span>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="mb-3 text-xs font-bold tracking-wider text-white uppercase">
              বইয়ের বিভাগসমূহ (Categories)
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link
                  href="/books?category=academic"
                  className="transition-colors hover:text-white"
                >
                  মেডিকেল ও বিসিএস প্রস্তুতি
                </Link>
              </li>
              <li>
                <Link
                  href="/books?category=medical"
                  className="transition-colors hover:text-white"
                >
                  Aspect Series & RTDS Books
                </Link>
              </li>
              <li>
                <Link
                  href="/books?category=fiction"
                  className="transition-colors hover:text-white"
                >
                  উপন্যাস ও গল্প সমগ্র
                </Link>
              </li>
              <li>
                <Link
                  href="/books?category=non-fiction"
                  className="transition-colors hover:text-white"
                >
                  বিজ্ঞান, প্রযুক্তি ও ইতিহাস
                </Link>
              </li>
              <li>
                <Link
                  href="/books?category=rare"
                  className="transition-colors hover:text-white"
                >
                  দুর্লভ ও আউট অব প্রিন্ট বই
                </Link>
              </li>
            </ul>
          </div>

          {/* Vendors & Publishers */}
          <div>
            <h4 className="mb-3 text-xs font-bold tracking-wider text-white uppercase">
              ভেন্ডর ও প্রকাশনী (Publishers)
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link
                  href="/vendors"
                  className="transition-colors hover:text-white"
                >
                  সকল ভেন্ডর স্টোরফ্রন্ট
                </Link>
              </li>
              <li>
                <Link
                  href="/vendor/apply"
                  className="font-semibold text-amber-400 transition-colors hover:text-white"
                >
                  বই বিক্রয় করুন (Apply to Sell)
                </Link>
              </li>
              <li>
                <Link
                  href="/vendor/dashboard"
                  className="transition-colors hover:text-white"
                >
                  ভেন্ডর পোর্টাল লগইন
                </Link>
              </li>
              <li>
                <Link
                  href="/buyer/orders"
                  className="transition-colors hover:text-white"
                >
                  অর্ডার ট্র্যাকিং (Track Order)
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust & Guarantee */}
          <div>
            <h4 className="mb-3 text-xs font-bold tracking-wider text-white uppercase">
              নিরাপত্তা ও ডেলিভারি (Policies)
            </h4>
            <div className="space-y-3 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <Truck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                <span>সারাদেশে ৬৪ জেলায় দ্রুত ক্যাশ অন ডেলিভারি</span>
              </div>
              <div className="flex items-start gap-2">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                <span>১০০% আসল ও পাইরেসি-মুক্ত বইয়ের নিশ্চয়তা</span>
              </div>
              <div className="flex items-start gap-2">
                <CreditCard className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                <span>বিকাশ, নগদ ও ব্যাংকিং কার্ড সাপোর্ট</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-6 text-xs text-slate-500 sm:flex-row">
          <p>
            © 2026 BookMarket Platform. All rights reserved. Inspired by
            Rokomari, Aspect Series & RTDS Live.
          </p>
          <div className="flex items-center gap-4">
            <span>Unified Multi-Vendor Cart</span>
            <span>•</span>
            <span>Cloudflare R2 Object Storage</span>
            <span>•</span>
            <span>Supabase SSR Engine</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
