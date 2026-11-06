import { Package } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function BuyerOrdersPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Order History</h1>
      <div className="space-y-4 rounded-2xl border border-dashed p-12 text-center">
        <Package className="text-muted-foreground mx-auto h-12 w-12" />
        <h2 className="text-xl font-semibold">No orders yet</h2>
        <p className="text-muted-foreground mx-auto max-w-sm text-sm">
          When you purchase books from our independent sellers, your orders will
          appear here.
        </p>
        <Link href="/">
          <Button className="mt-2">Start Shopping</Button>
        </Link>
      </div>
    </div>
  );
}
