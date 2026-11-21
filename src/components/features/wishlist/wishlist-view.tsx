"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag, Trash2, ArrowRight, Store } from "lucide-react";
import { useWishlist } from "@/lib/wishlist/context";
import { useCart } from "@/lib/cart/context";
import { useLanguage } from "@/lib/i18n/context";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export function WishlistView() {
  const { items, removeItem, isLoaded } = useWishlist();
  const { addItem } = useCart();
  const { t } = useLanguage();

  if (!isLoaded) {
    return (
      <div className="neo-card p-12 rounded-2xl animate-pulse h-80" />
    );
  }

  if (items.length === 0) {
    return (
      <div className="neo-card p-12 sm:p-16 rounded-3xl text-center space-y-5 border border-emerald-950/5">
        <div className="h-20 w-20 rounded-3xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto shadow-inner">
          <Heart className="h-10 w-10 text-rose-500" />
        </div>
        <div className="space-y-1.5 max-w-md mx-auto">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            {t.wishlist.emptyTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
            {t.wishlist.emptySubtitle}
          </p>
        </div>
        <div>
          <Link
            href="/books"
            className="neo-button-green inline-flex items-center gap-2 px-6 py-3 text-xs font-bold rounded-xl shadow-md"
          >
            <span>{t.wishlist.discoverTitles}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  function handleMoveToCart(item: (typeof items)[0]) {
    addItem(
      {
        bookId: item.bookId,
        vendorId: item.vendorId || "default-vendor",
        vendorName: item.vendorName,
        vendorSlug: item.vendorSlug,
        title: item.title,
        author: item.author,
        priceMinor: item.priceMinor,
        currency: item.currency,
        condition: item.condition,
        stock: item.stock,
        coverUrl: item.coverUrl,
      },
      1
    );
    removeItem(item.bookId);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-emerald-100/60 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {t.wishlist.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            {t.wishlist.subtitle}
          </p>
        </div>

        <span className="neo-pill-mint px-3 py-1 text-xs font-bold text-emerald-800">
          {items.length} {t.wishlist.savedItems}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((item) => {
          return (
            <div
              key={item.bookId}
              className="neo-card neo-card-hover p-4 rounded-2xl flex flex-col justify-between group space-y-3"
            >
              <div>
                <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-slate-50 border border-slate-200">
                  <Image
                    src={item.coverUrl}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge
                    variant="outline"
                    className="absolute top-2 right-2 border-emerald-200 bg-white/95 text-[10px] font-bold text-emerald-800 capitalize"
                  >
                    {item.condition.replace("_", " ")}
                  </Badge>
                </div>

                <div className="pt-3 space-y-1">
                  <div className="flex items-center gap-1 text-[11px] text-emerald-700 truncate">
                    <Store className="h-3 w-3 shrink-0" />
                    <span className="truncate">{item.vendorName}</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 line-clamp-2">
                    <Link
                      href={`/books/${item.bookId}`}
                      className="hover:text-emerald-700 transition-colors"
                    >
                      {item.title}
                    </Link>
                  </h3>
                  <p className="text-xs text-slate-500 truncate">{item.author}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-emerald-100/60 flex items-center justify-between">
                <span className="text-sm font-black text-emerald-800">
                  {formatPrice(item.priceMinor, item.currency)}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => removeItem(item.bookId)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 transition-colors"
                    title={t.wishlist.remove}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    disabled={item.stock <= 0}
                    onClick={() => handleMoveToCart(item)}
                    className="neo-button-green flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg shadow-xs disabled:opacity-40"
                  >
                    <ShoppingBag className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">{t.wishlist.moveToCart}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
