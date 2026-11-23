"use client";

import Link from "next/link";
import { LogOut, Package, Store, ShieldAlert, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { signOut } from "@/server/actions/auth";
import { useLanguage } from "@/lib/i18n/context";
import type { Database } from "@/types/database";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export function UserNav({ profile }: { profile: Profile | null }) {
  const { t, locale } = useLanguage();

  if (!profile) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/login">
          <button
            type="button"
            className="flex h-9 items-center justify-center rounded-full bg-[#0c3823] hover:bg-[#124d31] px-5 text-xs font-bold text-white shadow-xs transition-all hover:scale-105"
          >
            {locale === "bn" ? "লগইন / সাইন আপ" : "Login / Sign Up"}
          </button>
        </Link>
      </div>
    );
  }

  const roleBadgeVariant =
    profile.role === "admin"
      ? "destructive"
      : profile.role === "vendor"
        ? "default"
        : "secondary";

  return (
    <div className="flex items-center gap-2.5">
      {/* Role-specific Quick Navigation */}
      {profile.role === "admin" && (
        <Link href="/admin/dashboard">
          <Button
            variant="outline"
            size="sm"
            className="neo-button-light hidden items-center gap-1.5 rounded-xl border-red-200 text-xs font-bold text-red-600 hover:bg-red-50 sm:inline-flex"
          >
            <ShieldAlert className="h-3.5 w-3.5 text-red-600" />
            <span>{t.common.adminPortal}</span>
          </Button>
        </Link>
      )}

      {profile.role === "vendor" && (
        <Link href="/vendor/dashboard">
          <button
            type="button"
            className="neo-button-light hidden h-9 items-center gap-1.5 rounded-xl px-3 text-xs font-bold sm:inline-flex"
          >
            <Store className="h-3.5 w-3.5 text-emerald-600" />
            <span>{t.common.vendorPortal}</span>
          </button>
        </Link>
      )}

      {profile.role === "buyer" && (
        <Link href="/vendor/apply">
          <Button
            variant="ghost"
            size="sm"
            className="hidden items-center gap-1.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-50 sm:inline-flex"
          >
            <Store className="h-3.5 w-3.5 text-emerald-600" />
            <span>{t.common.becomeVendor}</span>
          </Button>
        </Link>
      )}

      {/* Buyer Quick Links */}
      <Link href="/buyer/wishlist">
        <Button
          variant="ghost"
          size="sm"
          className="neo-button-light hidden h-9 w-9 rounded-xl p-0 hover:text-emerald-700 sm:inline-flex"
        >
          <Heart className="h-4 w-4 text-emerald-700" />
          <span className="sr-only">{t.common.wishlist}</span>
        </Button>
      </Link>

      <Link href="/buyer/orders">
        <Button
          variant="ghost"
          size="sm"
          className="neo-button-light hidden h-9 w-9 rounded-xl p-0 hover:text-emerald-700 sm:inline-flex"
        >
          <Package className="h-4 w-4 text-emerald-700" />
          <span className="sr-only">Orders</span>
        </Button>
      </Link>

      {/* User Info & Sign Out */}
      <div className="flex items-center gap-2 border-l border-emerald-100 pl-2.5">
        <div className="hidden flex-col text-right lg:flex">
          <span className="max-w-[120px] truncate text-xs leading-tight font-bold text-slate-800">
            {profile.full_name}
          </span>
          <span className="text-[10px] font-medium text-emerald-600 capitalize">
            {profile.role}
          </span>
        </div>

        <Badge
          variant={roleBadgeVariant}
          className="rounded-lg px-2 py-0.5 text-[10px] font-bold capitalize shadow-2xs"
        >
          {profile.role}
        </Badge>

        <form action={() => signOut()}>
          <Button
            type="submit"
            variant="ghost"
            size="sm"
            className="h-8 w-8 rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
            title={t.common.signOut}
          >
            <LogOut className="h-4 w-4" />
            <span className="sr-only">{t.common.signOut}</span>
          </Button>
        </form>
      </div>
    </div>
  );
}
