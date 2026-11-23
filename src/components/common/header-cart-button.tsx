"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart/context";
import { useLanguage } from "@/lib/i18n/context";

export function HeaderCartButton() {
  const { calculations, isLoaded } = useCart();
  const { locale } = useLanguage();

  const count = isLoaded ? calculations.itemsCount : 0;

  return (
    <Link href="/cart" className="relative">
      <Button
        variant="ghost"
        size="sm"
        className="flex h-9 items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 font-bold text-slate-800 hover:border-emerald-700 hover:text-emerald-900 shadow-2xs"
      >
        <ShoppingBag className="h-4 w-4 text-emerald-800" />
        <span className="text-xs font-bold">{locale === "bn" ? "কার্ট" : "Cart"}</span>
        <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] font-black text-white">
          {count > 99 ? "99+" : count}
        </span>
      </Button>
    </Link>
  );
}
