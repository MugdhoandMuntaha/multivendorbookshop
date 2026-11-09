"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { bookSchema, type BookInput } from "@/lib/validators/book";
import { createBook, updateBook } from "@/server/actions/books";
import { ImageUploader } from "./image-uploader";

interface BookFormProps {
  initialData?: Partial<BookInput> & { id?: string };
  categories: { id: string; name: string }[];
  isEditing?: boolean;
}

export function BookForm({
  initialData,
  categories,
  isEditing = false,
}: BookFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<BookInput>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      title: initialData?.title || "",
      author: initialData?.author || "",
      isbn: initialData?.isbn || "",
      description: initialData?.description || "",
      categoryId: initialData?.categoryId || (categories[0]?.id ?? ""),
      condition: initialData?.condition || "good",
      price: initialData?.price ? Number(initialData.price) : 450,
      stock: initialData?.stock !== undefined ? Number(initialData.stock) : 1,
      status: initialData?.status || "active",
      images: initialData?.images || [],
    },
  });

  const onSubmit = async (data: BookInput) => {
    setServerError(null);

    try {
      if (isEditing && initialData?.id) {
        const res = await updateBook(initialData.id, data);
        if (!res.success) {
          setServerError(res.error || "Failed to update book listing");
          return;
        }
      } else {
        const res = await createBook(data);
        if (!res.success) {
          setServerError(res.error || "Failed to create book listing");
          return;
        }
      }

      router.push("/vendor/books");
      router.refresh();
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setServerError(msg);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Top action header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <Link href="/vendor/books">
            <Button variant="ghost" size="sm" type="button" className="gap-1.5">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Inventory</span>
            </Button>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">
            {isEditing ? "Edit Book Listing" : "Add New Book Listing"}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full gap-2 sm:w-auto"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Saving to Catalog...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>{isEditing ? "Update Listing" : "Publish Book"}</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {serverError && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-600 dark:text-red-400">
          <p className="font-semibold">Listing Error</p>
          <p>{serverError}</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column: Book Details & Media (2 cols) */}
        <div className="space-y-6 lg:col-span-2">
          {/* Photos Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Book Photographs</CardTitle>
              <CardDescription>
                Upload clear photos of the book cover, spine, and interior
                pages. The first photo will be used as the primary marketplace
                cover.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Controller
                control={control}
                name="images"
                render={({ field }) => (
                  <ImageUploader
                    images={field.value || []}
                    onChange={(newImgs) => field.onChange(newImgs)}
                    folder="books"
                    maxImages={6}
                  />
                )}
              />
              {errors.images && (
                <p className="text-destructive mt-2 text-xs">
                  {errors.images.message}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Book Metadata */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Bibliographic Information
              </CardTitle>
              <CardDescription>
                Accurate book titles and author names improve search ranking.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="title">Book Title (বইয়ের নাম) *</Label>
                <Input
                  id="title"
                  placeholder="e.g. RTDS মেডিকেল মাস্টার বায়োলজি রিভিশন সেট"
                  {...register("title")}
                />
                {errors.title && (
                  <p className="text-destructive text-xs">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="author">Author(s) / লেখক বা প্রকাশনা *</Label>
                  <Input
                    id="author"
                    placeholder="e.g. ড. হাসান ও RTDS টিম"
                    {...register("author")}
                  />
                  {errors.author && (
                    <p className="text-destructive text-xs">
                      {errors.author.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="isbn">ISBN (10 or 13 digits)</Label>
                  <Input
                    id="isbn"
                    placeholder="e.g. 9789849281144"
                    {...register("isbn")}
                  />
                  {errors.isbn && (
                    <p className="text-destructive text-xs">
                      {errors.isbn.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="description">Book Description (বিবরণ) *</Label>
                <Textarea
                  id="description"
                  rows={5}
                  placeholder="বইয়ের সংস্করণ, কন্ডিশন, সিলেবাস ও অধ্যায়ভিত্তিক বিষয়ের বিবরণ বিস্তারিত লিখুন..."
                  {...register("description")}
                />
                {errors.description && (
                  <p className="text-destructive text-xs">
                    {errors.description.message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Pricing, Inventory & Classification (1 col) */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Classification & Pricing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Category */}
              <div className="space-y-1.5">
                <Label htmlFor="categoryId">Marketplace Category *</Label>
                <select
                  id="categoryId"
                  className="border-input focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full rounded-lg border bg-transparent px-3 text-sm transition-colors outline-none focus-visible:ring-3"
                  {...register("categoryId")}
                >
                  {categories.map((c) => (
                    <option
                      key={c.id}
                      value={c.id}
                      className="bg-popover text-popover-foreground"
                    >
                      {c.name}
                    </option>
                  ))}
                </select>
                {errors.categoryId && (
                  <p className="text-destructive text-xs">
                    {errors.categoryId.message}
                  </p>
                )}
              </div>

              {/* Condition */}
              <div className="space-y-1.5">
                <Label htmlFor="condition">Physical Condition *</Label>
                <select
                  id="condition"
                  className="border-input focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full rounded-lg border bg-transparent px-3 text-sm transition-colors outline-none focus-visible:ring-3"
                  {...register("condition")}
                >
                  <option
                    value="new"
                    className="bg-popover text-popover-foreground"
                  >
                    New (Unread, pristine)
                  </option>
                  <option
                    value="like_new"
                    className="bg-popover text-popover-foreground"
                  >
                    Like New (Mint, crisp spine)
                  </option>
                  <option
                    value="good"
                    className="bg-popover text-popover-foreground"
                  >
                    Good (Minor shelf wear, clean pages)
                  </option>
                  <option
                    value="fair"
                    className="bg-popover text-popover-foreground"
                  >
                    Fair (Readable, highlighted or aged)
                  </option>
                </select>
                {errors.condition && (
                  <p className="text-destructive text-xs">
                    {errors.condition.message}
                  </p>
                )}
              </div>

              {/* Price */}
              <div className="space-y-1.5">
                <Label htmlFor="price">Listing Price (মূল্য - ৳ BDT) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="1"
                  min="1"
                  placeholder="450"
                  {...register("price", { valueAsNumber: true })}
                />
                <p className="text-muted-foreground text-[11px]">
                  Stated in BDT (৳). Converted safely to minor units (paisa) in
                  database.
                </p>
                {errors.price && (
                  <p className="text-destructive text-xs">
                    {errors.price.message}
                  </p>
                )}
              </div>

              {/* Stock Quantity */}
              <div className="space-y-1.5">
                <Label htmlFor="stock">Available Stock *</Label>
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  step="1"
                  placeholder="1"
                  {...register("stock", { valueAsNumber: true })}
                />
                {errors.stock && (
                  <p className="text-destructive text-xs">
                    {errors.stock.message}
                  </p>
                )}
              </div>

              {/* Status */}
              <div className="space-y-1.5">
                <Label htmlFor="status">Listing Visibility</Label>
                <select
                  id="status"
                  className="border-input focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full rounded-lg border bg-transparent px-3 text-sm transition-colors outline-none focus-visible:ring-3"
                  {...register("status")}
                >
                  <option
                    value="active"
                    className="bg-popover text-popover-foreground"
                  >
                    Active (Visible in Storefront)
                  </option>
                  <option
                    value="draft"
                    className="bg-popover text-popover-foreground"
                  >
                    Draft (Private in Portal)
                  </option>
                  <option
                    value="archived"
                    className="bg-popover text-popover-foreground"
                  >
                    Archived
                  </option>
                </select>
                {errors.status && (
                  <p className="text-destructive text-xs">
                    {errors.status.message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
