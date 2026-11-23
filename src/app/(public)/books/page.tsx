import { Suspense } from "react";
import Link from "next/link";
import { Metadata } from "next";
import { BookOpen, ChevronRight, BookDashed } from "lucide-react";
import { getServerLocale, getDictionary } from "@/lib/i18n/server";
import { searchBooks } from "@/server/queries/books";
import { getCategories } from "@/server/queries/vendor";
import { getApprovedVendors } from "@/server/queries/vendors";
import { BookCard } from "@/components/features/books/book-card";
import { CatalogFilters } from "@/components/features/catalog/catalog-filters";
import { CatalogSort } from "@/components/features/catalog/catalog-sort";
import { CatalogPagination } from "@/components/features/catalog/catalog-pagination";
import { CatalogActiveFilters } from "@/components/features/catalog/catalog-active-filters";

export const metadata: Metadata = {
  title: "Book Catalog & Omnisearch | RTDS Bookshop",
  description:
    "Explore authentic medical, engineering, university admission guides, academic textbooks, and literature in Bangladesh on RTDS Bookshop.",
};

interface BooksPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function BooksPage({ searchParams }: BooksPageProps) {
  const resolvedParams = await searchParams;
  const locale = await getServerLocale();
  const dict = getDictionary(locale);

  const q = typeof resolvedParams.q === "string" ? resolvedParams.q : undefined;
  const category =
    typeof resolvedParams.category === "string"
      ? resolvedParams.category
      : undefined;
  const condition =
    typeof resolvedParams.condition === "string"
      ? resolvedParams.condition
      : undefined;
  const vendor =
    typeof resolvedParams.vendor === "string"
      ? resolvedParams.vendor
      : undefined;
  const sort =
    typeof resolvedParams.sort === "string" ? resolvedParams.sort : undefined;
  const minPrice =
    typeof resolvedParams.minPrice === "string"
      ? Number(resolvedParams.minPrice)
      : undefined;
  const maxPrice =
    typeof resolvedParams.maxPrice === "string"
      ? Number(resolvedParams.maxPrice)
      : undefined;
  const page =
    typeof resolvedParams.page === "string"
      ? Math.max(1, Number(resolvedParams.page))
      : 1;

  const [searchResult, categories, vendors] = await Promise.all([
    searchBooks({
      q,
      category,
      condition,
      vendor,
      sort,
      minPrice,
      maxPrice,
      page,
      pageSize: 12,
    }),
    getCategories(),
    getApprovedVendors(),
  ]);

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16">
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
              {dict.catalog.title}
            </span>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
        {/* Page Banner Header */}
        <div className="rounded-xl border border-stone-200/80 bg-white p-6 sm:p-7 relative overflow-hidden">
          <div className="max-w-2xl relative z-10 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-50 border border-emerald-200/60 text-emerald-800 text-xs font-medium">
              <BookOpen className="h-3.5 w-3.5 text-emerald-700" />
              <span>RTDS Platform Verified Catalog</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight">
              {dict.catalog.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
              {dict.catalog.subtitle}
            </p>
          </div>
        </div>

        {/* Catalog Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* Faceted Sidebar (Desktop & Mobile Drawer) */}
          <div className="lg:col-span-1">
            <Suspense
              fallback={
                <div className="neo-card p-6 rounded-2xl animate-pulse h-96" />
              }
            >
              <CatalogFilters
                categories={categories}
                vendors={vendors}
                dict={dict}
                locale={locale}
              />
            </Suspense>
          </div>

          {/* Catalog Books Grid & Toolbar */}
          <div className="lg:col-span-3 space-y-4">
            {/* Top Toolbar: Active Filters & Sort */}
            <div className="neo-card p-4 rounded-2xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <Suspense fallback={<div className="h-8" />}>
                <CatalogActiveFilters
                  categories={categories}
                  vendors={vendors}
                  dict={dict}
                  locale={locale}
                  total={searchResult.total}
                />
              </Suspense>

              <Suspense fallback={<div className="h-8 w-32" />}>
                <CatalogSort dict={dict} />
              </Suspense>
            </div>

            {/* Book Cards Grid */}
            {searchResult.books.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-4">
                {searchResult.books.map((book) => (
                  <BookCard key={book.id} book={book} locale={locale} />
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="neo-card p-12 rounded-2xl text-center space-y-4 border border-emerald-950/5">
                <BookDashed className="h-12 w-12 text-slate-400 mx-auto" />
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-800">
                    {dict.catalog.noBooksFound}
                  </h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Try clearing some filters or searching with a different
                    keyword.
                  </p>
                </div>
                <Link
                  href="/books"
                  className="neo-button-green inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl"
                >
                  {dict.catalog.resetFilters}
                </Link>
              </div>
            )}

            {/* Pagination Controls */}
            <Suspense fallback={null}>
              <CatalogPagination
                page={searchResult.page}
                totalPages={searchResult.totalPages}
                dict={dict}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
