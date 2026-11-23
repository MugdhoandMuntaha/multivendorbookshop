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
    <section className="rounded-xl border border-stone-200/80 bg-stone-50/70 p-4 sm:p-5">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-5">
        {/* Left: Icon & Text */}
        <div className="flex items-center gap-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100/70 text-emerald-800">
            <Send className="h-4 w-4 stroke-[1.5]" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-semibold text-stone-900">
              {locale === "bn"
                ? "নতুন বই, অফার ও আপডেট পেতে সাবস্ক্রাইব করুন"
                : "Subscribe for new releases, exclusive discounts & updates"}
            </h4>
            <p className="text-[11px] text-stone-500">
              {locale === "bn"
                ? "আপনার ইমেইল ঠিকানা লিখে যুক্ত থাকুন আমাদের সাথে"
                : "Join verified readers nationwide for curated updates"}
            </p>
          </div>
        </div>

        {/* Center: Input Form */}
        <form onSubmit={handleSubmit} className="flex items-center gap-2 w-full sm:w-auto">
          {isSubscribed ? (
            <div className="flex items-center gap-2 rounded-lg bg-emerald-100/80 px-4 py-2 text-xs font-medium text-emerald-800">
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
                className="w-full sm:w-72 md:w-80 rounded-lg border border-stone-200 bg-white py-2 pl-3.5 pr-28 text-xs text-stone-800 placeholder:text-stone-400 focus:border-[#0c3823] focus:outline-none"
              />
              <button
                type="submit"
                className="absolute right-1 rounded-md bg-[#0c3823] hover:bg-[#124d31] px-3.5 py-1.5 text-xs font-medium text-white transition-colors"
              >
                {locale === "bn" ? "সাবস্ক্রাইব করুন" : "Subscribe"}
              </button>
            </div>
          )}
        </form>

        {/* Right: Social Media Icons */}
        <div className="flex items-center gap-2 text-stone-500">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white border border-stone-200/80 hover:text-stone-900 hover:border-stone-400 transition-colors"
            title="Facebook"
          >
            <FacebookIcon className="h-3.5 w-3.5" />
          </a>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white border border-stone-200/80 hover:text-stone-900 hover:border-stone-400 transition-colors"
            title="YouTube"
          >
            <YoutubeIcon className="h-3.5 w-3.5" />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white border border-stone-200/80 hover:text-stone-900 hover:border-stone-400 transition-colors"
            title="Instagram"
          >
            <InstagramIcon className="h-3.5 w-3.5" />
          </a>
          <a
            href="https://x.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white border border-stone-200/80 hover:text-stone-900 hover:border-stone-400 transition-colors"
            title="X (Twitter)"
          >
            <TwitterIcon className="h-3.5 w-3.5" />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white border border-stone-200/80 hover:text-stone-900 hover:border-stone-400 transition-colors"
            title="LinkedIn"
          >
            <LinkedinIcon className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
}
