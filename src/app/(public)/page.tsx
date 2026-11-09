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

export default async function HomePage() {
  const books = await getFeaturedBooks();

  // Categorized slices for curated shelves
  const bestsellers = books.slice(0, 4);
  const admissionSpecial = books.filter(
    (b) =>
      b.title.includes("Aspect") ||
      b.title.includes("RTDS") ||
      b.title.includes("Data-Intensive") ||
      b.title.includes("SICP")
  );
  const literatureRare = books.filter(
    (b) =>
      b.title.includes("Dune") ||
      b.title.includes("Gatsby") ||
      b.title.includes("Meditations") ||
      b.title.includes("Solitude") ||
      b.title.includes("Neuromancer")
  );

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-14 px-4 py-8 sm:px-6 lg:px-8">
      {/* 1. Hero Promotional Banner & Trust Bar */}
      <HeroBanner />

      {/* 2. Trending Bestsellers Shelf (Rokomari Bestseller Style) */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600/10 text-red-600">
              <Flame className="h-5 w-5 fill-red-600 text-red-600" />
            </div>
            <div>
              <h2 className="text-foreground text-xl font-black tracking-tight sm:text-2xl">
                সর্বাধিক বিক্রিত বইসমূহ (Trending Bestsellers)
              </h2>
              <p className="text-muted-foreground text-xs">
                Top rated books chosen by thousands of readers across the
                platform
              </p>
            </div>
          </div>

          <Link href="/books">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 text-xs font-bold text-red-600 hover:text-red-700"
            >
              <span>View All</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
          {bestsellers.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>

      {/* 3. Aspect Series & RTDS Live Academic / Admission Shelf */}
      <section className="space-y-6 rounded-3xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 via-red-500/5 to-transparent p-6 shadow-xs sm:p-8">
        <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 font-black text-slate-950">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-foreground text-xl font-black tracking-tight sm:text-2xl">
                  মেডিকেল ও বিশ্ববিদ্যালয় ভর্তি প্রস্তুতি (RTDS & Aspect
                  Series)
                </h2>
                <Badge className="bg-red-600 text-[10px] font-bold text-white uppercase">
                  High Yield
                </Badge>
              </div>
              <p className="text-muted-foreground text-xs">
                Official question banks, full subject bundles, and medical
                practice papers
              </p>
            </div>
          </div>

          <Link href="/books?category=academic">
            <Button
              size="sm"
              className="gap-1 bg-amber-500 text-xs font-bold text-slate-950 shadow-xs hover:bg-amber-600"
            >
              <span>Explore Sets</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
          {(admissionSpecial.length > 0
            ? admissionSpecial
            : books.slice(0, 4)
          ).map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>

      {/* 4. Literature, Classics & Rare Books Shelf */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600/10 text-blue-600">
              <Sparkles className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-foreground text-xl font-black tracking-tight sm:text-2xl">
                সাহিত্য, দর্শন ও দুর্লভ সংগ্রহ (Literature & Rare Collectibles)
              </h2>
              <p className="text-muted-foreground text-xs">
                First edition reproductions, collector clothbound editions, and
                vintage paperbacks
              </p>
            </div>
          </div>

          <Link href="/books?category=rare">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 text-xs font-bold text-blue-600 hover:text-blue-700"
            >
              <span>View All</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
          {(literatureRare.length > 0 ? literatureRare : books.slice(4, 8)).map(
            (book) => (
              <BookCard key={book.id} book={book} />
            )
          )}
        </div>
      </section>

      {/* 5. Featured Independent Bookshops & Publishers Showcase (Multivendor Core) */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600/10 text-emerald-600">
              <Store className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-foreground text-xl font-black tracking-tight sm:text-2xl">
                শীর্ষস্থানীয় স্বাধীন বুকশপসমূহ (Featured Bookshops)
              </h2>
              <p className="text-muted-foreground text-xs">
                Browse dedicated storefronts from vetted publishers and
                antiquarian collectors
              </p>
            </div>
          </div>

          <Link href="/vendors">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 text-xs font-bold"
            >
              <span>All 25+ Bookshops</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {/* Vendor 1 */}
          <div className="bg-card hover:border-primary/40 space-y-4 rounded-2xl border p-6 shadow-xs transition-all hover:shadow-md">
            <div className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-600/10 text-lg font-black text-red-600">
                RT
              </div>
              <Badge className="bg-emerald-600 text-[10px] font-bold text-white">
                Verified Depot
              </Badge>
            </div>
            <div>
              <h3 className="text-foreground text-base font-bold">
                RTDS & Aspect Official Depot
              </h3>
              <p className="text-muted-foreground mt-1 line-clamp-2 text-xs">
                Official medical admission question bank publisher and HSC
                science series repository.
              </p>
            </div>
            <div className="flex items-center justify-between border-t pt-2 text-xs">
              <span className="text-muted-foreground">150+ Titles listed</span>
              <Link
                href="/vendors/rtds-aspect-depot"
                className="font-bold text-red-600 hover:underline"
              >
                Visit Shop →
              </Link>
            </div>
          </div>

          {/* Vendor 2 */}
          <div className="bg-card hover:border-primary/40 space-y-4 rounded-2xl border p-6 shadow-xs transition-all hover:shadow-md">
            <div className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-600/10 text-lg font-black text-amber-600">
                OP
              </div>
              <Badge className="bg-blue-600 text-[10px] font-bold text-white">
                Antiquarian
              </Badge>
            </div>
            <div>
              <h3 className="text-foreground text-base font-bold">
                The Old Paper Mill
              </h3>
              <p className="text-muted-foreground mt-1 line-clamp-2 text-xs">
                Rare first editions, signed literary masterpieces, and restored
                classical folios since 1984.
              </p>
            </div>
            <div className="flex items-center justify-between border-t pt-2 text-xs">
              <span className="text-muted-foreground">85+ Rare Titles</span>
              <Link
                href="/vendors/the-old-paper-mill"
                className="font-bold text-red-600 hover:underline"
              >
                Visit Shop →
              </Link>
            </div>
          </div>

          {/* Vendor 3 */}
          <div className="bg-card hover:border-primary/40 space-y-4 rounded-2xl border p-6 shadow-xs transition-all hover:shadow-md">
            <div className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600/10 text-lg font-black text-indigo-600">
                BH
              </div>
              <Badge className="bg-emerald-600 text-[10px] font-bold text-white">
                Curated Shop
              </Badge>
            </div>
            <div>
              <h3 className="text-foreground text-base font-bold">
                Beacon Hill Bookshop
              </h3>
              <p className="text-muted-foreground mt-1 line-clamp-2 text-xs">
                Curated philosophy, modern literature, architecture, and
                technology monographs.
              </p>
            </div>
            <div className="flex items-center justify-between border-t pt-2 text-xs">
              <span className="text-muted-foreground">320+ Books</span>
              <Link
                href="/vendors/beacon-hill-books"
                className="font-bold text-red-600 hover:underline"
              >
                Visit Shop →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Genre & Subject Exploration Grid (Rokomari Category Style) */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2.5">
            <div className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-lg">
              <Layers className="text-primary h-5 w-5" />
            </div>
            <div>
              <h2 className="text-foreground text-xl font-black tracking-tight sm:text-2xl">
                বিষয়ভিত্তিক বইয়ের বিভাগ (Browse by Subject)
              </h2>
              <p className="text-muted-foreground text-xs">
                Quickly locate books by curriculum, subject, or reading interest
              </p>
            </div>
          </div>

          <Link href="/categories">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 text-xs font-bold"
            >
              <span>All Categories</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {[
            {
              name: "মেডিকেল ও বিসিএস",
              slug: "academic-reference",
              icon: "🩺",
              count: "120+ Books",
            },
            {
              name: "উপন্যাস ও গল্প",
              slug: "fiction",
              icon: "📖",
              count: "450+ Books",
            },
            {
              name: "বিজ্ঞান ও প্রযুক্তি",
              slug: "computer-science-tech",
              icon: "💻",
              count: "80+ Books",
            },
            {
              name: "ইতিহাস ও ঐতিহ্য",
              slug: "history-warfare",
              icon: "🏛️",
              count: "95+ Books",
            },
            {
              name: "দর্শন ও আত্মউন্নয়ন",
              slug: "philosophy-ideas",
              icon: "🧠",
              count: "60+ Books",
            },
            {
              name: "দুর্লভ ও ক্লাসিক",
              slug: "rare-collectibles",
              icon: "✨",
              count: "40+ Books",
            },
          ].map((cat) => (
            <Link
              key={cat.slug}
              href={`/categories/${cat.slug}`}
              className="bg-card group flex flex-col items-center justify-center rounded-2xl border p-4 text-center transition-all hover:border-red-600 hover:shadow-md"
            >
              <span className="mb-2 text-2xl transition-transform group-hover:scale-110">
                {cat.icon}
              </span>
              <h4 className="text-foreground text-xs font-bold transition-colors group-hover:text-red-600">
                {cat.name}
              </h4>
              <span className="text-muted-foreground mt-0.5 text-[10px]">
                {cat.count}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
