import Link from "next/link";
import {
  Flame,
  GraduationCap,
  Store,
  ArrowRight,
  Sparkles,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HeroBanner } from "@/components/features/home/hero-banner";
import { BookCard } from "@/components/features/books/book-card";
import { getFeaturedBooks } from "@/server/queries/books";
import {
  getActiveHeroSlides,
  getActiveCuratedShelves,
} from "@/server/queries/storefront";
import { getServerLocale, getDictionary } from "@/lib/i18n/server";

export default async function HomePage() {
  const [books, slides, shelves, locale] = await Promise.all([
    getFeaturedBooks(),
    getActiveHeroSlides(),
    getActiveCuratedShelves(),
    getServerLocale(),
  ]);

  const t = getDictionary(locale);

  // Categorized slices for curated shelves
  const bestsellers = books.slice(0, 4);
  const admissionSpecial = books.filter(
    (b) =>
      b.title.includes("RTDS") ||
      b.title.includes("Data-Intensive") ||
      b.title.includes("SICP") ||
      b.title.includes("Physics") ||
      b.title.includes("Biology")
  );
  const literatureRare = books.filter(
    (b) =>
      b.title.includes("লালসালু") ||
      b.title.includes("Dune") ||
      b.title.includes("Meditations") ||
      b.title.includes("Solitude") ||
      b.title.includes("Neuromancer")
  );

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-14 px-4 py-8 sm:px-6 lg:px-8">
      {/* 1. Hero Promotional Banner & Trust Bar */}
      <HeroBanner slides={slides} locale={locale} />

      {/* 2. Trending Bestsellers Shelf */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-emerald-100 pb-3.5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100/80 text-emerald-700 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.04)]">
              <Flame className="h-5 w-5 fill-emerald-600 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
                {t.shelves.trendingTitle}
              </h2>
              <p className="text-xs text-slate-500">
                {t.shelves.trendingSubtitle}
              </p>
            </div>
          </div>

          <Link href="/books">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 text-xs font-bold text-emerald-700 hover:bg-emerald-50 hover:text-emerald-900"
            >
              <span>{t.common.viewAll}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
          {bestsellers.map((book) => (
            <BookCard key={book.id} book={book} locale={locale} />
          ))}
        </div>
      </section>

      {/* 3. RTDS Academic & Admission Shelf (Neomorphic High-Yield Card) */}
      <section className="space-y-6 rounded-3xl border border-emerald-200/60 bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-white/80 p-6 shadow-[6px_10px_24px_rgba(5,150,105,0.06)] backdrop-blur-md sm:p-8">
        <div className="flex items-center justify-between border-b border-emerald-200/60 pb-3.5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-[2px_4px_10px_rgba(5,150,105,0.3)]">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
                  {t.shelves.admissionTitle}
                </h2>
                <Badge className="bg-emerald-600 px-2 py-0.5 text-[10px] font-bold text-white uppercase shadow-xs">
                  {t.shelves.admissionBadge}
                </Badge>
              </div>
              <p className="text-xs text-slate-500">
                {t.shelves.admissionSubtitle}
              </p>
            </div>
          </div>

          <Link href="/books?category=academic">
            <button
              type="button"
              className="neo-button-green flex h-9 items-center gap-1.5 rounded-xl px-4 text-xs font-bold"
            >
              <span>{t.shelves.viewAllSeries}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
          {(admissionSpecial.length > 0
            ? admissionSpecial
            : books.slice(0, 4)
          ).map((book) => (
            <BookCard key={book.id} book={book} locale={locale} />
          ))}
        </div>
      </section>

      {/* 4. Literature, Classics & Rare Books Shelf */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-emerald-100 pb-3.5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100/80 text-emerald-700 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.04)]">
              <Sparkles className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
                {t.shelves.literatureTitle}
              </h2>
              <p className="text-xs text-slate-500">
                {t.shelves.literatureSubtitle}
              </p>
            </div>
          </div>

          <Link href="/books?category=rare">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 text-xs font-bold text-emerald-700 hover:bg-emerald-50 hover:text-emerald-900"
            >
              <span>{t.shelves.viewAllClassics}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
          {(literatureRare.length > 0 ? literatureRare : books.slice(4, 8)).map(
            (book) => (
              <BookCard key={book.id} book={book} locale={locale} />
            )
          )}
        </div>
      </section>

      {/* 5. Featured Independent Bookshops & Publishers Showcase */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-emerald-100 pb-3.5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100/80 text-emerald-700 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.04)]">
              <Store className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
                {t.shelves.bookshopsTitle}
              </h2>
              <p className="text-xs text-slate-500">
                {t.shelves.bookshopsSubtitle}
              </p>
            </div>
          </div>

          <Link href="/vendors">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 text-xs font-bold text-emerald-800 hover:bg-emerald-50"
            >
              <span>{t.shelves.viewAllShops}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {/* Vendor 1 */}
          <div className="neo-card neo-card-hover space-y-4 p-6">
            <div className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-lg font-black text-white shadow-md">
                RT
              </div>
              <Badge className="bg-emerald-600 text-[10px] font-bold text-white shadow-xs">
                {t.shelves.depotBadge}
              </Badge>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                RTDS Publications Central Depot
              </h3>
              <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                {locale === "bn"
                  ? "RTDS প্ল্যাটফর্মের অফিসিয়াল প্রকাশনা ও মেডিকেল মাস্টার সিরিজের কেন্দ্রীয় সরবরাহ কেন্দ্র।"
                  : "Official publication depot for RTDS Platform medical master series and engineering admission guides."}
              </p>
            </div>
            <div className="flex items-center justify-between border-t border-emerald-100/60 pt-2.5 text-xs">
              <span className="text-slate-500">150+ {t.shelves.booksAvailable}</span>
              <Link
                href="/vendors/rtds-publications-depot"
                className="font-bold text-emerald-700 hover:underline"
              >
                {t.shelves.visitShop}
              </Link>
            </div>
          </div>

          {/* Vendor 2 */}
          <div className="neo-card neo-card-hover space-y-4 p-6">
            <div className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-700 to-green-800 text-lg font-black text-white shadow-md">
                BB
              </div>
              <Badge className="bg-teal-700 text-[10px] font-bold text-white shadow-xs">
                {t.shelves.heritageBadge}
              </Badge>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Banglabazar Boi Bhaban
              </h3>
              <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                {locale === "bn"
                  ? "বাংলাবাজারের ঐতিহ্যবাহী প্রকাশনা, ধ্রুপদী সাহিত্য, ইতিহাস ও আন্তর্জাতিক অনুবাদের বিশাল সংগ্রহশালা।"
                  : "Heritage Banglabazar bookstore featuring classic Bengali novels, historical chronicles, and international translations."}
              </p>
            </div>
            <div className="flex items-center justify-between border-t border-emerald-100/60 pt-2.5 text-xs">
              <span className="text-slate-500">300+ {t.shelves.booksAvailable}</span>
              <Link
                href="/vendors/banglabazar-boi-bhaban"
                className="font-bold text-emerald-700 hover:underline"
              >
                {t.shelves.visitShop}
              </Link>
            </div>
          </div>

          {/* Vendor 3 */}
          <div className="neo-card neo-card-hover space-y-4 p-6">
            <div className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-700 to-emerald-900 text-lg font-black text-white shadow-md">
                NE
              </div>
              <Badge className="bg-emerald-600 text-[10px] font-bold text-white shadow-xs">
                {t.shelves.curatedBadge}
              </Badge>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Nilkhet Engineering Corner
              </h3>
              <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                {locale === "bn"
                  ? "নীলক্ষেত বুক মার্কেট থেকে কম্পিউটার সায়েন্স, ইলেকট্রিক্যাল ও ভার্সিটি টেক্সটবইয়ের নির্ভরযোগ্য শপ।"
                  : "Curated Nilkhet academic outlet for computer science, electrical engineering, and university textbooks."}
              </p>
            </div>
            <div className="flex items-center justify-between border-t border-emerald-100/60 pt-2.5 text-xs">
              <span className="text-slate-500">220+ {t.shelves.booksAvailable}</span>
              <Link
                href="/vendors/nilkhet-engineering-corner"
                className="font-bold text-emerald-700 hover:underline"
              >
                {t.shelves.visitShop}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Genre & Subject Exploration Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-emerald-100 pb-3.5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100/80 text-emerald-700 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.04)]">
              <Layers className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
                {t.shelves.subjectBrowseTitle}
              </h2>
              <p className="text-xs text-slate-500">
                {t.shelves.subjectBrowseSubtitle}
              </p>
            </div>
          </div>

          <Link href="/categories">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 text-xs font-bold text-emerald-800 hover:bg-emerald-50"
            >
              <span>{t.shelves.viewAllSubjects}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-6">
          {[
            {
              name: t.subjects.medical,
              slug: "medical-engineering-admission",
              icon: "🩺",
              count: "150+ Books",
            },
            {
              name: t.subjects.fiction,
              slug: "fiction-literature",
              icon: "📖",
              count: "450+ Books",
            },
            {
              name: t.subjects.computerScience,
              slug: "computer-science-engineering",
              icon: "💻",
              count: "120+ Books",
            },
            {
              name: t.subjects.history,
              slug: "history-heritage",
              icon: "🏛️",
              count: "95+ Books",
            },
            {
              name: t.subjects.islamic,
              slug: "islamic-theological",
              icon: "🕌",
              count: "180+ Books",
            },
            {
              name: t.subjects.classics,
              slug: "philosophy-society",
              icon: "✨",
              count: "70+ Books",
            },
          ].map((cat) => (
            <Link
              key={cat.slug}
              href={`/categories/${cat.slug}`}
              className="neo-card neo-card-hover group flex flex-col items-center justify-center p-5 text-center"
            >
              <span className="mb-2 text-2xl transition-transform duration-200 group-hover:scale-115">
                {cat.icon}
              </span>
              <h4 className="text-xs font-bold text-slate-800 transition-colors group-hover:text-emerald-700">
                {cat.name}
              </h4>
              <span className="mt-0.5 text-[10px] text-slate-400">
                {cat.count}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
