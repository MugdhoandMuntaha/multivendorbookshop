import Link from "next/link";
import { Metadata } from "next";
import {
  ChevronRight,
  Store,
  Star,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { getServerLocale, getDictionary } from "@/lib/i18n/server";
import { getApprovedVendors } from "@/server/queries/vendors";

export const metadata: Metadata = {
  title: "Verified Booksellers & Publishers | RTDS Bookshop",
  description:
    "Discover verified independent bookstores, Nilkhet suppliers, and official publishers in Bangladesh.",
};

export default async function VendorsDirectoryPage() {
  const locale = await getServerLocale();
  const dict = getDictionary(locale);
  const vendors = await getApprovedVendors();

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20">
      {/* Breadcrumb Strip */}
      <div className="border-b border-emerald-950/5 bg-white/70 backdrop-blur-xs">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <Link
              href="/"
              className="hover:text-emerald-700 transition-colors"
            >
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
            <span className="font-bold text-emerald-800">
              {dict.vendors.title}
            </span>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Banner */}
        <div className="rounded-xl border border-stone-200/80 bg-white p-6 sm:p-7 relative overflow-hidden">
          <div className="max-w-2xl relative z-10 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-50 border border-emerald-200/60 text-emerald-800 text-xs font-medium">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-700" />
              <span>{dict.vendors.verifiedBadge}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight">
              {dict.vendors.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
              {dict.vendors.subtitle}
            </p>
          </div>
        </div>

        {/* Vendors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {vendors.map((vendor) => {
            return (
              <div
                key={vendor.id}
                className="rounded-xl border border-stone-200/80 bg-white p-5 flex flex-col justify-between group space-y-4 hover:border-stone-300 transition-colors shadow-2xs"
              >
                <div className="space-y-3">
                  {/* Shop Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-stone-100 text-stone-700 border border-stone-200 flex items-center justify-center font-semibold text-sm shrink-0">
                        <Store className="h-5 w-5" />
                      </div>
                      <div>
                        <h2 className="text-sm font-semibold text-slate-900 group-hover:text-emerald-900 transition-colors line-clamp-1">
                          {vendor.shop_name}
                        </h2>
                        <div className="flex items-center gap-1.5 text-xs text-emerald-700 mt-0.5">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                          <span className="font-medium text-[11px]">
                            {dict.vendors.verifiedBadge}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Star Rating Badge */}
                    <div className="rounded-md border border-stone-200 bg-stone-50 px-2 py-0.5 text-xs font-medium flex items-center gap-1 tabular-nums text-stone-700">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <span>{vendor.average_rating || 4.9}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {vendor.description ||
                      "Trusted independent bookstore and academic supplier on RTDS Bookshop."}
                  </p>
                </div>

                {/* Footer Metrics & CTA */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-slate-500 text-[11px] tabular-nums">
                    <BookOpen className="h-3.5 w-3.5 text-emerald-800" />
                    <span>
                      {vendor.book_count || 10} {dict.vendors.booksListed}
                    </span>
                  </div>

                  <Link
                    href={`/vendors/${vendor.slug}`}
                    className="inline-flex items-center gap-1 font-medium text-emerald-900 hover:text-emerald-950 transition-colors"
                  >
                    <span>{dict.vendors.shopNow}</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
