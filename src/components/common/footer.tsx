import Link from "next/link";
import { BookOpen, ShieldCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-muted/40 text-muted-foreground border-t py-12 text-sm">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-3">
            <div className="text-foreground flex items-center gap-2 text-lg font-bold">
              <BookOpen className="text-primary h-5 w-5" />
              <span>BookMarket</span>
            </div>
            <p className="text-xs leading-relaxed">
              A curated multivendor marketplace connecting independent bookshops
              and readers worldwide.
            </p>
          </div>

          <div>
            <h4 className="text-foreground mb-3 text-xs font-semibold tracking-wider uppercase">
              Explore
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/books" className="hover:text-foreground">
                  Browse All
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-foreground">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/vendors" className="hover:text-foreground">
                  Featured Sellers
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-foreground mb-3 text-xs font-semibold tracking-wider uppercase">
              Vendors
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/vendor/apply" className="hover:text-foreground">
                  Apply as Vendor
                </Link>
              </li>
              <li>
                <Link
                  href="/vendor/dashboard"
                  className="hover:text-foreground"
                >
                  Vendor Portal
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-foreground mb-3 text-xs font-semibold tracking-wider uppercase">
              Trust & Security
            </h4>
            <div className="flex items-start gap-2 text-xs">
              <ShieldCheck className="text-primary mt-0.5 h-4 w-4 shrink-0" />
              <span>
                Verified seller screening, RLS-protected checkout, and buyer
                protection.
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t pt-6 text-xs sm:flex-row">
          <p>© 2026 BookMarket Platform. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="text-muted-foreground">USD / Minor Units</span>
            <span className="text-muted-foreground">Cloudflare R2 Storage</span>
            <span className="text-muted-foreground">Supabase SSR</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
