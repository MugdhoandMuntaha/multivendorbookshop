import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  BadgeCheck,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function HeroBanner() {
  return (
    <div className="space-y-8">
      {/* Main Promotional Banner with Lush Emerald Gradient & Neomorphic Depth */}
      <section className="relative overflow-hidden rounded-3xl border border-emerald-400/30 bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-800 p-8 text-white shadow-[8px_16px_32px_-6px_rgba(5,150,105,0.25)] sm:p-12 lg:p-14">
        {/* Soft background light-diffusers */}
        <div className="pointer-events-none absolute -top-14 -right-14 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-14 -left-14 h-72 w-72 rounded-full bg-teal-300/20 blur-3xl" />

        <div className="relative z-10 grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
          <div className="space-y-5 lg:col-span-7">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="border border-white/30 bg-white/15 px-3 py-1 text-xs font-semibold text-white shadow-xs backdrop-blur-md hover:bg-white/25">
                <Sparkles className="mr-1.5 inline h-3.5 w-3.5 text-amber-300" />
                RTDS জাতীয় বইমেলা ও ভর্তি উৎসব ২০২৬
              </Badge>
              <span className="rounded-full bg-amber-400 px-2.5 py-0.5 text-xs font-black tracking-wider text-slate-950 uppercase shadow-xs">
                Up to 30% Off
              </span>
            </div>

            <h1 className="text-3xl leading-tight font-black tracking-tight drop-shadow-xs sm:text-4xl lg:text-5xl">
              মেডিকেল, প্রকৌশল ও একাডেমিক বইয়ের বিশ্বস্ত মার্কেটপ্লেস
            </h1>

            <p className="max-w-xl text-sm leading-relaxed font-normal text-emerald-100/90 sm:text-base">
              RTDS মেডিকেল মাস্টার সিরিজ, ইঞ্জিনিয়ারিং ভর্তি সহায়িকা, একাডেমিক
              গাইড এবং সাহিত্য এক কার্টে অর্ডার করুন সরাসরি নির্ভরযোগ্য প্রকাশক
              ও বুকশপ থেকে।
            </p>

            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <Link href="/books">
                <button
                  type="button"
                  className="neo-button-light flex h-11 items-center gap-2 rounded-2xl px-6 font-bold text-emerald-800 shadow-md"
                >
                  <BookOpen className="h-4 w-4 text-emerald-600" />
                  <span>বইয়ের তালিকা দেখুন (Catalog)</span>
                </button>
              </Link>

              <Link href="/vendor/apply">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-11 gap-2 rounded-2xl border-white/40 bg-white/10 px-6 font-semibold text-white backdrop-blur-md hover:bg-white/20"
                >
                  <span>বই বিক্রি করুন (Sell Books)</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Visual Floating Showcase Cards (Neomorphic Frosted Glass) */}
          <div className="hidden grid-cols-2 gap-4 lg:col-span-5 lg:grid">
            <div className="space-y-2 rounded-2xl border border-white/25 bg-white/15 p-5 shadow-[6px_6px_20px_rgba(0,0,0,0.12),-2px_-2px_10px_rgba(255,255,255,0.2)] backdrop-blur-md">
              <span className="text-[10px] font-bold tracking-wider text-amber-300 uppercase">
                মেডিকেল ও এইচএসসি
              </span>
              <p className="text-sm leading-snug font-bold text-white">
                RTDS মেডিকেল মাস্টার বায়োলজি ও ফিজিক্স সেট
              </p>
              <p className="text-xs text-emerald-100/80">
                সারা দেশে দ্রুত ক্যাশ অন ডেলিভারি সুবিধা
              </p>
            </div>

            <div className="space-y-2 rounded-2xl border border-white/25 bg-white/15 p-5 shadow-[6px_6px_20px_rgba(0,0,0,0.12),-2px_-2px_10px_rgba(255,255,255,0.2)] backdrop-blur-md">
              <span className="text-[10px] font-bold tracking-wider text-amber-300 uppercase">
                সাহিত্য ও দুষ্প্রাপ্য
              </span>
              <p className="text-sm leading-snug font-bold text-white">
                ধ্রুপদী বাংলা ও বিশ্ব সাহিত্যের সেরা সংস্করণ
              </p>
              <p className="text-xs text-emerald-100/80">
                আসল ও পাইরেসিমুক্ত নতুন ও রিকন্ডিশনড কপি
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Trust & Service Indicators (Tactile Neomorphic White & Emerald Badges) */}
      <section className="grid grid-cols-2 gap-3.5 sm:gap-5 lg:grid-cols-4">
        <div className="neo-card neo-card-hover flex items-center gap-3.5 p-4 sm:p-5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-100/80 text-emerald-700 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05)]">
            <BadgeCheck className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 sm:text-sm">
              ১০০% আসল বই (Genuine)
            </h4>
            <p className="text-[11px] text-slate-500">
              মূল প্রকাশনী ও বিশ্বস্ত কপি
            </p>
          </div>
        </div>

        <div className="neo-card neo-card-hover flex items-center gap-3.5 p-4 sm:p-5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-100/80 text-emerald-700 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05)]">
            <Truck className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 sm:text-sm">
              ক্যাশ অন ডেলিভারি
            </h4>
            <p className="text-[11px] text-slate-500">
              ৬৪ জেলায় দ্রুততম ডেলিভারি
            </p>
          </div>
        </div>

        <div className="neo-card neo-card-hover flex items-center gap-3.5 p-4 sm:p-5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-100/80 text-emerald-700 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05)]">
            <RotateCcw className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 sm:text-sm">
              ৭ দিনের রিপ্লেসমেন্ট
            </h4>
            <p className="text-[11px] text-slate-500">
              ত্রুটিপূর্ণ বইয়ে সহজ পরিবর্তন
            </p>
          </div>
        </div>

        <div className="neo-card neo-card-hover flex items-center gap-3.5 p-4 sm:p-5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-100/80 text-emerald-700 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05)]">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 sm:text-sm">
              যাচাইকৃত বুকশপ ও ভেন্ডর
            </h4>
            <p className="text-[11px] text-slate-500">নিরাপদ অনলাইন বুক শপিং</p>
          </div>
        </div>
      </section>
    </div>
  );
}
