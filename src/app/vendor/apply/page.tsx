import { requireUser } from "@/server/queries/auth";
import { Store, ShieldCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export default async function VendorApplyPage() {
  await requireUser("/vendor/apply");

  return (
    <div className="container mx-auto max-w-3xl space-y-8 px-4 py-12">
      <div className="space-y-3 text-center">
        <div className="bg-primary/10 text-primary mb-2 inline-flex h-12 w-12 items-center justify-center rounded-2xl">
          <Store className="h-6 w-6" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">
          Become a BookMarket Vendor
        </h1>
        <p className="text-muted-foreground mx-auto max-w-xl text-sm">
          Join our independent bookseller community. List rare, vintage, and new
          books, manage your inventory, and reach thousands of passionate
          readers.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vendor Onboarding Requirements</CardTitle>
          <CardDescription>
            All vendor applications are manually screened by our curation team
            to preserve marketplace quality.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="flex items-start gap-3">
            <ShieldCheck className="text-primary mt-0.5 h-5 w-5 shrink-0" />
            <div>
              <p className="text-foreground font-semibold">
                Accurate Condition Grading
              </p>
              <p className="text-muted-foreground text-xs">
                Commit to honest condition descriptions (New, Like New, Good,
                Fair) with authentic photographs.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <ShieldCheck className="text-primary mt-0.5 h-5 w-5 shrink-0" />
            <div>
              <p className="text-foreground font-semibold">
                Standard Fulfillment SLA
              </p>
              <p className="text-muted-foreground text-xs">
                Ship book orders within 2 business days with valid tracking
                numbers.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <ShieldCheck className="text-primary mt-0.5 h-5 w-5 shrink-0" />
            <div>
              <p className="text-foreground font-semibold">
                Transparent Commission
              </p>
              <p className="text-muted-foreground text-xs">
                Platform commission is 10% on book sales, with payouts processed
                regularly.
              </p>
            </div>
          </div>

          <div className="flex justify-end border-t pt-4">
            <Button className="gap-2">
              <span>Begin Application</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
