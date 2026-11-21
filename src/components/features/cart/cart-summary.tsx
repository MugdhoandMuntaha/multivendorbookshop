"use client";

import Link from "next/link";
import { ArrowRight, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { useCart } from "@/lib/cart/context";
import { useLanguage } from "@/lib/i18n/context";
import { formatPrice } from "@/lib/utils";

export function CartSummary() {
  const { calculations } = useCart();
  const { t, locale } = useLanguage();

  const {
    subtotalMinor,
    shippingTotalMinor,
    totalMinor,
    isFreeShipping,
    freeShippingRemainingMinor,
  } = calculations;

  return (
    <div className="neo-card p-6 rounded-2xl space-y-6 sticky top-24 border border-emerald-950/5">
      <h2 className="text-base font-bold text-slate-900 border-b border-emerald-100/60 pb-3">
        {t.cart.orderSummary}
      </h2>

      {/* Free Delivery Qualified / Progress Banner */}
      {isFreeShipping ? (
        <div className="neo-pill-mint flex items-start gap-2.5 p-3 rounded-xl text-xs font-bold text-emerald-900">
          <Sparkles className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
          <span>{t.cart.freeDeliveryQualified}</span>
        </div>
      ) : (
        <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/60 text-xs text-amber-900 space-y-2">
          <div className="flex items-center gap-2 font-semibold">
            <Truck className="h-4 w-4 text-amber-600 shrink-0" />
            <span>
              {locale === "bn"
                ? `সারাদেশে ফ্রি ডেলিভারি পেতে আর মাত্র ${formatPrice(freeShippingRemainingMinor, "BDT")} এর বই যোগ করুন!`
                : t.cart.freeDeliveryThresholdNotice.replace(
                    "{amount}",
                    (freeShippingRemainingMinor / 100).toFixed(0)
                  )}
            </span>
          </div>
          {/* Progress bar */}
          <div className="h-2 w-full rounded-full bg-amber-200/60 overflow-hidden">
            <div
              className="h-full bg-emerald-600 rounded-full transition-all duration-300"
              style={{
                width: `${Math.min(
                  100,
                  Math.round(((100000 - freeShippingRemainingMinor) / 100000) * 100)
                )}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* Financial Line Items */}
      <dl className="space-y-3 text-xs">
        <div className="flex items-center justify-between text-slate-600">
          <dt>{t.cart.subtotal}</dt>
          <dd className="font-bold text-slate-900">
            {formatPrice(subtotalMinor, "BDT")}
          </dd>
        </div>

        <div className="flex items-center justify-between text-slate-600">
          <dt>{t.cart.deliveryFee}</dt>
          <dd className="font-bold">
            {isFreeShipping ? (
              <span className="text-emerald-700 uppercase font-black">
                {locale === "bn" ? "ফ্রি" : "Free"}
              </span>
            ) : (
              <span className="text-slate-900">
                {formatPrice(shippingTotalMinor, "BDT")}
              </span>
            )}
          </dd>
        </div>

        <div className="border-t border-emerald-100/60 pt-3 flex items-baseline justify-between">
          <dt className="text-sm font-black text-slate-900">
            {t.cart.total}
          </dt>
          <dd className="text-xl font-black text-emerald-800">
            {formatPrice(totalMinor, "BDT")}
          </dd>
        </div>
      </dl>

      {/* Checkout CTA */}
      <div className="space-y-3 pt-2">
        <Link href="/checkout" className="block">
          <button
            type="button"
            className="neo-button-green w-full flex items-center justify-center gap-2 py-3 px-4 text-xs font-black rounded-xl shadow-md"
          >
            <span>{t.cart.proceedToCheckout}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </Link>

        <Link href="/books" className="block text-center">
          <span className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 transition-colors">
            ← {t.cart.continueShopping}
          </span>
        </Link>
      </div>

      {/* Trust Badges */}
      <div className="border-t border-emerald-100/60 pt-4 flex items-center justify-center gap-2 text-[11px] text-slate-500 font-medium">
        <ShieldCheck className="h-4 w-4 text-emerald-600" />
        <span>100% Genuine Books & Safe Checkout</span>
      </div>
    </div>
  );
}
