"use client";

import Link from "next/link";
import { LogOut, Package, Store, ShieldAlert, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { signOut } from "@/server/actions/auth";
import type { Database } from "@/types/database";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export function UserNav({ profile }: { profile: Profile | null }) {
  if (!profile) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/vendor/apply">
          <Button
            variant="ghost"
            size="sm"
            className="hidden items-center gap-1.5 sm:inline-flex"
          >
            <Store className="h-4 w-4" />
            <span>Sell Books</span>
          </Button>
        </Link>
        <Link href="/login">
          <Button size="sm">Sign In</Button>
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
    <div className="flex items-center gap-3">
      {/* Role-specific Quick Navigation */}
      {profile.role === "admin" && (
        <Link href="/admin/dashboard">
          <Button
            variant="outline"
            size="sm"
            className="border-destructive/40 text-destructive hover:bg-destructive/10 hidden items-center gap-1.5 sm:inline-flex"
          >
            <ShieldAlert className="h-3.5 w-3.5" />
            <span>Admin</span>
          </Button>
        </Link>
      )}

      {profile.role === "vendor" && (
        <Link href="/vendor/dashboard">
          <Button
            variant="outline"
            size="sm"
            className="hidden items-center gap-1.5 sm:inline-flex"
          >
            <Store className="text-primary h-3.5 w-3.5" />
            <span>Vendor Portal</span>
          </Button>
        </Link>
      )}

      {profile.role === "buyer" && (
        <Link href="/vendor/apply">
          <Button
            variant="ghost"
            size="sm"
            className="hidden items-center gap-1.5 sm:inline-flex"
          >
            <Store className="h-3.5 w-3.5" />
            <span>Become Vendor</span>
          </Button>
        </Link>
      )}

      {/* Buyer Quick Links */}
      <Link href="/buyer/wishlist">
        <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
          <Heart className="h-4 w-4" />
          <span className="sr-only">Wishlist</span>
        </Button>
      </Link>

      <Link href="/buyer/orders">
        <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
          <Package className="h-4 w-4" />
          <span className="sr-only">Orders</span>
        </Button>
      </Link>

      {/* User Info & Sign Out */}
      <div className="flex items-center gap-2 border-l pl-2">
        <div className="hidden flex-col text-right lg:flex">
          <span className="max-w-[120px] truncate text-xs leading-tight font-semibold">
            {profile.full_name}
          </span>
          <span className="text-muted-foreground text-[10px] capitalize">
            {profile.role}
          </span>
        </div>

        <Badge
          variant={roleBadgeVariant}
          className="px-1.5 py-0.5 text-[10px] capitalize"
        >
          {profile.role}
        </Badge>

        <form action={() => signOut()}>
          <Button
            type="submit"
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-destructive h-8 w-8 p-2"
            title="Sign Out"
          >
            <LogOut className="h-4 w-4" />
            <span className="sr-only">Sign out</span>
          </Button>
        </form>
      </div>
    </div>
  );
}
