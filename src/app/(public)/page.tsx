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
      <HeroBanner />

      {/* 2. Trending Bestsellers Shelf */}
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
                দেশজুড়ে হাজারো পাঠকের পছন্দের তালিকায় থাকা সেরা বইসমূহ
              </p>
            </div>
          </div>

          <Link href="/books">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 text-xs font-bold text-red-600 hover:text-red-700"
            >
              <span>সকল বই দেখুন</span>
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

      {/* 3. RTDS Live Academic & Admission Shelf */}
      <section className="space-y-6 rounded-3xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 via-red-500/5 to-transparent p-6 shadow-xs sm:p-8">
        <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 font-black text-slate-950">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-foreground text-xl font-black tracking-tight sm:text-2xl">
                  মেডিকেল ও বিশ্ববিদ্যালয় ভর্তি প্রস্তুতি (RTDS Master Series)
                </h2>
                <Badge className="bg-red-600 text-[10px] font-bold text-white uppercase">
                  Official Guides
                </Badge>
              </div>
              <p className="text-muted-foreground text-xs">
                RTDS অফিসিয়াল প্রশ্নব্যাংক, শর্টকাট টেকনিক ও পূর্ণাঙ্গ মডেল
                টেস্ট পেপার
              </p>
            </div>
          </div>

          <Link href="/books?category=academic">
            <Button
              size="sm"
              className="gap-1 bg-amber-500 text-xs font-bold text-slate-950 shadow-xs hover:bg-amber-600"
            >
              <span>সকল সিরিজ দেখুন</span>
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
                সাহিত্য, দর্শন ও ধ্রুপদী সংগ্রহ (Literature & Classics)
              </h2>
              <p className="text-muted-foreground text-xs">
                ধ্রুপদী বাংলা উপন্যাস, নোবেলজয়ী আন্তর্জাতিক সাহিত্য ও
                সংগ্রাহকদের বিশেষ বাঁধাইকৃত সংস্করণ
              </p>
            </div>
          </div>

          <Link href="/books?category=rare">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 text-xs font-bold text-blue-600 hover:text-blue-700"
            >
              <span>সকল সংগ্রহ</span>
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

      {/* 5. Featured Independent Bookshops & Publishers Showcase */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600/10 text-emerald-600">
              <Store className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-foreground text-xl font-black tracking-tight sm:text-2xl">
                অনুমোদিত প্রকাশনী ও বুকশপসমূহ (Featured Bookshops)
              </h2>
              <p className="text-muted-foreground text-xs">
                বাংলাবাজার, নীলক্ষেত ও সেন্ট্রাল রিপোজিটরি থেকে যাচাইকৃত
                স্বতন্ত্র বুকশপ
              </p>
            </div>
          </div>

          <Link href="/vendors">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 text-xs font-bold"
            >
              <span>সকল বুকশপ দেখুন</span>
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
                Official Depot
              </Badge>
            </div>
            <div>
              <h3 className="text-foreground text-base font-bold">
                RTDS Publications Central Depot
              </h3>
              <p className="text-muted-foreground mt-1 line-clamp-2 text-xs">
                RTDS প্ল্যাটফর্মের অফিসিয়াল প্রকাশনা ও মেডিকেল মাস্টার সিরিজের
                কেন্দ্রীয় সরবরাহ কেন্দ্র।
              </p>
            </div>
            <div className="flex items-center justify-between border-t pt-2 text-xs">
              <span className="text-muted-foreground">150+ বই উপলব্ধ</span>
              <Link
                href="/vendors/rtds-publications-depot"
                className="font-bold text-red-600 hover:underline"
              >
                বুকশপ দেখুন →
              </Link>
            </div>
          </div>

          {/* Vendor 2 */}
          <div className="bg-card hover:border-primary/40 space-y-4 rounded-2xl border p-6 shadow-xs transition-all hover:shadow-md">
            <div className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-600/10 text-lg font-black text-amber-600">
                BB
              </div>
              <Badge className="bg-blue-600 text-[10px] font-bold text-white">
                Heritage Shop
              </Badge>
            </div>
            <div>
              <h3 className="text-foreground text-base font-bold">
                Banglabazar Boi Bhaban
              </h3>
              <p className="text-muted-foreground mt-1 line-clamp-2 text-xs">
                বাংলাবাজারের ঐতিহ্যবাহী প্রকাশনা, ধ্রুপদী সাহিত্য, ইতিহাস ও
                আন্তর্জাতিক অনুবাদের বিশাল সংগ্রহশালা।
              </p>
            </div>
            <div className="flex items-center justify-between border-t pt-2 text-xs">
              <span className="text-muted-foreground">300+ বই উপলব্ধ</span>
              <Link
                href="/vendors/banglabazar-boi-bhaban"
                className="font-bold text-red-600 hover:underline"
              >
                বুকশপ দেখুন →
              </Link>
            </div>
          </div>

          {/* Vendor 3 */}
          <div className="bg-card hover:border-primary/40 space-y-4 rounded-2xl border p-6 shadow-xs transition-all hover:shadow-md">
            <div className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600/10 text-lg font-black text-indigo-600">
                NE
              </div>
              <Badge className="bg-emerald-600 text-[10px] font-bold text-white">
                Curated Shop
              </Badge>
            </div>
            <div>
              <h3 className="text-foreground text-base font-bold">
                Nilkhet Engineering Corner
              </h3>
              <p className="text-muted-foreground mt-1 line-clamp-2 text-xs">
                নীলক্ষেত বুক মার্কেট থেকে কম্পিউটার সায়েন্স, ইলেকট্রিক্যাল ও
                ভার্সিটি টেক্সটবইয়ের নির্ভরযোগ্য শপ।
              </p>
            </div>
            <div className="flex items-center justify-between border-t pt-2 text-xs">
              <span className="text-muted-foreground">220+ বই উপলব্ধ</span>
              <Link
                href="/vendors/nilkhet-engineering-corner"
                className="font-bold text-red-600 hover:underline"
              >
                বুকশপ দেখুন →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Genre & Subject Exploration Grid */}
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
                আপনার পছন্দের বিষয় বা পরীক্ষার বিভাগ নির্বাচন করে দ্রুত বই
                খুঁজুন
              </p>
            </div>
          </div>

          <Link href="/categories">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 text-xs font-bold"
            >
              <span>সকল বিভাগ</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {[
            {
              name: "মেডিকেল ভর্তি প্রস্তুতি",
              slug: "medical-engineering-admission",
              icon: "🩺",
              count: "150+ Books",
            },
            {
              name: "উপন্যাস ও সাহিত্য",
              slug: "fiction-literature",
              icon: "📖",
              count: "450+ Books",
            },
            {
              name: "বিজ্ঞান ও প্রযুক্তি",
              slug: "computer-science-engineering",
              icon: "💻",
              count: "120+ Books",
            },
            {
              name: "ইতিহাস ও ঐতিহ্য",
              slug: "history-heritage",
              icon: "🏛️",
              count: "95+ Books",
            },
            {
              name: "ইসলামি সাহিত্য",
              slug: "islamic-theological",
              icon: "🕌",
              count: "180+ Books",
            },
            {
              name: "দুষ্প্রাপ্য ও ক্লাসিক",
              slug: "philosophy-society",
              icon: "✨",
              count: "70+ Books",
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
