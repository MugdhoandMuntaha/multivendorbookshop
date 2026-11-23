import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import {
  ChevronRight,
  BookOpen,
  GraduationCap,
  Cpu,
  Rocket,
  Lightbulb,
  Landmark,
  Compass,
  TrendingUp,
  BookDashed,
} from "lucide-react";
import { getServerLocale, getDictionary } from "@/lib/i18n/server";
import {
  getCategoryBySlug,
  getAllCategoriesWithCounts,
  CATEGORY_METADATA,
} from "@/server/queries/categories";
import { searchBooks } from "@/server/queries/books";
import { BookCard } from "@/components/features/books/book-card";
import { CatalogSort } from "@/components/features/catalog/catalog-sort";
import { CatalogPagination } from "@/components/features/catalog/catalog-pagination";
import { Suspense } from "react";

interface CategoryDetailPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const iconMap: Record<string, React.ElementType> = {
  GraduationCap,
  BookOpen,
  Cpu,
  Rocket,
  Lightbulb,
  Landmark,
  Compass,
  TrendingUp,
};

export async function generateMetadata({
  params,
}: CategoryDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return {
      title: "Category Not Found | RTDS Bookshop",
    };
  }

  return {
    title: `${category.name} Books | RTDS Bookshop`,
    description: `Browse books in ${category.name} on RTDS Bookshop. Genuine copies, fast shipping in Bangladesh.`,
  };
}

export default async function CategoryDetailPage({
  params,
  searchParams,
}: CategoryDetailPageProps) {
  const { slug } = await params;
  const resolvedParams = await searchParams;
  const locale = await getServerLocale();
  const dict = getDictionary(locale);

  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const sort =
    typeof resolvedParams.sort === "string" ? resolvedParams.sort : undefined;
  const page =
    typeof resolvedParams.page === "string"
      ? Math.max(1, Number(resolvedParams.page))
      : 1;

  const [searchResult, allCategories] = await Promise.all([
    searchBooks({
      category: category.slug,
      sort,
      page,
      pageSize: 12,
    }),
    getAllCategoriesWithCounts(),
  ]);

  const meta = CATEGORY_METADATA[category.slug];
  const Icon = (meta?.icon_name && iconMap[meta.icon_name]) || BookOpen;

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
              href="/categories"
              className="hover:text-emerald-700 transition-colors"
            >
              Categories
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
            <span className="font-bold text-emerald-800">{category.name}</span>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Category Header Card */}
        <div className="rounded-xl border border-stone-200/80 bg-white p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-2xs">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-stone-100 text-stone-700 border border-stone-200 flex items-center justify-center shrink-0">
              <Icon className="h-6 w-6 stroke-[1.5]" />
            </div>
            <div>
              <div className="inline-flex rounded-md bg-stone-100 text-stone-700 px-2 py-0.5 text-[11px] font-medium mb-1 border border-stone-200">
                Category
              </div>
              <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight">
                {category.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5 max-w-xl font-normal leading-relaxed">
                {meta?.description ||
                  `Explore genuine books under ${category.name} on RTDS Bookshop.`}
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-stone-200 bg-stone-50 px-3.5 py-1.5 flex items-center gap-2 text-xs font-medium text-stone-700 shrink-0 tabular-nums">
            <span>
              {searchResult.total} {dict.categories.booksCount}
            </span>
          </div>
        </div>

        {/* Quick Horizontal Category Pills Strip */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <Link
            href="/books"
            className="neo-button-light px-3.5 py-1.5 text-xs font-bold rounded-xl shrink-0 text-slate-700"
          >
            {dict.common.allCategories}
          </Link>
          {allCategories.map((c) => {
            const isCurrent = c.slug === category.slug;
            return (
              <Link
                key={c.id}
                href={`/categories/${c.slug}`}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-xl shrink-0 transition-all ${
                  isCurrent
                    ? "neo-button-green"
                    : "neo-button-light text-slate-700 hover:text-emerald-800"
                }`}
              >
                {c.name}
              </Link>
            );
          })}
        </div>

        {/* Toolbar: Sorting */}
        <div className="neo-card p-4 rounded-2xl flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700">
            {locale === "bn"
              ? `${searchResult.total} টি বই প্রদর্শন করা হচ্ছে`
              : `Showing ${searchResult.books.length} of ${searchResult.total} books`}
          </span>

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
              No books currently listed under {category.name}
            </h3>
            <Link
              href="/books"
              className="neo-button-green inline-flex px-4 py-2 text-xs font-bold rounded-xl"
            >
              Browse All Books
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
