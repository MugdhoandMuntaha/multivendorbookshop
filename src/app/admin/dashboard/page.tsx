import { ShieldCheck, Users, BookOpen, DollarSign } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Marketplace Administration
        </h1>
        <p className="text-muted-foreground text-sm">
          Platform-level metrics, vendor approval queue, and listing moderation.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Vendors
            </CardTitle>
            <Users className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <div className="px-6 pb-4">
            <div className="text-2xl font-bold">0</div>
            <CardDescription className="text-xs">
              Awaiting approval
            </CardDescription>
          </div>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Books</CardTitle>
            <BookOpen className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <div className="px-6 pb-4">
            <div className="text-2xl font-bold">0</div>
            <CardDescription className="text-xs">
              Across all vendors
            </CardDescription>
          </div>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Platform GMV</CardTitle>
            <DollarSign className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <div className="px-6 pb-4">
            <div className="text-2xl font-bold">$0.00</div>
            <CardDescription className="text-xs">
              Gross Merchandise Value
            </CardDescription>
          </div>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Commission Earned
            </CardTitle>
            <ShieldCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <div className="px-6 pb-4">
            <div className="text-2xl font-bold">$0.00</div>
            <CardDescription className="text-xs">
              10% Platform fee
            </CardDescription>
          </div>
        </Card>
      </div>
    </div>
  );
}
