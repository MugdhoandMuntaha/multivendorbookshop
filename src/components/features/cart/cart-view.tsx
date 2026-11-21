"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ShoppingBag,
  Store,
  Plus,
  Minus,
  Trash2,
  Truck,
  ArrowRight,
  RotateCcw,
} from "lucide-react";
import { useCart } from "@/lib/cart/context";
import { useLanguage } from "@/lib/i18n/context";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { CartSummary } from "./cart-summary";

export function CartView() {
  const { items, updateQuantity, removeItem, clearCart, calculations, isLoaded } = useCart();
  const { t } = useLanguage();

  if (!isLoaded) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 space-y-6">
        <div className="neo-card p-12 rounded-2xl animate-pulse h-96" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16">
        <div className="neo-card p-12 sm:p-16 rounded-3xl text-center space-y-5 border border-emerald-950/5">
          <div className="h-20 w-20 rounded-3xl bg-emerald-100/70 text-emerald-800 flex items-center justify-center mx-auto shadow-inner">
            <ShoppingBag className="h-10 w-10 text-emerald-700" />
          </div>
          <div className="space-y-1.5 max-w-md mx-auto">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              {t.cart.emptyTitle}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
              {t.cart.emptySubtitle}
            </p>
          </div>
          <div>
            <Link
              href="/books"
              className="neo-button-green inline-flex items-center gap-2 px-6 py-3 text-xs font-bold rounded-xl shadow-md"
            >
              <span>{t.cart.browseBooks}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-100/60 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {t.cart.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            {t.cart.subtitle}
          </p>
        </div>

        <button
          type="button"
          onClick={clearCart}
          className="neo-button-light inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:text-rose-600 self-start sm:self-auto"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>{t.cart.clearCart}</span>
        </button>
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Multi-Vendor Packages (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {calculations.groups.map((group) => {
            return (
              <div
                key={group.vendorId}
                className="neo-card p-5 sm:p-6 rounded-2xl space-y-4 border border-emerald-950/5"
              >
                {/* Vendor Group Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-emerald-100/60">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                      <Store className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                        {t.cart.vendorPackage}
                      </div>
                      <Link
                        href={`/vendors/${group.vendorSlug}`}
                        className="text-sm font-bold text-slate-900 hover:text-emerald-700 transition-colors"
                      >
                        {group.vendorName}
                      </Link>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium self-start sm:self-auto">
                    <Truck className="h-3.5 w-3.5 text-emerald-600" />
                    <span>
                      Courier Delivery:{" "}
                      <strong className="text-slate-800">
                        {formatPrice(group.shippingFeeMinor, "BDT")}
                      </strong>
                    </span>
                  </div>
                </div>

                {/* Vendor Items List */}
                <div className="divide-y divide-slate-100">
                  {group.items.map((item) => {
                    const itemTotalMinor = item.priceMinor * item.qty;

                    return (
                      <div
                        key={item.bookId}
                        className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                      >
                        {/* Book Info */}
                        <div className="flex items-start gap-3.5 flex-1 min-w-0">
                          <div className="relative h-20 w-16 shrink-0 rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
                            <Image
                              src={item.coverUrl}
                              alt={item.title}
                              fill
                              className="object-cover"
                            />
                          </div>

                          <div className="space-y-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <Badge
                                variant="outline"
                                className="border-emerald-200 bg-emerald-50 text-[10px] font-bold text-emerald-800 capitalize py-0"
                              >
                                {item.condition.replace("_", " ")}
                              </Badge>
                            </div>

                            <h3 className="text-sm font-bold text-slate-900 truncate">
                              <Link
                                href={`/books/${item.bookId}`}
                                className="hover:text-emerald-700 transition-colors"
                              >
                                {item.title}
                              </Link>
                            </h3>
                            <p className="text-xs text-slate-500 truncate">
                              {item.author}
                            </p>
                            <div className="text-xs font-black text-emerald-800">
                              {formatPrice(item.priceMinor, item.currency)}
                            </div>
                          </div>
                        </div>

                        {/* Quantity Stepper & Subtotal */}
                        <div className="flex items-center justify-between w-full sm:w-auto gap-4 self-end sm:self-center">
                          {/* Stepper */}
                          <div className="flex items-center neo-card rounded-xl border border-emerald-950/5 p-1">
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(item.bookId, item.qty - 1)
                              }
                              className="neo-button-light h-6 w-6 rounded-lg flex items-center justify-center text-slate-600 hover:text-emerald-700"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-8 text-center text-xs font-black text-slate-900">
                              {item.qty}
                            </span>
                            <button
                              type="button"
                              disabled={item.qty >= item.stock}
                              onClick={() =>
                                updateQuantity(item.bookId, item.qty + 1)
                              }
                              className="neo-button-light h-6 w-6 rounded-lg flex items-center justify-center text-slate-600 hover:text-emerald-700 disabled:opacity-40"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>

                          {/* Line Total */}
                          <div className="w-20 text-right">
                            <span className="text-xs font-black text-slate-900 block">
                              {formatPrice(itemTotalMinor, item.currency)}
                            </span>
                          </div>

                          {/* Delete Item */}
                          <button
                            type="button"
                            onClick={() => removeItem(item.bookId)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 transition-colors"
                            title={t.cart.itemRemoved}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Package Footer */}
                <div className="pt-3 border-t border-emerald-100/60 flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>Package Subtotal</span>
                  <span className="text-emerald-800 font-black">
                    {formatPrice(group.subtotalMinor, "BDT")}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Order Summary & Checkout (4 cols) */}
        <div className="lg:col-span-4">
          <CartSummary />
        </div>
      </div>
    </div>
  );
}
