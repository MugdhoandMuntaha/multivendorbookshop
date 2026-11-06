import Link from "next/link";
import { BookOpen, ShoppingBag, Store, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function Header() {
  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link
          href="/"
          className="text-primary flex items-center gap-2 text-xl font-bold tracking-tight"
        >
          <BookOpen className="text-primary h-6 w-6" />
          <span>BookMarket</span>
          <Badge variant="outline" className="ml-1 text-xs font-normal">
            Marketplace
          </Badge>
        </Link>

        {/* Navigation Links */}
        <nav className="text-muted-foreground hidden items-center gap-6 text-sm font-medium md:flex">
          <Link
            href="/books"
            className="hover:text-foreground transition-colors"
          >
            Browse Books
          </Link>
          <Link
            href="/categories"
            className="hover:text-foreground transition-colors"
          >
            Categories
          </Link>
          <Link
            href="/vendors"
            className="hover:text-foreground transition-colors"
          >
            Independent Vendors
          </Link>
        </nav>

        {/* User / Action Buttons */}
        <div className="flex items-center gap-3">
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

          <Link href="/cart">
            <Button variant="outline" size="sm" className="relative">
              <ShoppingBag className="h-4 w-4" />
              <span className="sr-only">Cart</span>
            </Button>
          </Link>

          <Link href="/login">
            <Button size="sm" className="items-center gap-1.5">
              <LogIn className="h-4 w-4" />
              <span>Sign In</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
