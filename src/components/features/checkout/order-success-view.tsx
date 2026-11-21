"use client";

import Link from "next/link";
import Image from "next/image";
import {
  CheckCircle2,
  Package,
  Truck,
  ArrowRight,
  Store,
  MapPin,
  Calendar,
  CreditCard,
  Banknote,
} from "lucide-react";
import { OrderDetail } from "@/server/queries/orders";
import { useLanguage } from "@/lib/i18n/context";
import { formatPrice } from "@/lib/utils";
import { getR2PublicUrl } from "@/lib/r2/utils";
import { Badge } from "@/components/ui/badge";

interface OrderSuccessViewProps {
  order: OrderDetail;
}

export function OrderSuccessView({ order }: OrderSuccessViewProps) {
  const { t } = useLanguage();

  const isPaid = order.payment_status === "paid";
  const isCod = order.payment_provider === "cod";

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* 1. Celebration Banner */}
      <div className="neo-card p-8 sm:p-10 rounded-3xl text-center space-y-4 border border-emerald-950/5 relative overflow-hidden">
        <div className="h-16 w-16 rounded-3xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="h-9 w-9 text-emerald-600" />
        </div>

        <div className="space-y-1.5 max-w-lg mx-auto">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {t.checkout.orderConfirmedTitle}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
            {t.checkout.orderConfirmedSubtitle}
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200/80 text-xs font-bold text-emerald-900">
          <span>{t.checkout.orderNumber}:</span>
          <code className="font-mono text-emerald-700 font-black">
            {order.id}
          </code>
        </div>
      </div>

      {/* 2. Order Details Grid (Address, Payment & Status) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Delivery Address */}
        <div className="neo-card p-5 rounded-2xl space-y-3 text-xs border border-emerald-950/5">
          <div className="flex items-center gap-2 pb-2 border-b border-emerald-100/60 font-bold text-slate-900">
            <MapPin className="h-4 w-4 text-emerald-600" />
            <span>{t.checkout.deliveryTo}</span>
          </div>
          <div className="space-y-1 text-slate-700">
            <p className="font-bold text-slate-900">
              {order.shippingAddressParsed.fullName}
            </p>
            <p className="text-slate-500 font-medium">
              {order.shippingAddressParsed.phone}
            </p>
            <p className="leading-relaxed">
              {order.shippingAddressParsed.streetAddress}
            </p>
            <p className="font-semibold text-emerald-800">
              {order.shippingAddressParsed.district},{" "}
              {order.shippingAddressParsed.division}
            </p>
          </div>
        </div>

        {/* Payment Information */}
        <div className="neo-card p-5 rounded-2xl space-y-3 text-xs border border-emerald-950/5">
          <div className="flex items-center gap-2 pb-2 border-b border-emerald-100/60 font-bold text-slate-900">
            {isCod ? (
              <Banknote className="h-4 w-4 text-emerald-600" />
            ) : (
              <CreditCard className="h-4 w-4 text-emerald-600" />
            )}
            <span>{t.checkout.paymentMethod}</span>
          </div>
          <div className="space-y-2 text-slate-700">
            <div className="flex items-center justify-between">
              <span className="font-medium text-slate-500">Method</span>
              <span className="font-bold uppercase text-slate-900">
                {isCod ? "Cash on Delivery" : "Instant Online"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium text-slate-500">Status</span>
              <Badge
                className={
                  isPaid
                    ? "bg-emerald-600 text-white font-bold text-[10px]"
                    : "bg-amber-500 text-white font-bold text-[10px]"
                }
              >
                {isPaid ? "Paid" : "Due on Delivery"}
              </Badge>
            </div>
            {order.payment_reference && (
              <div className="pt-1 text-[11px] text-slate-400 font-mono truncate">
                Ref: {order.payment_reference}
              </div>
            )}
          </div>
        </div>

        {/* Fulfillment Status */}
        <div className="neo-card p-5 rounded-2xl space-y-3 text-xs border border-emerald-950/5">
          <div className="flex items-center gap-2 pb-2 border-b border-emerald-100/60 font-bold text-slate-900">
            <Truck className="h-4 w-4 text-emerald-600" />
            <span>Fulfillment</span>
          </div>
          <div className="space-y-2 text-slate-700">
            <div className="flex items-center justify-between">
              <span className="font-medium text-slate-500">Dispatch</span>
              <span className="font-bold text-emerald-800 capitalize">
                {order.status}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
              <Calendar className="h-3.5 w-3.5" />
              <span>{new Date(order.created_at).toLocaleDateString()}</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-snug">
              Packages are prepared by verified sellers and dispatched via RTDS courier.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Ordered Items List */}
      <div className="neo-card p-6 rounded-2xl space-y-4 border border-emerald-950/5">
        <div className="flex items-center gap-2 pb-3 border-b border-emerald-100/60 font-bold text-slate-900 text-sm">
          <Package className="h-4 w-4 text-emerald-600" />
          <span>{t.checkout.orderReview}</span>
        </div>

        <div className="divide-y divide-slate-100">
          {order.items.map((it) => {
            const coverUrl = getR2PublicUrl(it.book?.coverUrl);

            return (
              <div
                key={it.id}
                className="py-3.5 flex items-center justify-between gap-4 text-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative h-14 w-11 rounded-lg overflow-hidden bg-slate-50 border border-slate-200 shrink-0">
                    <Image
                      src={coverUrl}
                      alt={it.book?.title || "Book"}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-slate-900 truncate max-w-sm">
                      {it.book?.title || "Book Title"}
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      {it.book?.author || "Author"}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-400">
                      <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                        <Store className="h-3 w-3" />
                        {it.vendor?.shop_name || "Bookseller"}
                      </span>
                      <span>•</span>
                      <span>Qty: {it.qty}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-black text-slate-900 block text-xs">
                    {formatPrice(it.unit_price_minor * it.qty, order.currency)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Financial Totals */}
        <div className="border-t border-emerald-100/60 pt-4 flex flex-col items-end space-y-1.5 text-xs">
          <div className="flex items-center justify-between w-full max-w-xs text-slate-600">
            <span>{t.cart.subtotal}:</span>
            <span className="font-bold text-slate-900">
              {formatPrice(order.subtotal_minor, order.currency)}
            </span>
          </div>
          <div className="flex items-center justify-between w-full max-w-xs text-slate-600">
            <span>{t.cart.deliveryFee}:</span>
            <span className="font-bold text-slate-900">
              {order.shipping_minor === 0
                ? "Free"
                : formatPrice(order.shipping_minor, order.currency)}
            </span>
          </div>
          <div className="flex items-center justify-between w-full max-w-xs text-sm font-black text-emerald-800 border-t border-slate-200 pt-2">
            <span>{t.cart.total}:</span>
            <span className="text-base font-black">
              {formatPrice(order.total_minor, order.currency)}
            </span>
          </div>
        </div>
      </div>

      {/* 4. Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <Link href="/buyer/orders">
          <button
            type="button"
            className="neo-button-green flex items-center justify-center gap-2 py-3 px-6 text-xs font-black rounded-xl shadow-md"
          >
            <span>{t.checkout.viewOrders}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </Link>

        <Link href="/books">
          <button
            type="button"
            className="neo-button-light flex items-center justify-center gap-2 py-3 px-6 text-xs font-black rounded-xl text-slate-700"
          >
            <span>{t.cart.continueShopping}</span>
          </button>
        </Link>
      </div>
    </div>
  );
}
