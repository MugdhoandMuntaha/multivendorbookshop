import Link from "next/link";
import {
  BookOpen,
  ShieldCheck,
  PhoneCall,
  Mail,
  MapPin,
  Truck,
  CreditCard,
} from "lucide-react";
import { getServerLocale, getDictionary } from "@/lib/i18n/server";

export async function Footer() {
  const locale = await getServerLocale();
  const t = getDictionary(locale);

  return (
    <footer className="border-t border-emerald-950/40 bg-slate-950 py-12 text-sm text-slate-300">
      <div className="container mx-auto max-w-7xl space-y-10 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand Info & Hotline */}
          <div className="space-y-4 lg:col-span-2">
            <Link
              href="/"
              className="flex items-center gap-2 text-xl font-black text-white"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-md">
                <BookOpen className="h-5 w-5" />
              </div>
              <span>
                RTDS <span className="text-emerald-400">Bookshop</span>
              </span>
            </Link>
            <p className="max-w-sm text-xs leading-relaxed text-slate-400">
              {t.footer.aboutText}
            </p>

            <div className="space-y-2 pt-2 text-xs">
              <div className="flex items-center gap-2.5 text-slate-300">
                <PhoneCall className="h-4 w-4 shrink-0 text-emerald-400" />
                <span className="font-semibold">
                  09612-007837 / 01700-000000 ({t.common.serviceHours})
                </span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-300">
                <Mail className="h-4 w-4 shrink-0 text-emerald-400" />
                <span>support@rtdsbookshop.com / info@rtdslive.com</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-300">
                <MapPin className="h-4 w-4 shrink-0 text-emerald-400" />
                <span>
                  RTDS Central Hub, Farmgate / Nilkhet, Dhaka, Bangladesh
                </span>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="mb-3 text-xs font-bold tracking-wider text-emerald-400 uppercase">
              {t.footer.categoriesHeader}
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link
                  href="/books?category=medical"
                  className="transition-colors hover:text-emerald-300"
                >
                  Medical & Dental Prep
                </Link>
              </li>
              <li>
                <Link
                  href="/books?category=engineering"
                  className="transition-colors hover:text-emerald-300"
                >
                  Engineering & Varsity Admission
                </Link>
              </li>
              <li>
                <Link
                  href="/books?category=academic"
                  className="transition-colors hover:text-emerald-300"
                >
                  HSC & University Series
                </Link>
              </li>
              <li>
                <Link
                  href="/books?category=fiction"
                  className="transition-colors hover:text-emerald-300"
                >
                  Literature & Novels
                </Link>
              </li>
              <li>
                <Link
                  href="/books?category=rare"
                  className="transition-colors hover:text-emerald-300"
                >
                  Rare & Classic Editions
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-3 text-xs font-bold tracking-wider text-emerald-400 uppercase">
              {t.footer.quickLinksHeader}
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link
                  href="/vendors"
                  className="transition-colors hover:text-emerald-300"
                >
                  Verified Bookstores
                </Link>
              </li>
              <li>
                <Link
                  href="/vendor/apply"
                  className="transition-colors hover:text-emerald-300"
                >
                  Join as Vendor
                </Link>
              </li>
              <li>
                <Link
                  href="/buyer/orders"
                  className="transition-colors hover:text-emerald-300"
                >
                  Order Tracking
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="transition-colors hover:text-emerald-300"
                >
                  Customer Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Nationwide Delivery */}
          <div>
            <h4 className="mb-3 text-xs font-bold tracking-wider text-emerald-400 uppercase">
              {t.footer.supportHeader}
            </h4>
            <div className="space-y-3 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <Truck className="h-4 w-4 shrink-0 text-emerald-400" />
                <span>
                  {t.footer.deliveryInfo}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CreditCard className="h-4 w-4 shrink-0 text-emerald-400" />
                <span>{t.footer.paymentMethods}</span>
              </div>
              <div className="flex items-start gap-2">
                <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-400" />
                <span>100% Genuine Books & Secure Checkout</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-900 pt-8 text-xs text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} {t.footer.rightsReserved}</p>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="transition-colors hover:text-slate-400"
            >
              {t.footer.privacy}
            </Link>
            <Link
              href="/terms"
              className="transition-colors hover:text-slate-400"
            >
              {t.footer.terms}
            </Link>
            <Link
              href="/returns"
              className="transition-colors hover:text-slate-400"
            >
              {t.footer.refundPolicy}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
