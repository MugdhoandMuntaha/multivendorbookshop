"use client";

import { Heart } from "lucide-react";
import { useWishlist } from "@/lib/wishlist/context";
import { WishlistItem } from "@/lib/wishlist/types";

interface WishlistHeartButtonProps {
  item: Omit<WishlistItem, "addedAt">;
  className?: string;
}

export function WishlistHeartButton({
  item,
  className = "absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full border border-slate-200/60 bg-white/95 text-slate-500 hover:text-rose-600 shadow-2xs transition-colors",
}: WishlistHeartButtonProps) {
  const { isWishlisted, toggleWishlist, isLoaded } = useWishlist();

  const inWishlist = isLoaded && isWishlisted(item.bookId);

  function handleToggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(item);
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={className}
      title={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart
        className={`h-4 w-4 transition-colors ${
          inWishlist ? "fill-rose-500 text-rose-500" : "text-slate-600 hover:text-rose-600"
        }`}
      />
    </button>
  );
}
