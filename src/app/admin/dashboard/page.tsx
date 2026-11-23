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
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Marketplace Administration
        </h1>
        <p className="text-slate-500 text-xs mt-0.5 font-normal">
          Platform-level metrics, vendor approval queue, and listing moderation.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-xl border border-stone-200/80 shadow-2xs">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-slate-600">
              Pending Vendors
            </CardTitle>
            <Users className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <div className="px-6 pb-4">
            <div className="text-2xl font-semibold tabular-nums text-slate-900">0</div>
            <CardDescription className="text-xs">
              Awaiting approval
            </CardDescription>
          </div>
        </Card>

        <Card className="rounded-xl border border-stone-200/80 shadow-2xs">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-slate-600">Active Books</CardTitle>
            <BookOpen className="text-slate-400 h-4 w-4" />
          </CardHeader>
          <div className="px-6 pb-4">
            <div className="text-2xl font-semibold tabular-nums text-slate-900">0</div>
            <CardDescription className="text-xs">
              Across all vendors
            </CardDescription>
          </div>
        </Card>

        <Card className="rounded-xl border border-stone-200/80 shadow-2xs">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-slate-600">Platform GMV</CardTitle>
            <DollarSign className="text-slate-400 h-4 w-4" />
          </CardHeader>
          <div className="px-6 pb-4">
            <div className="text-2xl font-semibold tabular-nums text-slate-900">৳ 0</div>
            <CardDescription className="text-xs">
              Gross Merchandise Value
            </CardDescription>
          </div>
        </Card>

        <Card className="rounded-xl border border-stone-200/80 shadow-2xs">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-slate-600">
              Commission Earned
            </CardTitle>
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <div className="px-6 pb-4">
            <div className="text-2xl font-semibold tabular-nums text-slate-900">৳ 0</div>
            <CardDescription className="text-xs">
              10% Platform fee
            </CardDescription>
          </div>
        </Card>
      </div>
    </div>
  );
}
