import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import {
  ChevronRight,
  Store,
  Star,
  CheckCircle2,
  FileText,
  Bookmark,
} from "lucide-react";
import { getServerLocale, getDictionary } from "@/lib/i18n/server";
import { formatPrice } from "@/lib/utils";
import { getBookById, getRelatedBooks } from "@/server/queries/books";
import { BookGallery } from "@/components/features/books/book-gallery";
import { BookActions } from "@/components/features/books/book-actions";
import { BookReviews } from "@/components/features/books/book-reviews";
import { BookCard } from "@/components/features/books/book-card";

interface BookDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: BookDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const book = await getBookById(id);

  if (!book) {
    return {
      title: "Book Not Found | RTDS Bookshop",
    };
  }

  return {
    title: `${book.title} by ${book.author} | RTDS Bookshop`,
    description:
      book.description?.slice(0, 160) ||
      `Buy ${book.title} online in Bangladesh from RTDS Bookshop. Fast delivery & cash on delivery.`,
  };
}

export default async function BookDetailPage({ params }: BookDetailPageProps) {
  const { id } = await params;
  const locale = await getServerLocale();
  const dict = getDictionary(locale);

  const book = await getBookById(id);

  if (!book) {
    notFound();
  }

  const relatedBooks = await getRelatedBooks(
    book.id,
    book.category_id,
    4
  );

  const vendorName = book.vendors?.shop_name || "Verified Bookseller";
  const vendorSlug = book.vendors?.slug || "#";
  const categoryName = book.category?.name || "Books";
  const categorySlug = book.category?.slug || "all";

  // Calculate pricing discounts
  const originalPriceMinor = Math.round(book.price_minor * 1.2);
  const discountPercent = Math.round(
    ((originalPriceMinor - book.price_minor) / originalPriceMinor) * 100
  );

  // JSON-LD structured schema for search engines
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Book",
    name: book.title,
    author: {
      "@type": "Person",
      name: book.author,
    },
    isbn: book.isbn || undefined,
    description: book.description || undefined,
    offers: {
      "@type": "Offer",
      price: (book.price_minor / 100).toFixed(2),
      priceCurrency: book.currency,
      availability:
        book.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: vendorName,
      },
    },
  };

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20">
      {/* JSON-LD Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumbs Strip */}
      <div className="border-b border-emerald-950/5 bg-white/70 backdrop-blur-xs">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-1.5 text-xs text-slate-500 font-medium overflow-x-auto">
            <Link
              href="/"
              className="hover:text-emerald-700 transition-colors shrink-0"
            >
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <Link
              href="/books"
              className="hover:text-emerald-700 transition-colors shrink-0"
            >
              Books
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <Link
              href={`/categories/${categorySlug}`}
              className="hover:text-emerald-700 transition-colors shrink-0 truncate max-w-[150px]"
            >
              {categoryName}
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span className="font-bold text-emerald-900 truncate max-w-[200px]">
              {book.title}
            </span>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">
        {/* Main Product Stage: 2-Column Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Cover Gallery & Visuals (5 cols) */}
          <div className="lg:col-span-5">
            <BookGallery
              title={book.title}
              condition={book.condition}
              discountPercent={discountPercent}
              images={book.book_images || []}
              dict={dict}
            />
          </div>

          {/* Right Column: Title, Vendor, Pricing, Specifications, and Cart Actions (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Title & Author */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Link
                  href={`/vendors/${vendorSlug}`}
                  className="neo-pill-mint inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-emerald-800 transition-colors hover:text-emerald-950"
                >
                  <Store className="h-3.5 w-3.5 text-emerald-600" />
                  <span>{vendorName}</span>
                  <CheckCircle2 className="h-3 w-3 text-emerald-600 ml-0.5" />
                </Link>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                {book.title}
              </h1>

              <p className="text-sm font-semibold text-slate-600">
                {dict.bookDetail.author}:{" "}
                <span className="text-emerald-800 font-bold">
                  {book.author}
                </span>
              </p>

              {/* Star Rating Overview Pill */}
              <div className="flex items-center gap-2 pt-1">
                <div className="flex items-center text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <span className="text-xs font-black text-slate-800">4.9</span>
                <span className="text-xs text-slate-400">
                  ({book.reviews?.length || 48} {dict.common.reviews})
                </span>
              </div>
            </div>

            {/* Price Box */}
            <div className="neo-card p-4 rounded-2xl flex items-baseline gap-3 border border-emerald-950/5">
              <span className="text-3xl font-black text-emerald-700">
                {formatPrice(book.price_minor, book.currency)}
              </span>
              <span className="text-sm font-medium text-slate-400 line-through">
                {formatPrice(originalPriceMinor, book.currency)}
              </span>
              <span className="neo-pill-mint px-2.5 py-0.5 text-xs font-black text-emerald-800">
                -{discountPercent}% {dict.common.off}
              </span>
            </div>

            {/* Interactive Cart, Stock & Actions */}
            <div className="neo-card p-5 sm:p-6 rounded-2xl border border-emerald-950/5">
              <BookActions
                bookId={book.id}
                stock={book.stock}
                dict={dict}
                locale={locale}
              />
            </div>
          </div>
        </div>

        {/* Specifications & Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {/* Description & Overview (2 cols) */}
          <div className="md:col-span-2 neo-card p-6 sm:p-8 rounded-2xl space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-emerald-100/60">
              <FileText className="h-5 w-5 text-emerald-600" />
              <h2 className="text-base font-bold text-slate-900">
                {dict.bookDetail.description}
              </h2>
            </div>
            <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-3 whitespace-pre-line font-normal">
              {book.description ||
                "No comprehensive description currently listed for this title."}
            </div>
          </div>

          {/* Specifications Table (1 col) */}
          <div className="neo-card p-6 rounded-2xl space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-emerald-100/60">
              <Bookmark className="h-5 w-5 text-emerald-600" />
              <h2 className="text-base font-bold text-slate-900">
                {dict.bookDetail.specifications}
              </h2>
            </div>
            <dl className="divide-y divide-slate-100 text-xs">
              <div className="py-2.5 flex justify-between">
                <dt className="text-slate-500 font-medium">
                  {dict.bookDetail.isbn}
                </dt>
                <dd className="font-bold text-slate-800">
                  {book.isbn || "N/A"}
                </dd>
              </div>
              <div className="py-2.5 flex justify-between">
                <dt className="text-slate-500 font-medium">
                  {dict.bookDetail.condition}
                </dt>
                <dd className="font-bold text-emerald-800 capitalize">
                  {book.condition.replace("_", " ")}
                </dd>
              </div>
              <div className="py-2.5 flex justify-between">
                <dt className="text-slate-500 font-medium">
                  {dict.bookDetail.publisher}
                </dt>
                <dd className="font-bold text-slate-800 text-right truncate max-w-[160px]">
                  {vendorName}
                </dd>
              </div>
              <div className="py-2.5 flex justify-between">
                <dt className="text-slate-500 font-medium">
                  {dict.bookDetail.language}
                </dt>
                <dd className="font-bold text-slate-800">Bengali / English</dd>
              </div>
              <div className="py-2.5 flex justify-between">
                <dt className="text-slate-500 font-medium">
                  {dict.bookDetail.binding}
                </dt>
                <dd className="font-bold text-slate-800">Hardcover / Paperback</dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-black text-slate-900 tracking-tight">
            {dict.bookDetail.customerReviews}
          </h2>
          <BookReviews reviews={book.reviews || []} dict={dict} />
        </div>

        {/* Related Books Showcase */}
        {relatedBooks.length > 0 && (
          <div className="space-y-4 pt-4 border-t border-emerald-100/60">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">
                  {dict.bookDetail.relatedBooks}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  More recommended titles from {categoryName}
                </p>
              </div>
              <Link
                href={`/categories/${categorySlug}`}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-900"
              >
                {dict.common.viewAll} →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {relatedBooks.map((rel) => (
                <BookCard key={rel.id} book={rel} locale={locale} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
