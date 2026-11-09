import { Package, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { requireUser } from "@/server/queries/auth";

export default async function VendorOrdersPage() {
  await requireUser("/vendor/orders");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Orders & Fulfillment
        </h1>
        <p className="text-muted-foreground text-sm">
          Track customer purchases, update courier dispatch tracking, and
          monitor payouts.
        </p>
      </div>

      <Card className="text-center">
        <CardContent className="space-y-4 py-16">
          <div className="bg-primary/10 text-primary mx-auto flex h-14 w-14 items-center justify-center rounded-full">
            <Package className="h-7 w-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-semibold">No Incoming Orders Yet</h3>
            <p className="text-muted-foreground mx-auto max-w-sm text-sm">
              As soon as customers purchase your books via our multi-vendor
              cart, orders will appear here for packaging and shipping.
            </p>
          </div>
          <div className="text-muted-foreground bg-muted/40 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs">
            <Clock className="h-3.5 w-3.5" />
            <span>Fulfillment SLA: Dispatch within 2 business days</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
