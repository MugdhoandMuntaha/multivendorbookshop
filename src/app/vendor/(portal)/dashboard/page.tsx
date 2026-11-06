import { Store, BookOpen, Package, DollarSign } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default function VendorDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Vendor Overview</h1>
        <p className="text-muted-foreground text-sm">
          Manage your listings, review incoming book orders, and track your
          marketplace payouts.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Books</CardTitle>
            <BookOpen className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <div className="px-6 pb-4">
            <div className="text-2xl font-bold">0</div>
            <CardDescription className="text-xs">
              Published in marketplace
            </CardDescription>
          </div>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Orders
            </CardTitle>
            <Package className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <div className="px-6 pb-4">
            <div className="text-2xl font-bold">0</div>
            <CardDescription className="text-xs">
              Awaiting fulfillment
            </CardDescription>
          </div>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Sales</CardTitle>
            <DollarSign className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <div className="px-6 pb-4">
            <div className="text-2xl font-bold">$0.00</div>
            <CardDescription className="text-xs">
              After commission
            </CardDescription>
          </div>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Shop Status</CardTitle>
            <Store className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <div className="px-6 pb-4">
            <div className="text-2xl font-bold text-green-600">Active</div>
            <CardDescription className="text-xs">
              Approved by Admin
            </CardDescription>
          </div>
        </Card>
      </div>
    </div>
  );
}
