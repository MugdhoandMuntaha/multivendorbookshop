import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { getR2PublicUrl } from "@/lib/r2/utils";
import { getServerLocale } from "@/lib/i18n/server";
import { Locale } from "@/lib/i18n/types";
import type { BookRow } from "@/server/queries/books";
import { AddToCartButton } from "./add-to-cart-button";
import { WishlistHeartButton } from "./wishlist-heart-button";

interface BookCardProps {
  book: BookRow;
  locale?: Locale;
}

export async function BookCard({ book, locale }: BookCardProps) {
  const currentLocale = locale ?? (await getServerLocale());

  const coverKey = book.book_images?.[0]?.r2_key;
  const coverUrl = getR2PublicUrl(coverKey);
  const vendorName = book.vendors?.shop_name || "Verified Bookseller";
  const vendorSlug = book.vendors?.slug || "vendor";

  // Calculate strike-through MRP price (approx 20% higher for discount strike)
  const originalPriceMinor = Math.round(book.price_minor * 1.25);

  const cartItem = {
    bookId: book.id,
    vendorId: book.vendor_id,
    vendorName,
    vendorSlug,
    title: book.title,
    author: book.author,
    condition: book.condition,
    priceMinor: book.price_minor,
    currency: book.currency,
    stock: book.stock,
    coverUrl,
  };

  const wishlistItem = {
    bookId: book.id,
    vendorId: book.vendor_id,
    vendorName,
    vendorSlug,
    title: book.title,
    author: book.author,
    priceMinor: book.price_minor,
    currency: book.currency,
    stock: book.stock,
    condition: book.condition,
    coverUrl,
  };

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-slate-100 bg-white p-2.5 sm:p-3 shadow-xs transition-all hover:border-emerald-200 hover:shadow-md">
      <div>
        {/* Book Cover Container with Aspect Ratio (3:4.2) */}
        <div className="relative aspect-[3/4.2] w-full overflow-hidden rounded-xl bg-slate-50">
          <Link href={`/books/${book.id}`} className="block h-full w-full">
            <Image
              src={coverUrl}
              alt={book.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
            />
          </Link>

          {/* Floating Heart Wishlist Button on Top-Right */}
          <WishlistHeartButton item={wishlistItem} />
        </div>

        {/* Book Info */}
        <div className="pt-2.5 space-y-1">
          <h3 className="line-clamp-1 text-xs sm:text-[13px] font-bold text-slate-900 transition-colors group-hover:text-emerald-800">
            <Link href={`/books/${book.id}`}>{book.title}</Link>
          </h3>

          <p className="line-clamp-1 text-[11px] text-slate-500">
            {book.author}
          </p>

          {/* Star Rating */}
          <div className="flex items-center gap-1 text-[11px] text-slate-600">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            <span className="font-semibold text-slate-800">4.8</span>
            <span className="text-slate-400 text-[10px]">(12k)</span>
          </div>
        </div>
      </div>

      {/* Price & Action Row */}
      <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2.5">
        <div className="flex items-baseline gap-1.5">
          <span className="text-sm font-black text-slate-900">
            {formatPrice(book.price_minor, book.currency, currentLocale === "bn" ? "bn-BD" : "en-BD")}
          </span>
          <span className="text-[11px] text-slate-400 line-through">
            {formatPrice(originalPriceMinor, book.currency, currentLocale === "bn" ? "bn-BD" : "en-BD")}
          </span>
        </div>

        <AddToCartButton
          item={cartItem}
          variant="icon"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#0c3823] hover:bg-[#124d31] text-white shadow-xs transition-colors"
        />
      </div>
    </div>
  );
}
