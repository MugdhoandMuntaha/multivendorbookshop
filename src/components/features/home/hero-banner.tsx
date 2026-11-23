"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronLeft, ChevronRight, Sprout } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";

interface HeroSlide {
  badgeBn: string;
  badgeEn: string;
  titleBn: string;
  titleEn: string;
  subtitleBn: string;
  subtitleEn: string;
  ctaBn: string;
  ctaEn: string;
  link: string;
  discount: string;
  imageUrl: string;
}

const SLIDES: HeroSlide[] = [
  {
    badgeBn: "বই পড়ুন, নিজেকে গড়ুন",
    badgeEn: "Read Books, Grow Yourself",
    titleBn: "জ্ঞান হোক\nআপনার সঙ্গী",
    titleEn: "Let Knowledge Be\nYour True Companion",
    subtitleBn: "বইঘর থেকে পছন্দের বই কিনুন সহজে, দ্রুত ও নিরাপদে।",
    subtitleEn: "Shop authentic academic, medical, and literature books with fast delivery.",
    ctaBn: "এখনই কিনুন",
    ctaEn: "Shop Now",
    link: "/books",
    discount: "40%",
    imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=1000",
  },
  {
    badgeBn: "ভর্তি উৎসব ২০২৬",
    badgeEn: "Admission Festival 2026",
    titleBn: "মেডিকেল ও ইঞ্জিনিয়ারিং\nমাস্টার সিরিজ",
    titleEn: "Medical & Engineering\nMaster Admission Guides",
    subtitleBn: "বিগত ২০ বছরের প্রশ্নব্যাংক ও শর্টকাট টেকনিকসহ পূর্ণাঙ্গ প্রস্তুতি।",
    subtitleEn: "Complete question banks, high-yield diagrams, and chapter shortcuts.",
    ctaBn: "সিরিজ দেখুন",
    ctaEn: "Explore Series",
    link: "/books?category=medical-engineering-admission",
    discount: "35%",
    imageUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=1000",
  },
];

export function HeroBanner() {
  const { locale } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slide = SLIDES[currentSlide];

  function handlePrev() {
    setCurrentSlide((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1));
  }

  function handleNext() {
    setCurrentSlide((prev) => (prev === SLIDES.length - 1 ? 0 : prev + 1));
  }

  return (
    <section className="relative overflow-hidden rounded-2xl border border-stone-200/70 bg-[#f7f3ec]">
      <div className="relative min-h-[380px] sm:min-h-[420px] flex items-center p-6 sm:p-10 lg:p-12">
        {/* Navigation Arrows */}
        <button
          onClick={handlePrev}
          type="button"
          aria-label="Previous slide"
          className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-stone-200 bg-white/95 text-stone-700 shadow-2xs transition-colors hover:bg-white hover:text-stone-900"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <button
          onClick={handleNext}
          type="button"
          aria-label="Next slide"
          className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-stone-200 bg-white/95 text-stone-700 shadow-2xs transition-colors hover:bg-white hover:text-stone-900"
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        {/* Circular Discount Medallion (Quiet editorial badge) */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-8 z-20 flex h-20 w-20 sm:h-22 sm:w-22 flex-col items-center justify-center rounded-full border border-amber-300/80 bg-[#fef3c7] text-stone-900 shadow-2xs">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-600">
            Up to
          </span>
          <span className="text-xl sm:text-2xl font-bold leading-none tabular-nums text-stone-950">
            {slide.discount}
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-600">
            OFF
          </span>
        </div>

        {/* Main Content Grid */}
        <div className="relative z-10 grid grid-cols-1 items-center gap-8 lg:grid-cols-12 w-full">
          {/* Left Column: Text & CTA */}
          <div className="space-y-4 lg:col-span-7 pr-6">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100/80 px-3 py-1 text-xs font-medium text-emerald-800 border border-emerald-200/50">
              <Sprout className="h-3.5 w-3.5 text-emerald-700" />
              <span>{locale === "bn" ? slide.badgeBn : slide.badgeEn}</span>
            </span>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-stone-900 leading-[1.18] whitespace-pre-line">
              {locale === "bn" ? slide.titleBn : slide.titleEn}
            </h1>

            <p className="max-w-md text-xs sm:text-sm text-stone-600 leading-relaxed">
              {locale === "bn" ? slide.subtitleBn : slide.subtitleEn}
            </p>

            <div className="pt-2">
              <Link
                href={slide.link}
                className="inline-flex items-center gap-2 rounded-lg bg-[#0c3823] hover:bg-[#124d31] px-5 py-2.5 text-xs sm:text-sm font-medium text-white transition-colors"
              >
                <span>{locale === "bn" ? slide.ctaBn : slide.ctaEn}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Right Column: Hero Image Container */}
          <div className="relative lg:col-span-5 flex items-center justify-center">
            <div className="relative aspect-[4/3] w-full max-w-md overflow-hidden rounded-xl border border-stone-200/80 bg-stone-100 shadow-2xs">
              <Image
                src={slide.imageUrl}
                alt="Book Collection"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            </div>
          </div>
        </div>

        {/* Bottom Pagination Dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
          {SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-1.5 transition-all rounded-full ${
                currentSlide === idx ? "w-5 bg-[#0c3823]" : "w-1.5 bg-stone-400/60"
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
