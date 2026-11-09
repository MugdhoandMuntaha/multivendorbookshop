import Link from "next/link";
import {
  TrendingUp,
  DollarSign,
  BookOpen,
  Users,
  ShoppingBag,
  ArrowRight,
  AlertTriangle,
  Sparkles,
  Sliders,
} from "lucide-react";
import { getAdminMetrics, getAdminOrders } from "@/server/queries/admin";
import { formatPrice } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const [metrics, recentOrders] = await Promise.all([
    getAdminMetrics(),
    getAdminOrders(),
  ]);

  return (
    <div className="space-y-8">
      {/* 1. Header & Welcome */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            মার্কেটপ্লেস ওভারভিউ (Executive Overview)
          </h1>
          <p className="text-xs text-slate-500">
            RTDS বুকশপ প্ল্যাটফর্মের লাইভ সেলস, ভেন্ডর কার্যক্রম ও স্টোরফ্রন্ট পারফরম্যান্স
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/storefront/hero"
            className="neo-button-green flex h-9 items-center gap-1.5 rounded-xl px-4 text-xs font-bold"
          >
            <Sliders className="h-3.5 w-3.5" />
            <span>স্টোরফ্রন্ট কাস্টমাইজ করুন</span>
          </Link>
        </div>
      </div>

      {/* 2. Pending Vendors Alert if any */}
      {metrics.pendingVendors > 0 && (
        <div className="neo-card flex items-center justify-between border-amber-300 bg-amber-50/80 p-4 text-amber-900">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-400 text-amber-950">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold">
                {metrics.pendingVendors} টি নতুন ভেন্ডর আবেদন পর্যালোচনার অপেক্ষায় আছে!
              </p>
              <p className="text-[11px] text-amber-800">
                দোকানের তথ্য ও কমিশনের শর্তাবলী যাচাই করে অনুমোদন দিন
              </p>
            </div>
          </div>
          <Link
            href="/vendors"
            className="neo-button-light flex h-8 items-center gap-1 rounded-lg px-3 text-xs font-bold text-amber-900"
          >
            <span>আবেদনসমূহ দেখুন</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      )}

      {/* 3. Four Neomorphic Metric Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Metric 1: Total GMV */}
        <div className="neo-card neo-card-hover p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              মোট জিএমভি (GMV)
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">
              {formatPrice(metrics.totalGmvMinor)}
            </div>
            <p className="text-[11px] text-emerald-700 font-semibold mt-1">
              সফল ও পরিশোধিত মোট বিক্রয়
            </p>
          </div>
        </div>

        {/* Metric 2: Estimated Commission */}
        <div className="neo-card neo-card-hover p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              প্ল্যাটফর্ম কমিশন
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-100 text-teal-800">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">
              {formatPrice(metrics.estimatedCommissionMinor)}
            </div>
            <p className="text-[11px] text-teal-700 font-semibold mt-1">
              মার্কেটপ্লেস শেয়ার (গড় ১০%)
            </p>
          </div>
        </div>

        {/* Metric 3: Total Books */}
        <div className="neo-card neo-card-hover p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              মোট বই তালিকাভুক্ত
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <BookOpen className="h-4 w-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">
              {metrics.totalBooks} টি বই
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              সকল অনুমোদিত ভেন্ডরের বই
            </p>
          </div>
        </div>

        {/* Metric 4: Total Vendors */}
        <div className="neo-card neo-card-hover p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              অনুমোদিত ভেন্ডর
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">
              {metrics.totalVendors} টি বুকশপ
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {metrics.pendingVendors} টি আবেদন অপেক্ষমাণ
            </p>
          </div>
        </div>
      </div>

      {/* 4. Recent Orders Table */}
      <div className="neo-card p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="h-5 w-5 text-emerald-600" />
            <h2 className="text-base font-bold text-slate-900">
              সাম্প্রতিক অর্ডারসমূহ (Recent Orders)
            </h2>
          </div>
          <Link
            href="/orders"
            className="text-xs font-bold text-emerald-700 hover:underline"
          >
            সব অর্ডার দেখুন →
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500">
            এখনও কোনো অর্ডার লিপিবদ্ধ হয়নি।
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-emerald-100 text-slate-500">
                <tr>
                  <th className="pb-3 font-semibold">অর্ডার আইডি</th>
                  <th className="pb-3 font-semibold">ক্রেতা</th>
                  <th className="pb-3 font-semibold">পরিমাণ ও আইটেম</th>
                  <th className="pb-3 font-semibold">মোট মূল্য</th>
                  <th className="pb-3 font-semibold">পেমেন্ট স্ট্যাটাস</th>
                  <th className="pb-3 font-semibold">ডেলিভারি অবস্থা</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-50">
                {recentOrders.slice(0, 8).map((order) => (
                  <tr key={order.id} className="hover:bg-emerald-50/30">
                    <td className="py-3 font-mono font-medium text-slate-800">
                      #{order.id.slice(0, 8)}
                    </td>
                    <td className="py-3 font-medium text-slate-900">
                      {order.buyer?.full_name || "সম্মানিত ক্রেতা"}
                    </td>
                    <td className="py-3 text-slate-600">
                      {order.items?.length || 0} টি বই
                    </td>
                    <td className="py-3 font-bold text-emerald-700">
                      {formatPrice(order.total_minor)}
                    </td>
                    <td className="py-3">
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          order.payment_status === "paid"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {order.payment_status === "paid" ? "পরিশোধিত" : "ক্যাশ অন ডেলিভারি"}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className="inline-block rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
