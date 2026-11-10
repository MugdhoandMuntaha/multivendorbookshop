import Link from "next/link";
import Image from "next/image";
import { Star, ShoppingBag, Eye, Store } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { getR2PublicUrl } from "@/lib/r2/utils";
import { getServerLocale, getDictionary } from "@/lib/i18n/server";
import { Locale } from "@/lib/i18n/types";
import type { BookRow } from "@/server/queries/books";

interface BookCardProps {
  book: BookRow;
  locale?: Locale;
}

export async function BookCard({ book, locale }: BookCardProps) {
  const currentLocale = locale ?? (await getServerLocale());
  const t = getDictionary(currentLocale);

  const coverKey = book.book_images?.[0]?.r2_key;
  const coverUrl = getR2PublicUrl(coverKey);
  const vendorName = book.vendors?.shop_name || "Verified Bookseller";
  const vendorSlug = book.vendors?.slug || "#";

  // Calculate strike-through MRP price
  const originalPriceMinor = Math.round(book.price_minor * 1.2);
  const discountPercent = Math.round(
    ((originalPriceMinor - book.price_minor) / originalPriceMinor) * 100
  );

  return (
    <div className="neo-card neo-card-hover group relative flex flex-col justify-between p-3.5 sm:p-4">
      <div>
        {/* Book Cover Container with Aspect Ratio (3:4) & Tactile Rim */}
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl border border-emerald-950/5 bg-slate-50 shadow-[inset_0_2px_4px_rgba(0,0,0,0.03)]">
          <Link href={`/books/${book.id}`} className="block h-full w-full">
            <Image
              src={coverUrl}
              alt={book.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
            />
          </Link>

          {/* Discount Pill Badge (Vibrant Emerald & White) */}
          {discountPercent > 0 && (
            <Badge className="absolute top-2.5 left-2.5 bg-emerald-600 px-2 py-0.5 text-[10px] font-black text-white shadow-[0_2px_6px_rgba(5,150,105,0.35)] hover:bg-emerald-700">
              -{discountPercent}% {t.common.off}
            </Badge>
          )}

          {/* Condition Badge (Neomorphic Mint Pill) */}
          <Badge
            variant="outline"
            className="absolute top-2.5 right-2.5 border-emerald-200/90 bg-white/95 text-[10px] font-semibold text-emerald-800 capitalize shadow-xs backdrop-blur-md"
          >
            {book.condition.replace("_", " ")}
          </Badge>

          {/* Hover Quick Actions */}
          <div className="absolute inset-x-2 bottom-2 flex items-center justify-center gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <Link href={`/books/${book.id}`} className="w-full">
              <button
                type="button"
                className="neo-button-light flex h-8 w-full items-center justify-center gap-1.5 rounded-xl text-xs font-bold shadow-md"
              >
                <Eye className="h-3.5 w-3.5 text-emerald-600" />
                <span>{t.common.lookInside}</span>
              </button>
            </Link>
          </div>
        </div>

        {/* Book Details */}
        <div className="space-y-1.5 pt-3">
          {/* Vendor Tag */}
          <Link
            href={`/vendors/${vendorSlug}`}
            className="inline-flex max-w-full items-center gap-1 truncate text-[11px] font-medium text-emerald-700 transition-colors hover:text-emerald-900"
          >
            <Store className="h-3 w-3 shrink-0 text-emerald-600" />
            <span className="truncate">{vendorName}</span>
          </Link>

          {/* Title */}
          <h3 className="line-clamp-2 text-sm leading-snug font-bold text-slate-900 transition-colors group-hover:text-emerald-700">
            <Link href={`/books/${book.id}`}>{book.title}</Link>
          </h3>

          {/* Author */}
          <p className="truncate text-xs font-normal text-slate-500">
            {book.author}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-1.5 pt-0.5 text-xs">
            <div className="flex items-center text-amber-500">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span className="ml-1 text-xs font-bold text-slate-800">4.9</span>
            </div>
            <span className="text-[11px] text-slate-400">
              (48 {t.common.reviews})
            </span>
          </div>
        </div>
      </div>

      {/* Pricing & Add to Cart Footer */}
      <div className="mt-3.5 flex items-center justify-between gap-2 border-t border-emerald-100/60 pt-3">
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-black text-emerald-700">
              {formatPrice(book.price_minor, book.currency)}
            </span>
            <span className="text-xs text-slate-400 line-through">
              {formatPrice(originalPriceMinor, book.currency)}
            </span>
          </div>
          <span className="block text-[10px] font-semibold text-emerald-600">
            {currentLocale === "bn"
              ? `স্টকে আছে (${book.stock} টি)`
              : `${t.common.inStock} (${book.stock})`}
          </span>
        </div>

        <button
          type="button"
          className="neo-button-green flex h-8 shrink-0 items-center gap-1 rounded-xl px-3 text-xs font-bold"
        >
          <ShoppingBag className="h-3.5 w-3.5" />
          <span>{t.common.cart}</span>
        </button>
      </div>
    </div>
  );
}
