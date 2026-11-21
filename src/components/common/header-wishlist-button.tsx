"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/lib/wishlist/context";
import { useLanguage } from "@/lib/i18n/context";

export function HeaderWishlistButton() {
  const { items, isLoaded } = useWishlist();
  const { t } = useLanguage();

  const count = isLoaded ? items.length : 0;

  return (
    <Link href="/buyer/wishlist" className="hidden sm:inline-flex">
      <Button
        variant="ghost"
        size="sm"
        className="neo-button-light relative h-9 w-9 rounded-xl p-0 hover:text-emerald-700"
      >
        <Heart className="h-4 w-4 text-emerald-700" />
        <span className="sr-only">{t.common.wishlist}</span>
        {count > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-black text-white shadow-xs">
            {count > 99 ? "99+" : count}
          </span>
        )}
      </Button>
    </Link>
  );
}
