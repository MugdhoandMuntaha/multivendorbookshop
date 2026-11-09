import { redirect } from "next/navigation";
import { Store, ShieldCheck, Clock } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { requireUser } from "@/server/queries/auth";
import { getCurrentVendor } from "@/server/queries/vendor";
import { VendorApplyForm } from "@/components/features/vendor/apply-form";

export default async function VendorApplyPage() {
  await requireUser("/vendor/apply");
  const vendor = await getCurrentVendor();

  // If already approved, redirect directly to portal dashboard
  if (vendor?.status === "approved") {
    redirect("/vendor/dashboard");
  }

  return (
    <div className="container mx-auto max-w-4xl space-y-8 px-4 py-12">
      <div className="space-y-3 text-center">
        <div className="bg-primary/10 text-primary mb-2 inline-flex h-12 w-12 items-center justify-center rounded-2xl">
          <Store className="h-6 w-6" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">
          Become a BookMarket Vendor
        </h1>
        <p className="text-muted-foreground mx-auto max-w-xl text-sm">
          Join our curated bookseller network. Sell new textbooks, admission
          test series, vintage paperbacks, or rare collector copies with
          nationwide delivery.
        </p>
      </div>

      {/* Case 1: Vendor status is Pending */}
      {vendor?.status === "pending" && (
        <Card className="border-amber-500/20 bg-amber-500/5">
          <CardContent className="space-y-4 pt-8 pb-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400">
              <Clock className="h-8 w-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight">
                Application Under Review
              </h2>
              <p className="text-muted-foreground mx-auto max-w-md text-sm">
                Your vendor application for{" "}
                <span className="text-foreground font-semibold">
                  &ldquo;{vendor.shop_name}&rdquo;
                </span>{" "}
                has been received and is currently being evaluated by our
                curation team.
              </p>
            </div>
            <div className="text-muted-foreground bg-background inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs">
              <span className="h-2 w-2 animate-pulse rounded-full bg-amber-500" />
              <span>Status: Pending Approval (Review time: 24–48 hours)</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Case 2: No vendor record yet - Show requirements and application form */}
      {!vendor && (
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Vendor Onboarding Requirements</CardTitle>
              <CardDescription>
                We maintain high curation standards to ensure book authenticity
                and reliable customer fulfillment.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-3">
              <div className="flex items-start gap-3">
                <ShieldCheck className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                <div>
                  <p className="text-foreground font-semibold">
                    Accurate Condition
                  </p>
                  <p className="text-muted-foreground mt-0.5 text-xs">
                    Describe physical defects and editions honestly with photos.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ShieldCheck className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                <div>
                  <p className="text-foreground font-semibold">
                    48-Hour Dispatch SLA
                  </p>
                  <p className="text-muted-foreground mt-0.5 text-xs">
                    Pack securely and dispatch orders within 2 business days.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ShieldCheck className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                <div>
                  <p className="text-foreground font-semibold">
                    10% Platform Fee
                  </p>
                  <p className="text-muted-foreground mt-0.5 text-xs">
                    Fixed commission on fulfilled sales with timely payouts.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <VendorApplyForm />
        </div>
      )}
    </div>
  );
}
