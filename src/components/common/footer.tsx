import Link from "next/link";
import { BookOpen } from "lucide-react";
import {
  FacebookIcon,
  YoutubeIcon,
  InstagramIcon,
  TwitterIcon,
  LinkedinIcon,
} from "./social-icons";
import { getServerLocale } from "@/lib/i18n/server";
import { ScrollToTopButton } from "./scroll-to-top-button";

export async function Footer() {
  const locale = await getServerLocale();

  return (
    <footer className="relative bg-[#072417] text-slate-300 pt-14 pb-8 text-xs">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {/* Column 1: Brand Info */}
          <div className="space-y-4 lg:col-span-1">
            <Link
              href="/"
              className="flex items-center gap-2.5 text-xl font-black text-white"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-800 text-white shadow-xs">
                <BookOpen className="h-5 w-5" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-xl font-black tracking-tight text-white">
                  {locale === "bn" ? "বইঘর" : "RTDS Bookshop"}
                </span>
                <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider">
                  Read • Learn • Grow
                </span>
              </div>
            </Link>
            <p className="text-[11px] leading-relaxed text-slate-400">
              {locale === "bn"
                ? "বাংলাদেশের শীর্ষস্থানীয় অনলাইন বইয়ের মার্কেটপ্লেস। নির্ভরযোগ্য প্রকাশক ও বিক্রেতাদের কাছ থেকে আসল বইয়ের নিশ্চয়তা।"
                : "Bangladesh's leading verified multivendor book marketplace. Authentic titles direct from publishers and local bookstores."}
            </p>
          </div>

          {/* Column 2: কোম্পানি (Company) */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white">
              {locale === "bn" ? "কোম্পানি" : "Company"}
            </h4>
            <ul className="space-y-2 text-[11px] text-slate-400">
              <li>
                <Link href="/about" className="hover:text-emerald-400 transition-colors">
                  {locale === "bn" ? "আমাদের সম্পর্কে" : "About Us"}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-emerald-400 transition-colors">
                  {locale === "bn" ? "যোগাযোগ" : "Contact"}
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-emerald-400 transition-colors">
                  {locale === "bn" ? "ক্যারিয়ার" : "Careers"}
                </Link>
              </li>
              <li>
                <Link href="/vendor/apply" className="hover:text-emerald-400 transition-colors">
                  {locale === "bn" ? "সেলার হিসেবে যোগ দিন" : "Become a Seller"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: সহায়তা (Support) */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white">
              {locale === "bn" ? "সহায়তা" : "Support"}
            </h4>
            <ul className="space-y-2 text-[11px] text-slate-400">
              <li>
                <Link href="/terms" className="hover:text-emerald-400 transition-colors">
                  {locale === "bn" ? "সার্ভিস নীতি" : "Terms of Service"}
                </Link>
              </li>
              <li>
                <Link href="/refund" className="hover:text-emerald-400 transition-colors">
                  {locale === "bn" ? "রিটার্ন ও রিফান্ড" : "Return & Refund Policy"}
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-emerald-400 transition-colors">
                  {locale === "bn" ? "সাধারণ প্রশ্ন" : "FAQs"}
                </Link>
              </li>
              <li>
                <Link href="/buyer/orders" className="hover:text-emerald-400 transition-colors">
                  {locale === "bn" ? "অর্ডার ট্র্যাকিং" : "Order Tracking"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: আমাদের সাথে থাকুন (Socials) */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white">
              {locale === "bn" ? "আমাদের সাথে থাকুন" : "Follow Us"}
            </h4>
            <div className="flex items-center gap-2 pt-1 text-slate-300">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 hover:bg-emerald-700 hover:text-white transition-colors"
                title="Facebook"
              >
                <FacebookIcon className="h-3.5 w-3.5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 hover:bg-red-700 hover:text-white transition-colors"
                title="YouTube"
              >
                <YoutubeIcon className="h-3.5 w-3.5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 hover:bg-pink-700 hover:text-white transition-colors"
                title="Instagram"
              >
                <InstagramIcon className="h-3.5 w-3.5" />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 hover:bg-slate-700 hover:text-white transition-colors"
                title="X"
              >
                <TwitterIcon className="h-3.5 w-3.5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 hover:bg-blue-700 hover:text-white transition-colors"
                title="LinkedIn"
              >
                <LinkedinIcon className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          {/* Column 5: নিরাপদ লেনদেনে (Payment Badges) */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white">
              {locale === "bn" ? "নিরাপদ লেনদেনে" : "Secure Payments"}
            </h4>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {/* bKash badge */}
              <div className="flex h-7 px-2.5 items-center justify-center rounded-md bg-[#e2136e] text-white font-black text-[10px] tracking-wider shadow-2xs">
                bKash
              </div>
              {/* Nagad badge */}
              <div className="flex h-7 px-2.5 items-center justify-center rounded-md bg-[#f7941d] text-white font-black text-[10px] tracking-wider shadow-2xs">
                নগদ
              </div>
              {/* Visa badge */}
              <div className="flex h-7 px-2.5 items-center justify-center rounded-md bg-[#1a1f71] text-white font-black italic text-[11px] shadow-2xs">
                VISA
              </div>
              {/* Mastercard badge */}
              <div className="flex h-7 px-2.5 items-center justify-center rounded-md bg-[#eb001b] text-white font-bold text-[10px] shadow-2xs">
                MC
              </div>
              {/* Cash on Delivery badge */}
              <div className="flex h-7 px-2.5 items-center justify-center rounded-md bg-emerald-800 text-white font-bold text-[10px] shadow-2xs">
                COD
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Links */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10 pt-6 text-[11px] text-slate-400">
          <p>
            © 2026 {locale === "bn" ? "বইঘর. সর্বস্বত্ব সংরক্ষিত।" : "RTDS Bookshop. All rights reserved."}
          </p>

          <div className="flex items-center gap-4">
            <Link href="/terms" className="hover:text-emerald-400 transition-colors">
              Terms & Conditions
            </Link>
            <span>|</span>
            <Link href="/privacy" className="hover:text-emerald-400 transition-colors">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>

      {/* Floating Scroll to Top Button */}
      <ScrollToTopButton />
    </footer>
  );
}
