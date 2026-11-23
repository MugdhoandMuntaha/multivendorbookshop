"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Gift, ArrowRight } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";

export function FlashSaleCountdown() {
  const { locale } = useLanguage();

  // State for countdown timer
  const [timeLeft, setTimeLeft] = useState({
    days: "02",
    hours: "14",
    minutes: "37",
    seconds: "25",
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let sec = parseInt(prev.seconds, 10) - 1;
        let min = parseInt(prev.minutes, 10);
        let hr = parseInt(prev.hours, 10);
        let dy = parseInt(prev.days, 10);

        if (sec < 0) {
          sec = 59;
          min -= 1;
        }
        if (min < 0) {
          min = 59;
          hr -= 1;
        }
        if (hr < 0) {
          hr = 23;
          dy = Math.max(0, dy - 1);
        }

        return {
          days: dy.toString().padStart(2, "0"),
          hours: hr.toString().padStart(2, "0"),
          minutes: min.toString().padStart(2, "0"),
          seconds: sec.toString().padStart(2, "0"),
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative overflow-hidden rounded-3xl bg-[#0a2e1d] p-6 text-white shadow-md sm:p-7">
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left: Gift Graphic & Heading */}
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-amber-400/20 text-amber-300 ring-4 ring-amber-400/10">
            <Gift className="h-8 w-8 text-amber-300 animate-bounce" />
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-emerald-300 tracking-wide uppercase">
              {locale === "bn" ? "সীমিত সময়ের অফার" : "Limited Time Offer"}
            </span>
            <div className="flex flex-wrap items-center gap-2.5">
              <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                {locale === "bn"
                  ? "সেরা বইয়ে সেরা ছাড়!"
                  : "Massive Book Festival Deals!"}
              </h3>
              <span className="rounded-full bg-[#fcd34d] px-3 py-0.5 text-xs font-black text-slate-950">
                {locale === "bn" ? "২০% পর্যন্ত ছাড়" : "Up to 20% OFF"}
              </span>
            </div>
          </div>
        </div>

        {/* Center: Countdown Timer */}
        <div className="flex items-center gap-3">
          <span className="hidden xl:inline text-xs font-semibold text-emerald-200">
            {locale === "bn" ? "অফার শেষ হতে বাকি:" : "Offer ends in:"}
          </span>

          <div className="flex items-center gap-2">
            <div className="flex flex-col items-center justify-center rounded-xl bg-white/10 px-3 py-1.5 min-w-[48px] backdrop-blur-xs">
              <span className="font-mono text-lg font-black leading-tight text-white">
                {timeLeft.days}
              </span>
              <span className="text-[9px] text-emerald-300 uppercase">
                {locale === "bn" ? "দিন" : "Days"}
              </span>
            </div>

            <span className="font-bold text-emerald-300">:</span>

            <div className="flex flex-col items-center justify-center rounded-xl bg-white/10 px-3 py-1.5 min-w-[48px] backdrop-blur-xs">
              <span className="font-mono text-lg font-black leading-tight text-white">
                {timeLeft.hours}
              </span>
              <span className="text-[9px] text-emerald-300 uppercase">
                {locale === "bn" ? "ঘণ্টা" : "Hours"}
              </span>
            </div>

            <span className="font-bold text-emerald-300">:</span>

            <div className="flex flex-col items-center justify-center rounded-xl bg-white/10 px-3 py-1.5 min-w-[48px] backdrop-blur-xs">
              <span className="font-mono text-lg font-black leading-tight text-white">
                {timeLeft.minutes}
              </span>
              <span className="text-[9px] text-emerald-300 uppercase">
                {locale === "bn" ? "মিনিট" : "Mins"}
              </span>
            </div>

            <span className="font-bold text-emerald-300">:</span>

            <div className="flex flex-col items-center justify-center rounded-xl bg-white/10 px-3 py-1.5 min-w-[48px] backdrop-blur-xs">
              <span className="font-mono text-lg font-black leading-tight text-white">
                {timeLeft.seconds}
              </span>
              <span className="text-[9px] text-emerald-300 uppercase">
                {locale === "bn" ? "সেকেন্ড" : "Secs"}
              </span>
            </div>
          </div>
        </div>

        {/* Right: CTA Button */}
        <Link
          href="/books"
          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#f59e0b] hover:bg-[#d97706] px-6 py-2.5 text-xs font-black text-slate-950 shadow-md transition-all hover:scale-105"
        >
          <span>{locale === "bn" ? "এখনই কিনুন" : "Claim Discount"}</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
