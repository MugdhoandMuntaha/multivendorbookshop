"use client";

import { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";
import {
  FacebookIcon,
  YoutubeIcon,
  InstagramIcon,
  TwitterIcon,
  LinkedinIcon,
} from "@/components/common/social-icons";
import { useLanguage } from "@/lib/i18n/context";

export function NewsletterBar() {
  const { locale } = useLanguage();
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setIsSubscribed(true);
    setTimeout(() => {
      setEmail("");
      setIsSubscribed(false);
    }, 4000);
  }

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-slate-50 p-4 sm:p-5">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-5">
        {/* Left: Icon & Text */}
        <div className="flex items-center gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800">
            <Send className="h-5 w-5 -rotate-12" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900">
              {locale === "bn"
                ? "নতুন বই, অফার ও আপডেট পেতে সাবস্ক্রাইব করুন"
                : "Subscribe for new releases, exclusive discounts & updates"}
            </h4>
            <p className="text-[11px] text-slate-500">
              {locale === "bn"
                ? "আপনার ইমেইল ঠিকানা লিখে যুক্ত থাকুন আমাদের সাথে"
                : "Join over 25,000+ passionate readers nationwide"}
            </p>
          </div>
        </div>

        {/* Center: Input Form */}
        <form onSubmit={handleSubmit} className="flex items-center gap-2 w-full sm:w-auto">
          {isSubscribed ? (
            <div className="flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-xs font-bold text-emerald-800">
              <CheckCircle2 className="h-4 w-4 text-emerald-700" />
              <span>
                {locale === "bn"
                  ? "ধন্যবাদ! সাবস্ক্রিপশন সম্পন্ন হয়েছে।"
                  : "Thank you for subscribing!"}
              </span>
            </div>
          ) : (
            <div className="relative flex items-center w-full sm:w-auto">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={
                  locale === "bn"
                    ? "Enter your email address..."
                    : "Enter your email address..."
                }
                className="w-full sm:w-72 md:w-80 rounded-full border border-slate-200 bg-white py-2 pl-4 pr-32 text-xs text-slate-800 placeholder:text-slate-400 focus:border-emerald-800 focus:outline-none"
              />
              <button
                type="submit"
                className="absolute right-1 rounded-full bg-[#0c3823] hover:bg-[#124d31] px-4 py-1.5 text-xs font-bold text-white shadow-xs transition-all"
              >
                {locale === "bn" ? "সাবস্ক্রাইব করুন" : "Subscribe"}
              </button>
            </div>
          )}
        </form>

        {/* Right: Social Media Icons */}
        <div className="flex items-center gap-2 text-slate-600">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white border border-slate-200 hover:text-blue-600 hover:border-blue-200 transition-colors shadow-xs"
            title="Facebook"
          >
            <FacebookIcon className="h-4 w-4" />
          </a>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white border border-slate-200 hover:text-red-600 hover:border-red-200 transition-colors shadow-xs"
            title="YouTube"
          >
            <YoutubeIcon className="h-4 w-4" />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white border border-slate-200 hover:text-pink-600 hover:border-pink-200 transition-colors shadow-xs"
            title="Instagram"
          >
            <InstagramIcon className="h-4 w-4" />
          </a>
          <a
            href="https://x.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white border border-slate-200 hover:text-slate-900 hover:border-slate-400 transition-colors shadow-xs"
            title="X (Twitter)"
          >
            <TwitterIcon className="h-4 w-4" />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white border border-slate-200 hover:text-blue-700 hover:border-blue-200 transition-colors shadow-xs"
            title="LinkedIn"
          >
            <LinkedinIcon className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
