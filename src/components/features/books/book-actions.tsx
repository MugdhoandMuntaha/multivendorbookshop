"use client";

import { useState } from "react";
import {
  ShoppingBag,
  Zap,
  Heart,
  Plus,
  Minus,
  CheckCircle2,
  ShieldCheck,
  Truck,
  RotateCcw,
} from "lucide-react";
import { Dictionary, Locale } from "@/lib/i18n/types";

interface BookActionsProps {
  bookId: string;
  stock: number;
  dict: Dictionary;
  locale: Locale;
}

export function BookActions({
  stock,
  dict,
  locale,
}: BookActionsProps) {
  const [quantity, setQuantity] = useState(1);
  const [addedMessage, setAddedMessage] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const isOutOfStock = stock <= 0;

  function handleQuantityChange(delta: number) {
    setQuantity((prev) => {
      const next = prev + delta;
      if (next < 1) return 1;
      if (next > stock) return stock;
      return next;
    });
  }

  function handleAddToCart() {
    if (isOutOfStock) return;
    setAddedMessage(true);
    setTimeout(() => {
      setAddedMessage(false);
    }, 3000);
  }

  function handleBuyNow() {
    if (isOutOfStock) return;
    // In Phase 5 cart/checkout, will navigate to checkout.
    // For now, provide instant feedback
    setAddedMessage(true);
    setTimeout(() => {
      setAddedMessage(false);
    }, 3000);
  }

  return (
    <div className="space-y-5">
      {/* Stock Status Banner */}
      <div className="flex items-center gap-2">
        <span
          className={`h-2.5 w-2.5 rounded-full ${
            isOutOfStock ? "bg-rose-500" : "bg-emerald-500 animate-pulse"
          }`}
        />
        <span
          className={`text-xs font-bold ${
            isOutOfStock ? "text-rose-600" : "text-emerald-700"
          }`}
        >
          {isOutOfStock
            ? dict.bookDetail.outOfStock
            : locale === "bn"
            ? `স্টকে আছে (${stock} কপি অবশিষ্ট)`
            : `${dict.bookDetail.inStock} (${stock} ${dict.bookDetail.availableCopies})`}
        </span>
      </div>

      {/* Quantity Stepper */}
      {!isOutOfStock && (
        <div className="flex items-center gap-4">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            {dict.bookDetail.quantity}:
          </label>
          <div className="flex items-center neo-card rounded-xl border border-emerald-950/5 p-1">
            <button
              type="button"
              disabled={quantity <= 1}
              onClick={() => handleQuantityChange(-1)}
              className="neo-button-light h-7 w-7 rounded-lg flex items-center justify-center text-slate-600 disabled:opacity-40"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="w-10 text-center text-xs font-black text-slate-800">
              {quantity}
            </span>
            <button
              type="button"
              disabled={quantity >= stock}
              onClick={() => handleQuantityChange(1)}
              className="neo-button-light h-7 w-7 rounded-lg flex items-center justify-center text-slate-600 disabled:opacity-40"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-stretch gap-3">
        {/* Add to Cart */}
        <button
          type="button"
          disabled={isOutOfStock}
          onClick={handleAddToCart}
          className="neo-button-green flex-1 flex items-center justify-center gap-2 py-3 px-5 text-xs font-extrabold rounded-xl shadow-md disabled:opacity-50"
        >
          <ShoppingBag className="h-4 w-4" />
          <span>{dict.bookDetail.addToCart}</span>
        </button>

        {/* Buy Now (Express Cash on Delivery) */}
        <button
          type="button"
          disabled={isOutOfStock}
          onClick={handleBuyNow}
          className="neo-button-light flex-1 flex items-center justify-center gap-2 py-3 px-5 text-xs font-extrabold rounded-xl text-emerald-800 border-2 border-emerald-600/40 hover:bg-emerald-50 shadow-md disabled:opacity-50"
        >
          <Zap className="h-4 w-4 text-emerald-600" />
          <span>{dict.bookDetail.buyNow}</span>
        </button>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={() => setIsWishlisted(!isWishlisted)}
          className={`neo-button-light shrink-0 p-3 rounded-xl flex items-center justify-center transition-all ${
            isWishlisted ? "text-rose-600 bg-rose-50" : "text-slate-600"
          }`}
          title={dict.bookDetail.wishlist}
        >
          <Heart
            className={`h-4 w-4 ${isWishlisted ? "fill-rose-500 text-rose-500" : ""}`}
          />
        </button>
      </div>

      {/* Success Feedback Alert */}
      {addedMessage && (
        <div className="neo-pill-mint flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-emerald-900 animate-in fade-in slide-in-from-top-1">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>
            {locale === "bn"
              ? `${quantity} কপি কার্টে যোগ করা হয়েছে!`
              : `${quantity} ${quantity > 1 ? "copies" : "copy"} ${dict.bookDetail.addedToCart}`}
          </span>
        </div>
      )}

      {/* Guarantee & Delivery Highlights */}
      <div className="neo-card p-3.5 rounded-xl border border-emerald-950/5 space-y-2 text-xs">
        <div className="flex items-center gap-2 text-slate-700 font-semibold">
          <Truck className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{dict.bookDetail.vendorDelivery}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-700 font-semibold">
          <RotateCcw className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{dict.bookDetail.returnPolicy}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-700 font-semibold">
          <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{dict.bookDetail.cashOnDelivery}</span>
        </div>
      </div>
    </div>
  );
}
