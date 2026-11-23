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
        <div className="bg-stone-100 text-stone-700 border border-stone-200 mb-2 inline-flex h-12 w-12 items-center justify-center rounded-xl">
          <Store className="h-6 w-6 stroke-[1.5]" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">
          Become an RTDS Bookseller & Publisher
        </h1>
        <p className="text-slate-500 mx-auto max-w-xl text-xs sm:text-sm leading-relaxed">
          Join our verified bookseller network. Sell new academic guides, admission
          test series, literature, or rare collector copies with nationwide delivery.
        </p>
      </div>

      {/* Case 1: Vendor status is Pending */}
      {vendor?.status === "pending" && (
        <Card className="border-amber-500/20 bg-amber-500/5">
          <CardContent className="space-y-4 pt-8 pb-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/15 text-amber-700">
              <Clock className="h-6 w-6 stroke-[1.5]" />
            </div>
            <div className="space-y-1.5">
              <h2 className="text-xl font-semibold tracking-tight text-slate-900">
                Application Under Review
              </h2>
              <p className="text-slate-600 mx-auto max-w-md text-xs sm:text-sm">
                Your vendor application for{" "}
                <span className="text-slate-900 font-medium">
                  &ldquo;{vendor.shop_name}&rdquo;
                </span>{" "}
                has been received and is currently being evaluated by our
                curation team.
              </p>
            </div>
            <div className="text-slate-600 bg-white inline-flex items-center gap-2 rounded-md border border-stone-200 px-3 py-1 text-xs">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
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
