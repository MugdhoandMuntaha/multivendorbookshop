import { requireRole } from "@/server/queries/auth";
import { getCurrentVendor, getCategories } from "@/server/queries/vendor";
import { BookForm } from "@/components/features/vendor/book-form";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function NewBookPage() {
  await requireRole(["vendor", "admin"], "/vendor/books/new");
  const vendor = await getCurrentVendor();

  if (!vendor) {
    return (
      <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-6 text-center">
        <AlertCircle className="mx-auto h-8 w-8 text-amber-600 dark:text-amber-400" />
        <h2 className="mt-2 text-lg font-bold">Vendor Account Required</h2>
        <p className="text-muted-foreground text-sm">
          You must apply for a vendor account before listing books.
        </p>
        <Link href="/vendor/apply" className="mt-4 inline-block">
          <Button>Apply for Vendor Account</Button>
        </Link>
      </div>
    );
  }

  const categories = await getCategories();

  return (
    <div className="space-y-6">
      <BookForm categories={categories} isEditing={false} />
    </div>
  );
}
