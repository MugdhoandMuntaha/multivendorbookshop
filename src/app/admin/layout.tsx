import Link from "next/link";
import {
  ShieldAlert,
  Users,
  BookOpen,
  Layers,
  ShoppingBag,
} from "lucide-react";
import { requireRole } from "@/server/queries/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile } = await requireRole(["admin"], "/admin/dashboard");

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="flex flex-col gap-8 md:flex-row">
        {/* Admin Sidebar */}
        <aside className="w-full shrink-0 space-y-4 md:w-64">
          <div className="bg-card space-y-1 rounded-xl border p-4">
            <div className="text-destructive flex items-center gap-2 font-bold">
              <ShieldAlert className="h-5 w-5" />
              <span>Admin Console</span>
            </div>
            <p className="text-muted-foreground truncate text-xs">
              {profile?.full_name}
            </p>
          </div>

          <nav className="flex gap-1 text-sm font-medium md:flex-col">
            <Link
              href="/admin/dashboard"
              className="hover:bg-muted flex items-center gap-2.5 rounded-lg px-3 py-2 transition-colors"
            >
              <ShieldAlert className="text-muted-foreground h-4 w-4" />
              <span>Overview</span>
            </Link>
            <Link
              href="/admin/vendors"
              className="hover:bg-muted flex items-center gap-2.5 rounded-lg px-3 py-2 transition-colors"
            >
              <Users className="text-muted-foreground h-4 w-4" />
              <span>Vendor Approvals</span>
            </Link>
            <Link
              href="/admin/books"
              className="hover:bg-muted flex items-center gap-2.5 rounded-lg px-3 py-2 transition-colors"
            >
              <BookOpen className="text-muted-foreground h-4 w-4" />
              <span>Listing Moderation</span>
            </Link>
            <Link
              href="/admin/categories"
              className="hover:bg-muted flex items-center gap-2.5 rounded-lg px-3 py-2 transition-colors"
            >
              <Layers className="text-muted-foreground h-4 w-4" />
              <span>Categories</span>
            </Link>
            <Link
              href="/admin/orders"
              className="hover:bg-muted flex items-center gap-2.5 rounded-lg px-3 py-2 transition-colors"
            >
              <ShoppingBag className="text-muted-foreground h-4 w-4" />
              <span>Marketplace Orders</span>
            </Link>
          </nav>
        </aside>

        {/* Admin Main Content Area */}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
