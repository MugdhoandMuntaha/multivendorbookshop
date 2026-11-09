import Link from "next/link";
import { redirect } from "next/navigation";
import { Store, BookOpen, Package, Settings } from "lucide-react";
import { requireUser, getCurrentProfile } from "@/server/queries/auth";
import { getCurrentVendor } from "@/server/queries/vendor";

export default async function VendorPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireUser("/vendor/dashboard");
  const [{ profile }, vendor] = await Promise.all([
    getCurrentProfile(),
    getCurrentVendor(),
  ]);

  // If user is neither a vendor/admin nor has applied for vendor, guide them to application
  if (!vendor && profile?.role !== "vendor" && profile?.role !== "admin") {
    redirect("/vendor/apply");
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="flex flex-col gap-8 md:flex-row">
        {/* Vendor Sidebar */}
        <aside className="w-full shrink-0 space-y-4 md:w-64">
          <div className="bg-card space-y-1 rounded-xl border p-4 shadow-sm">
            <div className="text-foreground flex items-center gap-2 font-bold">
              <Store className="text-primary h-5 w-5" />
              <span>{vendor?.shop_name || "Vendor Portal"}</span>
            </div>
            <p className="text-muted-foreground truncate text-xs">
              {profile?.full_name} ({vendor?.status || profile?.role})
            </p>
          </div>

          <nav className="flex gap-1 text-sm font-medium md:flex-col">
            <Link
              href="/vendor/dashboard"
              className="hover:bg-muted flex items-center gap-2.5 rounded-lg px-3 py-2 transition-colors"
            >
              <Store className="text-muted-foreground h-4 w-4" />
              <span>Overview</span>
            </Link>
            <Link
              href="/vendor/books"
              className="hover:bg-muted flex items-center gap-2.5 rounded-lg px-3 py-2 transition-colors"
            >
              <BookOpen className="text-muted-foreground h-4 w-4" />
              <span>Book Inventory</span>
            </Link>
            <Link
              href="/vendor/orders"
              className="hover:bg-muted flex items-center gap-2.5 rounded-lg px-3 py-2 transition-colors"
            >
              <Package className="text-muted-foreground h-4 w-4" />
              <span>Orders & Fulfillment</span>
            </Link>
            <Link
              href="/vendor/settings"
              className="hover:bg-muted flex items-center gap-2.5 rounded-lg px-3 py-2 transition-colors"
            >
              <Settings className="text-muted-foreground h-4 w-4" />
              <span>Shop Settings</span>
            </Link>
          </nav>
        </aside>

        {/* Vendor Main Content Area */}
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
