"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShieldCheck, PenTool, Tag } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";

const FEATURED_COVERS = [
  {
    title: "স্বপ্নের পথে",
    author: "ড. খোন্দকার আব্দুল্লাহ",
    url: "https://covers.openlibrary.org/b/isbn/9780134988689-L.jpg",
    accent: "from-amber-600 to-amber-800",
  },
  {
    title: "সময়ের গল্প",
    author: "তাহমিদুর রহমান",
    url: "https://covers.openlibrary.org/b/isbn/9781449373320-L.jpg",
    accent: "from-blue-600 to-indigo-800",
  },
  {
    title: "বাংলার ইতিহাস",
    author: "অধ্যাপক ড. সালাহউদ্দীন",
    url: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=800",
    accent: "from-emerald-700 to-teal-900",
  },
  {
    title: "জীবন ও দর্শন",
    author: "মারকাস অরেলিয়াস",
    url: "https://covers.openlibrary.org/b/isbn/9780140449334-L.jpg",
    accent: "from-stone-700 to-slate-900",
  },
];

export function PublicationShowcase() {
  const { locale } = useLanguage();

  return (
    <section className="relative overflow-hidden rounded-3xl border border-emerald-200/60 bg-gradient-to-r from-emerald-50/90 via-teal-50/50 to-emerald-100/60 p-6 sm:p-10">
      <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
        {/* Left Column: Heading & CTA */}
        <div className="space-y-4 lg:col-span-4">
          <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
            {locale === "bn" ? "আমাদের প্রকাশনা" : "In-House Publications"}
          </span>

          <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 leading-snug">
            {locale === "bn"
              ? "নিজস্ব প্রকাশনার বিশেষ সংগ্রহ"
              : "Exclusive Publications & Master Editions"}
          </h3>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {locale === "bn"
              ? "আমাদের প্রকাশিত বইগুলো দেখুন বিশেষ মূল্য ও অফারে।"
              : "Explore our verified editions, complete question banks, and bestselling heritage titles."}
          </p>

          <Link
            href="/books"
            className="inline-flex items-center gap-2 rounded-full bg-[#0c3823] hover:bg-[#124d31] px-5 py-2.5 text-xs font-bold text-white shadow-sm transition-all"
          >
            <span>{locale === "bn" ? "সব বই দেখুন" : "View All Books"}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Center Column: 4 Realistic Standing Books */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 lg:col-span-5 overflow-hidden py-2">
          {FEATURED_COVERS.map((book, idx) => (
            <div
              key={idx}
              className="group relative h-44 w-28 sm:h-52 sm:w-34 shrink-0 overflow-hidden rounded-lg shadow-lg transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl bg-white border border-slate-200/80"
              style={{
                perspective: "1000px",
              }}
            >
              <Image
                src={book.url}
                alt={book.title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 25vw, 15vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90 p-2 flex flex-col justify-end">
                <span className="text-[11px] font-bold text-white leading-tight line-clamp-1">
                  {book.title}
                </span>
                <span className="text-[9px] text-slate-300 line-clamp-1">
                  {book.author}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Value Propositions */}
        <div className="flex flex-col gap-3 lg:col-span-3 border-t lg:border-t-0 lg:border-l border-emerald-200/80 pt-4 lg:pt-0 lg:pl-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">
                {locale === "bn" ? "উন্নত মানের প্রকাশনা" : "Premium Print Quality"}
              </h4>
              <p className="text-[11px] text-slate-500">
                {locale === "bn" ? "নিখুঁত বাঁধাই ও অফসেট কাগজ" : "Archival paper & durable binding"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
              <PenTool className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">
                {locale === "bn" ? "বিশিষ্ট লেখকদের বই" : "Renowned Writers"}
              </h4>
              <p className="text-[11px] text-slate-500">
                {locale === "bn" ? "শীর্ষস্থানীয় লেখক ও গবেষক" : "Top scholars & educators"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
              <Tag className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">
                {locale === "bn" ? "সাশ্রয়ী মূল্য" : "Affordable Pricing"}
              </h4>
              <p className="text-[11px] text-slate-500">
                {locale === "bn" ? "বিশেষ ছাড়ে আকর্ষণীয় অফার" : "Special seasonal student discounts"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
