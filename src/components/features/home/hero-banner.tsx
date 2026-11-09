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
    <div className="space-y-6">
      {/* Main Promotional Banner */}
      <section className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-red-600 via-rose-600 to-amber-600 p-8 text-white shadow-xl sm:p-12 lg:p-14">
        {/* Subtle background circles for depth */}
        <div className="absolute -top-12 -right-12 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-12 -left-12 h-64 w-64 rounded-full bg-amber-400/20 blur-2xl" />

        <div className="relative z-10 grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
          <div className="space-y-5 lg:col-span-7">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="border-none bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur hover:bg-white/30">
                <Sparkles className="mr-1.5 inline h-3.5 w-3.5 text-amber-300" />
                RTDS জাতীয় বইমেলা ও ভর্তি উৎসব ২০২৬
              </Badge>
              <span className="rounded-full bg-amber-400 px-2.5 py-0.5 text-xs font-bold tracking-wider text-slate-950 uppercase">
                Up to 30% Off
              </span>
            </div>

            <h1 className="text-3xl leading-tight font-black tracking-tight sm:text-4xl lg:text-5xl">
              মেডিকেল, প্রকৌশল ও একাডেমিক বইয়ের বিশ্বস্ত মার্কেটপ্লেস
            </h1>

            <p className="max-w-xl text-sm leading-relaxed font-normal text-white/90 sm:text-base">
              RTDS মেডিকেল মাস্টার সিরিজ, ইঞ্জিনিয়ারিং ভর্তি সহায়িকা, একাডেমিক
              গাইড এবং সাহিত্য এক কার্টে অর্ডার করুন সরাসরি নির্ভরযোগ্য প্রকাশক
              ও বুকশপ থেকে।
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link href="/books">
                <Button
                  size="lg"
                  className="h-11 gap-2 rounded-xl bg-white px-6 font-bold text-red-600 shadow-lg hover:bg-slate-100"
                >
                  <BookOpen className="h-4 w-4" />
                  বইয়ের তালিকা দেখুন (Catalog)
                </Button>
              </Link>

              <Link href="/vendor/apply">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-11 gap-2 rounded-xl border-white/40 px-6 text-white backdrop-blur hover:bg-white/10"
                >
                  <span>বই বিক্রি করুন (Sell Books)</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Visual Floating Showcase Cards */}
          <div className="hidden grid-cols-2 gap-3.5 lg:col-span-5 lg:grid">
            <div className="space-y-2 rounded-2xl border border-white/20 bg-white/15 p-4 shadow-lg backdrop-blur-md">
              <span className="text-[10px] font-bold tracking-wider text-amber-300 uppercase">
                মেডিকেল ও এইচএসসি
              </span>
              <p className="text-sm leading-snug font-bold text-white">
                RTDS মেডিকেল মাস্টার বায়োলজি ও ফিজিক্স সেট
              </p>
              <p className="text-xs text-white/80">
                সারা দেশে দ্রুত ক্যাশ অন ডেলিভারি সুবিধা
              </p>
            </div>

            <div className="space-y-2 rounded-2xl border border-white/20 bg-white/15 p-4 shadow-lg backdrop-blur-md">
              <span className="text-[10px] font-bold tracking-wider text-amber-300 uppercase">
                সাহিত্য ও দুষ্প্রাপ্য
              </span>
              <p className="text-sm leading-snug font-bold text-white">
                ধ্রুপদী বাংলা ও বিশ্ব সাহিত্যের সেরা সংস্করণ
              </p>
              <p className="text-xs text-white/80">
                আসল ও পাইরেসিমুক্ত নতুন ও রিকন্ডিশনড কপি
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Trust & Service Indicators */}
      <section className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <div className="bg-card/60 flex items-center gap-3 rounded-xl border p-3.5 shadow-2xs sm:p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-600">
            <BadgeCheck className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-foreground text-xs font-bold sm:text-sm">
              ১০০% আসল বই (Genuine)
            </h4>
            <p className="text-muted-foreground text-[11px]">
              মূল প্রকাশনী ও বিশ্বস্ত কপি
            </p>
          </div>
        </div>

        <div className="bg-card/60 flex items-center gap-3 rounded-xl border p-3.5 shadow-2xs sm:p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600">
            <Truck className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-foreground text-xs font-bold sm:text-sm">
              সারা দেশে ক্যাশ অন ডেলিভারি
            </h4>
            <p className="text-muted-foreground text-[11px]">
              ৬৪ জেলায় দ্রুততম হোম ডেলিভারি
            </p>
          </div>
        </div>

        <div className="bg-card/60 flex items-center gap-3 rounded-xl border p-3.5 shadow-2xs sm:p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-500/10 text-green-600">
            <RotateCcw className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-foreground text-xs font-bold sm:text-sm">
              ৭ দিনের রিপ্লেসমেন্ট
            </h4>
            <p className="text-muted-foreground text-[11px]">
              ত্রুটিপূর্ণ বইয়ে সহজ পরিবর্তন
            </p>
          </div>
        </div>

        <div className="bg-card/60 flex items-center gap-3 rounded-xl border p-3.5 shadow-2xs sm:p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-foreground text-xs font-bold sm:text-sm">
              যাচাইকৃত বুকশপ ও ভেন্ডর
            </h4>
            <p className="text-muted-foreground text-[11px]">
              নিরাপদ অনলাইন বুক শপিং
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
