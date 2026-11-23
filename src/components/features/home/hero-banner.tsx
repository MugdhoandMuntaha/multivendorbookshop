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
    <section className="relative overflow-hidden rounded-3xl bg-[#f5efe6] shadow-xs">
      <div className="relative min-h-[380px] sm:min-h-[430px] flex items-center p-6 sm:p-12 lg:p-14">
        {/* Navigation Arrows */}
        <button
          onClick={handlePrev}
          type="button"
          aria-label="Previous slide"
          className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow-md backdrop-blur-xs transition-all hover:bg-white hover:scale-110"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <button
          onClick={handleNext}
          type="button"
          aria-label="Next slide"
          className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow-md backdrop-blur-xs transition-all hover:bg-white hover:scale-110"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* Floating Circular Discount Badge */}
        <div className="absolute top-4 right-4 sm:top-8 sm:right-10 z-20 flex h-20 w-20 sm:h-24 sm:w-24 -rotate-6 flex-col items-center justify-center rounded-full bg-[#fcd34d] text-slate-950 shadow-md">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">
            Up to
          </span>
          <span className="text-xl sm:text-2xl font-black leading-none">
            {slide.discount}
          </span>
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">
            OFF
          </span>
        </div>

        {/* Main Content Grid */}
        <div className="relative z-10 grid grid-cols-1 items-center gap-8 lg:grid-cols-12 w-full">
          {/* Left Column: Text & CTA */}
          <div className="space-y-4 sm:space-y-5 lg:col-span-7 pr-6">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100/90 px-3.5 py-1 text-xs font-bold text-emerald-800 border border-emerald-200/60">
              <Sprout className="h-3.5 w-3.5 text-emerald-700" />
              <span>{locale === "bn" ? slide.badgeBn : slide.badgeEn}</span>
            </span>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.12] whitespace-pre-line">
              {locale === "bn" ? slide.titleBn : slide.titleEn}
            </h1>

            <p className="max-w-md text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
              {locale === "bn" ? slide.subtitleBn : slide.subtitleEn}
            </p>

            <div className="pt-2">
              <Link
                href={slide.link}
                className="inline-flex items-center gap-2 rounded-full bg-[#0c3823] hover:bg-[#124d31] px-6 sm:px-7 py-3 text-xs sm:text-sm font-bold text-white shadow-md transition-all hover:scale-105"
              >
                <span>{locale === "bn" ? slide.ctaBn : slide.ctaEn}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Right Column: Hero Image Container */}
          <div className="relative lg:col-span-5 flex items-center justify-center">
            <div className="relative aspect-[4/3] w-full max-w-md overflow-hidden rounded-2xl shadow-xl border-4 border-white/80">
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
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 transition-all rounded-full ${
                currentSlide === idx ? "w-6 bg-[#0c3823]" : "w-2 bg-slate-400/60"
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
