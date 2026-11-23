import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { requireUser, getCurrentProfile } from "@/server/queries/auth";
import { getServerLocale, getDictionary } from "@/lib/i18n/server";
import { CheckoutForm } from "@/components/features/checkout/checkout-form";

export const metadata: Metadata = {
  title: "Order Checkout | RTDS Bookshop",
  description: "Secure checkout for books on RTDS Bookshop.",
};

export default async function CheckoutPage() {
  await requireUser();
  const [{ profile }, locale] = await Promise.all([
    getCurrentProfile(),
    getServerLocale(),
  ]);
  const dict = getDictionary(locale);

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20">
      {/* Breadcrumbs */}
      <div className="border-b border-emerald-950/5 bg-white/70 backdrop-blur-xs">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <Link href="/" className="hover:text-emerald-700 transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
            <Link href="/cart" className="hover:text-emerald-700 transition-colors">
              Cart
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
            <span className="font-bold text-emerald-800">
              {dict.checkout.title}
            </span>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight">
            {dict.checkout.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5 font-normal">
            {dict.checkout.subtitle}
          </p>
        </div>

        <CheckoutForm
          userFullName={profile?.full_name}
        />
      </div>
    </div>
  );
}
