import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HeroBanner } from "@/components/features/home/hero-banner";
import { CategoryChips } from "@/components/features/home/category-chips";
import { PublicationShowcase } from "@/components/features/home/publication-showcase";
import { VendorShowcase } from "@/components/features/home/vendor-showcase";
import { FlashSaleCountdown } from "@/components/features/home/flash-sale-countdown";
import { NewsletterBar } from "@/components/features/home/newsletter-bar";
import { BookCard } from "@/components/features/books/book-card";
import { getFeaturedBooks } from "@/server/queries/books";
import { getServerLocale } from "@/lib/i18n/server";

export default async function HomePage() {
  const [books, locale] = await Promise.all([
    getFeaturedBooks(),
    getServerLocale(),
  ]);

  // Take 6 books for the Bestsellers grid (matches the 6 books shown in reference image)
  const bestsellers = books.slice(0, 6);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-6 sm:px-6 lg:px-8">
      {/* 1. Hero Promotional Banner */}
      <HeroBanner />

      {/* 2. Category Chips Section ("বিভাগ সমূহ") */}
      <CategoryChips />

      {/* 3. Bestseller Books Section ("বেস্টসেলার বই 🔥") */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 flex items-center gap-1.5">
              <span>{locale === "bn" ? "বেস্টসেলার বই" : "Bestseller Books"}</span>
              <span className="text-base">🔥</span>
            </h2>
            <p className="text-xs text-slate-500">
              {locale === "bn"
                ? "সবার বেশি পছন্দের বইগুলো এক নজরে"
                : "Top recommended & bestselling titles nationwide"}
            </p>
          </div>

          <Link
            href="/books"
            className="inline-flex items-center gap-1.5 rounded-full bg-[#0c3823] hover:bg-[#124d31] px-4 py-1.5 text-xs font-bold text-white shadow-xs transition-all"
          >
            <span>{locale === "bn" ? "সব দেখুন" : "View All"}</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {bestsellers.map((book) => (
            <BookCard key={book.id} book={book} locale={locale} />
          ))}
        </div>
      </section>

      {/* 4. Publication Showcase Banner ("আমাদের প্রকাশনা") */}
      <PublicationShowcase />

      {/* 5. Popular Sellers Showcase ("আমাদের সেলারদের জনপ্রিয় বই") */}
      <VendorShowcase />

      {/* 6. Flash Sale & Countdown Ribbon */}
      <FlashSaleCountdown />

      {/* 7. Newsletter Subscription Bar */}
      <NewsletterBar />
    </div>
  );
}
