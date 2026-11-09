"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, CheckCircle2, ShieldAlert, ArrowRight } from "lucide-react";
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
  CardFooter,
} from "@/components/ui/card";
import {
  vendorApplySchema,
  type VendorApplyInput,
} from "@/lib/validators/vendor";
import { applyForVendor } from "@/server/actions/vendor";

interface ApplyFormProps {
  initialShopName?: string;
}

export function VendorApplyForm({ initialShopName = "" }: ApplyFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<VendorApplyInput>({
    resolver: zodResolver(vendorApplySchema),
    defaultValues: {
      shopName: initialShopName,
      slug: "",
      description: "",
      shippingFee: 3.5, // Standard local flat delivery
      phone: "",
      logoKey: "",
      bannerKey: "",
    },
  });

  const handleShopNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setValue("shopName", name);
    // Auto-generate URL slug
    const generatedSlug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .slice(0, 50);
    setValue("slug", generatedSlug, { shouldValidate: true });
  };

  const onSubmit = async (data: VendorApplyInput) => {
    setServerError(null);
    try {
      const res = await applyForVendor(data);
      if (!res.success) {
        setServerError(res.error || "Failed to submit application");
        return;
      }
      setIsSuccess(true);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setServerError(msg);
    }
  };

  if (isSuccess) {
    return (
      <Card className="border-green-500/20 bg-green-500/5 text-center">
        <CardContent className="space-y-4 pt-8 pb-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-500/20 text-green-600 dark:text-green-400">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">
              Application Submitted!
            </h2>
            <p className="text-muted-foreground mx-auto max-w-md text-sm">
              Thank you for applying to sell books on BookMarket. Our curation
              team evaluates each seller for authenticity and catalog quality.
              We typically approve applications within 24–48 hours.
            </p>
          </div>
          <div className="pt-4">
            <Link href="/vendor/dashboard">
              <Button className="gap-2">
                <span>Go to Vendor Overview</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Apply for a Vendor Account</CardTitle>
        <CardDescription>
          Complete the form below to register your bookshop. All fields marked
          with * are required.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-6">
          {serverError && (
            <div className="flex items-start gap-2.5 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-600 dark:text-red-400">
              <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
              <div>
                <p className="font-semibold">Unable to submit application</p>
                <p className="text-xs">{serverError}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="shopName">Shop Name *</Label>
              <Input
                id="shopName"
                placeholder="e.g. Nilkhet Rare Books"
                {...register("shopName")}
                onChange={handleShopNameChange}
              />
              {errors.shopName && (
                <p className="text-destructive text-xs">
                  {errors.shopName.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="slug">Shop URL Slug *</Label>
              <div className="flex items-center rounded-lg border text-sm">
                <span className="text-muted-foreground bg-muted/50 rounded-l-lg border-r px-2.5 py-1 text-xs">
                  /shop/
                </span>
                <input
                  id="slug"
                  className="bg-transparent px-2.5 py-1 text-sm outline-none"
                  placeholder="nilkhet-rare-books"
                  {...register("slug")}
                />
              </div>
              {errors.slug && (
                <p className="text-destructive text-xs">
                  {errors.slug.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="phone">Contact Phone Number *</Label>
              <Input
                id="phone"
                placeholder="e.g. +8801712345678"
                {...register("phone")}
              />
              {errors.phone && (
                <p className="text-destructive text-xs">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="shippingFee">Flat Shipping Fee ($ USD) *</Label>
              <Input
                id="shippingFee"
                type="number"
                step="0.01"
                min="0"
                placeholder="3.50"
                {...register("shippingFee", { valueAsNumber: true })}
              />
              {errors.shippingFee && (
                <p className="text-destructive text-xs">
                  {errors.shippingFee.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">
              Shop Biography & Specialization *
            </Label>
            <Textarea
              id="description"
              rows={4}
              placeholder="Tell readers about your inventory. Do you specialize in medical test guides, rare first editions, university textbooks, or literary fiction? Mention your physical store location if applicable."
              {...register("description")}
            />
            {errors.description && (
              <p className="text-destructive text-xs">
                {errors.description.message}
              </p>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex justify-between border-t pt-4">
          <Link href="/buyer/orders">
            <Button variant="ghost" type="button">
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={isSubmitting} className="gap-2">
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Submitting Application...</span>
              </>
            ) : (
              <>
                <span>Submit Vendor Application</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
