import Link from "next/link";
import Image from "next/image";
import { Plus, BookOpen, AlertCircle, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { requireRole } from "@/server/queries/auth";
import { getCurrentVendor, getVendorBooks } from "@/server/queries/vendor";
import { formatPrice, getR2ImageUrl } from "@/lib/utils";

export default async function VendorBooksPage() {
  await requireRole(["vendor", "admin"], "/vendor/books");
  const vendor = await getCurrentVendor();

  if (!vendor) {
    return (
      <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-6 text-center">
        <AlertCircle className="mx-auto h-8 w-8 text-amber-600 dark:text-amber-400" />
        <h2 className="mt-2 text-lg font-bold">No Vendor Record Found</h2>
        <p className="text-muted-foreground text-sm">
          Please submit a vendor application before listing inventory.
        </p>
        <Link href="/vendor/apply" className="mt-4 inline-block">
          <Button>Apply for Vendor Account</Button>
        </Link>
      </div>
    );
  }

  const books = await getVendorBooks(vendor.id);

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Book Inventory</h1>
          <p className="text-muted-foreground text-sm">
            Manage your book listings, stock availability, and physical
            condition grades.
          </p>
        </div>

        <Link href="/vendor/books/new">
          <Button className="gap-2 shadow-sm">
            <Plus className="h-4 w-4" />
            <span>Add New Book</span>
          </Button>
        </Link>
      </div>

      {/* Notice if vendor is pending */}
      {vendor.status !== "approved" && (
        <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-800 dark:text-amber-300">
          <p className="font-semibold">Shop Approval Pending</p>
          <p className="mt-0.5 text-xs">
            Your shop is currently in review. Listings you create will remain in
            draft until your shop is approved by admin.
          </p>
        </div>
      )}

      {/* Book Listings List/Table */}
      {books.length === 0 ? (
        <Card className="text-center">
          <CardContent className="space-y-4 py-16">
            <div className="bg-primary/10 text-primary mx-auto flex h-14 w-14 items-center justify-center rounded-full">
              <BookOpen className="h-7 w-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">No Books in Inventory</h3>
              <p className="text-muted-foreground mx-auto max-w-sm text-sm">
                Get started by listing your first book with photos, price, and
                condition details.
              </p>
            </div>
            <Link href="/vendor/books/new">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                <span>Add Your First Book</span>
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          <div className="bg-muted/40 text-muted-foreground hidden rounded-lg border px-4 py-2.5 text-xs font-semibold md:grid md:grid-cols-12 md:items-center md:gap-4">
            <div className="md:col-span-5">BOOK / AUTHOR</div>
            <div className="md:col-span-2">CONDITION / CATEGORY</div>
            <div className="text-right md:col-span-2">PRICE</div>
            <div className="text-center md:col-span-1">STOCK</div>
            <div className="text-right md:col-span-2">ACTIONS</div>
          </div>

          {books.map((book) => {
            const primaryImage = book.book_images?.[0]?.r2_key;
            const imageUrl = getR2ImageUrl(primaryImage);

            return (
              <div
                key={book.id}
                className="group bg-card flex flex-col gap-4 rounded-xl border p-4 transition-shadow hover:shadow-md md:grid md:grid-cols-12 md:items-center md:gap-4"
              >
                {/* Book & Author info */}
                <div className="flex items-center gap-3 md:col-span-5">
                  <div className="bg-muted relative h-16 w-12 shrink-0 overflow-hidden rounded-md border">
                    <Image
                      src={imageUrl}
                      alt={book.title}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <Link
                      href={`/vendor/books/${book.id}/edit`}
                      className="text-foreground line-clamp-1 text-sm font-semibold hover:underline md:text-base"
                    >
                      {book.title}
                    </Link>
                    <p className="text-muted-foreground line-clamp-1 text-xs">
                      by {book.author}
                    </p>
                    {book.isbn && (
                      <p className="text-muted-foreground/70 text-[11px]">
                        ISBN: {book.isbn}
                      </p>
                    )}
                  </div>
                </div>

                {/* Condition & Category */}
                <div className="flex flex-wrap items-center gap-1.5 md:col-span-2">
                  <Badge variant="outline" className="text-xs capitalize">
                    {book.condition.replace("_", " ")}
                  </Badge>
                  {book.category && (
                    <span className="text-muted-foreground line-clamp-1 text-xs">
                      {book.category.name}
                    </span>
                  )}
                </div>

                {/* Price */}
                <div className="md:col-span-2 md:text-right">
                  <span className="text-foreground font-bold">
                    {formatPrice(book.price_minor, book.currency)}
                  </span>
                </div>

                {/* Stock & Status */}
                <div className="flex items-center justify-between md:col-span-1 md:flex-col md:justify-center">
                  <span
                    className={`text-sm font-semibold ${
                      book.stock <= 2
                        ? "text-amber-600 dark:text-amber-400"
                        : "text-foreground"
                    }`}
                  >
                    {book.stock} in stock
                  </span>
                  <Badge
                    variant={book.status === "active" ? "default" : "secondary"}
                    className="text-[10px] capitalize"
                  >
                    {book.status}
                  </Badge>
                </div>

                {/* Action buttons */}
                <div className="flex items-center justify-end gap-2 border-t pt-3 md:col-span-2 md:border-t-0 md:pt-0">
                  <Link href={`/vendor/books/${book.id}/edit`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 gap-1.5 text-xs"
                    >
                      <Edit className="h-3.5 w-3.5" />
                      <span>Edit</span>
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
