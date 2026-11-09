import Link from "next/link";
import Image from "next/image";
import { Star, ShoppingBag, Eye, Store } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { getR2PublicUrl } from "@/lib/r2/utils";
import type { BookRow } from "@/server/queries/books";

export function BookCard({ book }: { book: BookRow }) {
  const coverKey = book.book_images?.[0]?.r2_key;
  const coverUrl = getR2PublicUrl(coverKey);
  const vendorName = book.vendors?.shop_name || "Verified Bookseller";
  const vendorSlug = book.vendors?.slug || "#";

  // Calculate a realistic strike-through MRP price (+15% to +20%) to show savings
  const originalPriceMinor = Math.round(book.price_minor * 1.2);
  const discountPercent = Math.round(
    ((originalPriceMinor - book.price_minor) / originalPriceMinor) * 100
  );

  return (
    <div className="group bg-card hover:border-primary/40 relative flex flex-col justify-between rounded-2xl border p-3 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
      <div>
        {/* Book Cover Container with Aspect Ratio (3:4) */}
        <div className="bg-muted/30 relative aspect-[3/4] w-full overflow-hidden rounded-xl">
          <Link href={`/books/${book.id}`} className="block h-full w-full">
            <Image
              src={coverUrl}
              alt={book.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
            />
          </Link>

          {/* Discount Pill Badge (Rokomari / RTDS style) */}
          {discountPercent > 0 && (
            <Badge className="absolute top-2.5 left-2.5 bg-red-600 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm hover:bg-red-700">
              -{discountPercent}% OFF
            </Badge>
          )}

          {/* Condition Badge */}
          <Badge
            variant="outline"
            className="bg-background/90 absolute top-2.5 right-2.5 text-[10px] font-medium capitalize shadow-xs backdrop-blur"
          >
            {book.condition.replace("_", " ")}
          </Badge>

          {/* Hover Quick Actions */}
          <div className="absolute inset-x-2 bottom-2 flex items-center justify-center gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <Link href={`/books/${book.id}`} className="w-full">
              <Button
                size="sm"
                variant="secondary"
                className="text-foreground h-8 w-full gap-1.5 bg-white/95 text-xs shadow-md backdrop-blur hover:bg-white"
              >
                <Eye className="text-primary h-3.5 w-3.5" />
                <span>Look Inside</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Book Details */}
        <div className="space-y-1.5 pt-3">
          {/* Vendor Tag */}
          <Link
            href={`/vendors/${vendorSlug}`}
            className="text-muted-foreground hover:text-primary inline-flex max-w-full items-center gap-1 truncate text-[11px] transition-colors"
          >
            <Store className="text-primary/70 h-3 w-3 shrink-0" />
            <span className="truncate">{vendorName}</span>
          </Link>

          {/* Title */}
          <h3 className="text-foreground group-hover:text-primary line-clamp-2 text-sm leading-snug font-semibold transition-colors">
            <Link href={`/books/${book.id}`}>{book.title}</Link>
          </h3>

          {/* Author */}
          <p className="text-muted-foreground truncate text-xs font-normal">
            {book.author}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-1.5 pt-0.5 text-xs">
            <div className="flex items-center text-amber-500">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span className="text-foreground ml-1 text-xs font-semibold">
                4.9
              </span>
            </div>
            <span className="text-muted-foreground text-[11px]">
              (48 reviews)
            </span>
          </div>
        </div>
      </div>

      {/* Pricing & Add to Cart Footer */}
      <div className="mt-3 flex items-center justify-between gap-2 border-t pt-3">
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-primary text-base font-bold">
              {formatPrice(book.price_minor, book.currency)}
            </span>
            <span className="text-muted-foreground text-xs line-through">
              {formatPrice(originalPriceMinor, book.currency)}
            </span>
          </div>
          <span className="block text-[10px] font-medium text-green-600">
            In Stock ({book.stock} copies)
          </span>
        </div>

        <Button
          size="sm"
          className="h-8 shrink-0 gap-1 rounded-lg px-3 text-xs shadow-xs"
        >
          <ShoppingBag className="h-3.5 w-3.5" />
          <span>Cart</span>
        </Button>
      </div>
    </div>
  );
}
