import Link from "next/link";
import {
  Store,
  BookOpen,
  Package,
  DollarSign,
  AlertTriangle,
  Plus,
  ArrowRight,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { requireRole } from "@/server/queries/auth";
import {
  getCurrentVendor,
  getVendorDashboardStats,
} from "@/server/queries/vendor";
import { formatPrice } from "@/lib/utils";

export default async function VendorDashboardPage() {
  await requireRole(["vendor", "admin"], "/vendor/dashboard");
  const vendor = await getCurrentVendor();

  if (!vendor) {
    return (
      <div className="space-y-4 rounded-xl border border-amber-500/20 bg-amber-500/10 p-6 text-center">
        <Store className="mx-auto h-10 w-10 text-amber-600 dark:text-amber-400" />
        <div>
          <h2 className="text-xl font-bold">No Active Vendor Profile</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            You are signed in, but have not registered a vendor bookstore yet.
          </p>
        </div>
        <Link href="/vendor/apply" className="inline-block">
          <Button className="gap-2">
            <span>Apply to Become a Vendor</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    );
  }

  const stats = await getVendorDashboardStats(vendor.id);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col justify-between gap-4 rounded-xl border border-stone-200/80 bg-white p-6 sm:flex-row sm:items-center shadow-2xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold tracking-tight text-slate-900">
              {vendor.shop_name}
            </h1>
            <Badge
              variant={vendor.status === "approved" ? "default" : "secondary"}
              className="capitalize"
            >
              {vendor.status}
            </Badge>
          </div>
          <p className="text-slate-500 text-xs font-normal">
            Slug: <span className="font-mono text-xs">/shop/{vendor.slug}</span>
            {" • "}
            Commission: {(vendor.commission_bps / 100).toFixed(1)}%
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/vendor/books/new">
            <Button className="gap-2 shadow-sm">
              <Plus className="h-4 w-4" />
              <span>Add Book</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Review Warning if pending */}
      {vendor.status === "pending" && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 text-amber-800 dark:text-amber-300">
          <Clock className="mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <p className="font-semibold">Shop Approval Pending</p>
            <p className="mt-0.5 text-xs">
              Your application is in queue for review. You can prepare book
              listings and configure your shop settings; items will go live once
              your vendor status is approved.
            </p>
          </div>
        </div>
      )}

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Books</CardTitle>
            <BookOpen className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <div className="px-6 pb-4">
            <div className="text-2xl font-bold">{stats.activeBooks}</div>
            <CardDescription className="text-xs">
              {stats.totalBooks} total listed titles
            </CardDescription>
          </div>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Orders
            </CardTitle>
            <Package className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <div className="px-6 pb-4">
            <div className="text-2xl font-bold">{stats.pendingOrders}</div>
            <CardDescription className="text-xs">
              Awaiting fulfillment
            </CardDescription>
          </div>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Low Stock Alerts
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          </CardHeader>
          <div className="px-6 pb-4">
            <div
              className={`text-2xl font-bold ${stats.lowStockBooks > 0 ? "text-amber-600 dark:text-amber-400" : ""}`}
            >
              {stats.lowStockBooks}
            </div>
            <CardDescription className="text-xs">
              Items with 2 or fewer copies
            </CardDescription>
          </div>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Delivered Sales
            </CardTitle>
            <DollarSign className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <div className="px-6 pb-4">
            <div className="text-2xl font-bold">
              {formatPrice(stats.totalEarningsMinor)}
            </div>
            <CardDescription className="text-xs">
              Net marketplace revenue
            </CardDescription>
          </div>
        </Card>
      </div>

      {/* Quick Actions & Helpful Links */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Quick Actions</CardTitle>
            <CardDescription>
              Common catalog and inventory tasks.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link
              href="/vendor/books/new"
              className="hover:bg-muted flex items-center justify-between rounded-lg border p-3 text-sm font-medium transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Plus className="text-primary h-4 w-4" />
                <span>Publish a New Book Listing</span>
              </div>
              <ArrowRight className="text-muted-foreground h-4 w-4" />
            </Link>

            <Link
              href="/vendor/books"
              className="hover:bg-muted flex items-center justify-between rounded-lg border p-3 text-sm font-medium transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <BookOpen className="text-primary h-4 w-4" />
                <span>Review & Edit Inventory</span>
              </div>
              <ArrowRight className="text-muted-foreground h-4 w-4" />
            </Link>

            <Link
              href="/vendor/settings"
              className="hover:bg-muted flex items-center justify-between rounded-lg border p-3 text-sm font-medium transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Store className="text-primary h-4 w-4" />
                <span>Edit Shop Profile & Shipping Fee</span>
              </div>
              <ArrowRight className="text-muted-foreground h-4 w-4" />
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Seller Guidelines & Best Practices
            </CardTitle>
            <CardDescription>
              Maximize your book sales and buyer ratings.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-3 text-xs">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600 dark:text-green-400" />
              <span>
                <strong>Accurate photos:</strong> Include front cover, back
                cover, and any signs of wear or annotations for used books.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600 dark:text-green-400" />
              <span>
                <strong>Fast dispatch:</strong> Books shipped within 24–48 hours
                receive higher marketplace search visibility.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600 dark:text-green-400" />
              <span>
                <strong>ISBN accuracy:</strong> Providing valid 10 or 13-digit
                ISBNs enables readers to discover your edition reliably.
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
