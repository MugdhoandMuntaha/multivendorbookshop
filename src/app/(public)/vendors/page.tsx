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
        <div className="neo-card p-6 sm:p-8 rounded-2xl relative overflow-hidden">
          <div className="max-w-2xl relative z-10 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black tracking-wide uppercase">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-700" />
              <span>{dict.vendors.verifiedBadge}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {dict.vendors.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
              {dict.vendors.subtitle}
            </p>
          </div>
        </div>

        {/* Vendors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vendors.map((vendor) => {
            return (
              <div
                key={vendor.id}
                className="neo-card neo-card-hover p-6 rounded-2xl flex flex-col justify-between group space-y-5"
              >
                <div className="space-y-4">
                  {/* Shop Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-base shadow-inner shrink-0">
                        <Store className="h-6 w-6" />
                      </div>
                      <div>
                        <h2 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
                          {vendor.shop_name}
                        </h2>
                        <div className="flex items-center gap-1.5 text-xs text-emerald-700 mt-0.5">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                          <span className="font-semibold text-[11px]">
                            {dict.vendors.verifiedBadge}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Star Rating Badge */}
                    <div className="neo-pill-mint px-2 py-1 text-[11px] font-black flex items-center gap-1">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <span>{vendor.average_rating || 4.9}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {vendor.description ||
                      "Trusted independent bookstore and academic supplier on RTDS Bookshop."}
                  </p>
                </div>

                {/* Footer Metrics & CTA */}
                <div className="pt-4 border-t border-emerald-100/60 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-slate-600 font-semibold text-[11px]">
                    <BookOpen className="h-3.5 w-3.5 text-emerald-600" />
                    <span>
                      {vendor.book_count || 10} {dict.vendors.booksListed}
                    </span>
                  </div>

                  <Link
                    href={`/vendors/${vendor.slug}`}
                    className="neo-button-green flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl"
                  >
                    <span>{dict.vendors.shopNow}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
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
