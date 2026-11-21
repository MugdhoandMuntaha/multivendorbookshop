"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart/context";
import { useLanguage } from "@/lib/i18n/context";

export function HeaderCartButton() {
  const { calculations, isLoaded } = useCart();
  const { t } = useLanguage();

  const count = isLoaded ? calculations.itemsCount : 0;

  return (
    <Link href="/cart">
      <Button
        variant="outline"
        size="sm"
        className="neo-button-light relative h-9 gap-2 rounded-xl border-emerald-200/80 px-3.5 font-bold text-emerald-800"
      >
        <ShoppingBag className="h-4 w-4 text-emerald-600" />
        <span className="hidden text-xs sm:inline">{t.common.cart}</span>
        {count > 0 && (
          <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-emerald-600 px-1.5 text-[10px] font-black text-white shadow-xs animate-in zoom-in-50">
            {count > 99 ? "99+" : count}
          </span>
        )}
      </Button>
    </Link>
  );
}
