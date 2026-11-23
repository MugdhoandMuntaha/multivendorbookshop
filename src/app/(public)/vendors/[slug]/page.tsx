import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import {
  ChevronRight,
  Store,
  Star,
  CheckCircle2,
  BookOpen,
  BookDashed,
} from "lucide-react";
import { getServerLocale, getDictionary } from "@/lib/i18n/server";
import { getVendorBySlug } from "@/server/queries/vendors";
import { searchBooks } from "@/server/queries/books";
import { formatPrice } from "@/lib/utils";
import { BookCard } from "@/components/features/books/book-card";
import { CatalogSort } from "@/components/features/catalog/catalog-sort";
import { CatalogPagination } from "@/components/features/catalog/catalog-pagination";
import { Suspense } from "react";

interface VendorStorefrontPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({
  params,
}: VendorStorefrontPageProps): Promise<Metadata> {
  const { slug } = await params;
  const vendor = await getVendorBySlug(slug);

  if (!vendor) {
    return {
      title: "Bookseller Not Found | RTDS Bookshop",
    };
  }

  return {
    title: `${vendor.shop_name} | Verified Bookseller on RTDS Bookshop`,
    description:
      vendor.description ||
      `Order books directly from ${vendor.shop_name} with fast delivery across Bangladesh.`,
  };
}

export default async function VendorStorefrontPage({
  params,
  searchParams,
}: VendorStorefrontPageProps) {
  const { slug } = await params;
  const resolvedParams = await searchParams;
  const locale = await getServerLocale();
  const dict = getDictionary(locale);

  const vendor = await getVendorBySlug(slug);

  if (!vendor) {
    notFound();
  }

  const sort =
    typeof resolvedParams.sort === "string" ? resolvedParams.sort : undefined;
  const page =
    typeof resolvedParams.page === "string"
      ? Math.max(1, Number(resolvedParams.page))
      : 1;

  const searchResult = await searchBooks({
    vendor: vendor.slug,
    sort,
    page,
    pageSize: 12,
  });

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
            <Link
              href="/vendors"
              className="hover:text-emerald-700 transition-colors"
            >
              Vendors
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
            <span className="font-bold text-emerald-800">
              {vendor.shop_name}
            </span>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Vendor Branded Shop Header */}
        <div className="rounded-xl border border-stone-200/80 bg-white p-6 relative overflow-hidden shadow-2xs">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            {/* Shop Identity */}
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-lg bg-stone-100 text-stone-700 border border-stone-200 flex items-center justify-center shrink-0">
                <Store className="h-6 w-6 stroke-[1.5]" />
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight">
                    {vendor.shop_name}
                  </h1>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200/60 text-xs font-medium text-emerald-800">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    <span>{dict.vendors.verifiedBadge}</span>
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 max-w-2xl font-normal leading-relaxed">
                  {vendor.description ||
                    "Verified bookseller and authorized publisher on the RTDS platform."}
                </p>
              </div>
            </div>

            {/* Shop Key Stats Pills */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0 tabular-nums">
              <div className="rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-center">
                <div className="flex items-center justify-center gap-1 text-amber-500">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-semibold text-slate-800">
                    {vendor.average_rating || 4.9}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 block font-normal mt-0.5">
                  {dict.vendors.rating}
                </span>
              </div>

              <div className="rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-center">
                <span className="text-xs font-semibold text-slate-900 block">
                  {vendor.book_count || searchResult.total}
                </span>
                <span className="text-[10px] text-slate-400 block font-normal mt-0.5">
                  {dict.vendors.booksListed}
                </span>
              </div>

              <div className="rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-center">
                <span className="text-xs font-semibold text-slate-900 block">
                  {formatPrice(vendor.shipping_fee_minor, "BDT")}
                </span>
                <span className="text-[10px] text-slate-400 block font-normal mt-0.5">
                  Flat Courier Rate
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Toolbar: Results Count and Sort */}
        <div className="neo-card p-4 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-emerald-600" />
            <span className="text-xs font-bold text-slate-700">
              {dict.vendors.allShopBooks} ({searchResult.total})
            </span>
          </div>

          <Suspense fallback={<div className="h-8 w-32" />}>
            <CatalogSort dict={dict} />
          </Suspense>
        </div>

        {/* Books Grid */}
        {searchResult.books.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {searchResult.books.map((book) => (
              <BookCard key={book.id} book={book} locale={locale} />
            ))}
          </div>
        ) : (
          <div className="neo-card p-12 rounded-2xl text-center space-y-4">
            <BookDashed className="h-12 w-12 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">
              No books currently available in this store
            </h3>
            <Link
              href="/books"
              className="neo-button-green inline-flex px-4 py-2 text-xs font-bold rounded-xl"
            >
              Explore Other Booksellers
            </Link>
          </div>
        )}

        {/* Pagination */}
        <Suspense fallback={null}>
          <CatalogPagination
            page={searchResult.page}
            totalPages={searchResult.totalPages}
            dict={dict}
          />
        </Suspense>
      </div>
    </div>
  );
}
