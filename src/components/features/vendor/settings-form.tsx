"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save, CheckCircle2 } from "lucide-react";
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
  vendorProfileSchema,
  type VendorProfileInput,
} from "@/lib/validators/vendor";
import { updateVendorProfile } from "@/server/actions/vendor";

interface SettingsFormProps {
  initialData: {
    shopName: string;
    description: string;
    shippingFee: number;
    logoKey?: string | null;
    bannerKey?: string | null;
  };
}

export function VendorSettingsForm({ initialData }: SettingsFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<VendorProfileInput>({
    resolver: zodResolver(vendorProfileSchema),
    defaultValues: {
      shopName: initialData.shopName,
      description: initialData.description,
      shippingFee: initialData.shippingFee,
      logoKey: initialData.logoKey || "",
      bannerKey: initialData.bannerKey || "",
    },
  });

  const onSubmit = async (data: VendorProfileInput) => {
    setServerError(null);
    setSuccessMsg(false);

    try {
      const res = await updateVendorProfile(data);
      if (!res.success) {
        setServerError(res.error || "Failed to update shop settings");
        return;
      }
      setSuccessMsg(true);
      router.refresh();
      setTimeout(() => setSuccessMsg(false), 4000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update shop";
      setServerError(msg);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {successMsg && (
        <div className="flex items-center gap-2 rounded-lg border border-green-500/20 bg-green-500/10 p-4 text-sm text-green-700 dark:text-green-400">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span>Shop settings updated successfully!</span>
        </div>
      )}

      {serverError && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-600 dark:text-red-400">
          <p className="font-semibold">Update Failed</p>
          <p className="text-xs">{serverError}</p>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Shop Profile</CardTitle>
          <CardDescription>
            Update your storefront identity, customer biography, and default
            dispatch fee.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="shopName">Shop Name *</Label>
              <Input
                id="shopName"
                placeholder="e.g. Nilkhet Rare Books"
                {...register("shopName")}
              />
              {errors.shopName && (
                <p className="text-destructive text-xs">
                  {errors.shopName.message}
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
              placeholder="Tell buyers about your bookstore, subject specializations, and packaging care..."
              {...register("description")}
            />
            {errors.description && (
              <p className="text-destructive text-xs">
                {errors.description.message}
              </p>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex justify-end border-t pt-4">
          <Button type="submit" disabled={isSubmitting} className="gap-2">
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Save Settings</span>
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
