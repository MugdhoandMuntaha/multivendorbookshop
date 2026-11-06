import Link from "next/link";
import {
  BookOpen,
  ShoppingBag,
  Store,
  ShieldCheck,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function HomePage() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-16 px-4 py-12 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <section className="from-primary/5 via-primary/[0.02] relative overflow-hidden rounded-3xl border bg-gradient-to-b to-transparent p-8 sm:p-12 lg:p-16">
        <div className="max-w-3xl space-y-6">
          <Badge variant="secondary" className="px-3 py-1 text-sm font-medium">
            <Sparkles className="text-primary mr-1.5 inline h-3.5 w-3.5" />
            Independent Bookseller Marketplace
          </Badge>
          <h1 className="text-foreground text-4xl leading-tight font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Discover rare, vintage, and new books from independent sellers.
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed sm:text-xl">
            Support local bookstores and independent sellers worldwide. Add
            books from multiple vendors into a single cart with unified
            checkout.
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <Link href="/books">
              <Button size="lg" className="gap-2">
                <ShoppingBag className="h-4 w-4" />
                Explore Books
              </Button>
            </Link>
            <Link href="/vendor/apply">
              <Button size="lg" variant="outline" className="gap-2">
                <Store className="h-4 w-4" />
                Become a Vendor
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <div className="bg-primary/10 text-primary mb-2 flex h-10 w-10 items-center justify-center rounded-xl">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <CardTitle className="text-lg">Unified Multi-Vendor Cart</CardTitle>
            <CardDescription>
              Buy from multiple independent bookshops in a single purchase with
              automated per-vendor fulfillment tracking.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <div className="bg-primary/10 text-primary mb-2 flex h-10 w-10 items-center justify-center rounded-xl">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <CardTitle className="text-lg">
              Verified Sellers & Reviews
            </CardTitle>
            <CardDescription>
              Every vendor is vetted by marketplace admins. Only verified buyers
              who ordered can post ratings and reviews.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <div className="bg-primary/10 text-primary mb-2 flex h-10 w-10 items-center justify-center rounded-xl">
              <BookOpen className="h-5 w-5" />
            </div>
            <CardTitle className="text-lg">
              Curated Conditions & ISBNs
            </CardTitle>
            <CardDescription>
              Filter books by precise condition grades: New, Like New, Good, or
              Fair with high-resolution direct image uploads.
            </CardDescription>
          </CardHeader>
        </Card>
      </section>
    </div>
  );
}
