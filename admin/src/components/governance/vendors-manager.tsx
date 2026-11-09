"use client";

import { useState } from "react";
import {
  Users,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Percent,
  Store,
} from "lucide-react";
import {
  updateVendorStatusAction,
  updateVendorCommissionAction,
} from "@/server/actions/moderation";

interface VendorItem {
  id: string;
  shop_name: string;
  slug: string;
  description: string | null;
  status: "pending" | "approved" | "suspended" | "rejected";
  commission_bps: number;
  created_at: string;
  owner?: { full_name: string } | null;
}

interface VendorsManagerProps {
  initialVendors: VendorItem[];
}

export function VendorsManager({ initialVendors }: VendorsManagerProps) {
  const [vendors, setVendors] = useState<VendorItem[]>(initialVendors);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function handleStatusChange(
    vendorId: string,
    status: "approved" | "suspended" | "rejected"
  ) {
    setUpdatingId(vendorId);
    const res = await updateVendorStatusAction(vendorId, status);
    setUpdatingId(null);

    if (res.success) {
      setVendors((prev) =>
        prev.map((v) => (v.id === vendorId ? { ...v, status } : v))
      );
    } else {
      alert("Error: " + res.error);
    }
  }

  async function handleCommissionChange(vendorId: string, currentBps: number) {
    const currentPercent = currentBps / 100;
    const input = prompt(
      "ভেন্ডরের নতুন কমিশন হার লিখুন (শতাংশে %, যেমন: 10 বা 8.5):",
      String(currentPercent)
    );
    if (input === null) return;

    const percent = parseFloat(input);
    if (isNaN(percent) || percent < 0 || percent > 50) {
      alert("অনুগ্রহ করে ০ থেকে ৫০% এর মধ্যে বৈধ সংখ্যা লিখুন।");
      return;
    }

    const bps = Math.round(percent * 100);
    setUpdatingId(vendorId);
    const res = await updateVendorCommissionAction(vendorId, bps);
    setUpdatingId(null);

    if (res.success) {
      setVendors((prev) =>
        prev.map((v) => (v.id === vendorId ? { ...v, commission_bps: bps } : v))
      );
    } else {
      alert("Error: " + res.error);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900">
            ভেন্ডর ও কমিশন ব্যবস্থাপনা ({vendors.length})
          </h2>
          <p className="text-xs text-slate-500">
            নতুন ভেন্ডর আবেদন যাচাই, দোকান অনুমোদন ও কাস্টম কমিশন হার নিয়ন্ত্রণ করুন
          </p>
        </div>
      </div>

      <div className="neo-card p-6 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-emerald-100 text-slate-500">
            <tr>
              <th className="pb-3 font-semibold">বুকশপ নাম</th>
              <th className="pb-3 font-semibold">মালিক / প্রোফাইল</th>
              <th className="pb-3 font-semibold">কমিশন রেট</th>
              <th className="pb-3 font-semibold">বর্তমান অবস্থা</th>
              <th className="pb-3 font-semibold text-right">কার্যক্রম (Actions)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-emerald-50">
            {vendors.map((vendor) => {
              const isPending = vendor.status === "pending";
              const isApproved = vendor.status === "approved";
              const isSuspended = vendor.status === "suspended";

              return (
                <tr key={vendor.id} className="hover:bg-emerald-50/30">
                  <td className="py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 font-bold text-emerald-800">
                        <Store className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">
                          {vendor.shop_name}
                        </div>
                        <div className="text-[10px] font-mono text-slate-400">
                          /{vendor.slug}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 font-medium text-slate-700">
                    {vendor.owner?.full_name || "ভেন্ডর মালিক"}
                  </td>

                  <td className="py-3.5">
                    <button
                      type="button"
                      onClick={() =>
                        handleCommissionChange(vendor.id, vendor.commission_bps)
                      }
                      className="flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-white px-2.5 py-1 text-xs font-bold text-emerald-800 hover:bg-emerald-50"
                      title="কমিশন রেট পরিবর্তন করুন"
                    >
                      <Percent className="h-3 w-3 text-emerald-600" />
                      <span>{vendor.commission_bps / 100}%</span>
                    </button>
                  </td>

                  <td className="py-3.5">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        isApproved
                          ? "bg-emerald-100 text-emerald-800"
                          : isPending
                            ? "bg-amber-100 text-amber-800 animate-pulse"
                            : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {isApproved
                        ? "অনুমোদিত (Approved)"
                        : isPending
                          ? "পর্যালোচনাধীন (Pending)"
                          : "স্থগিত (Suspended)"}
                    </span>
                  </td>

                  <td className="py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {isPending && (
                        <>
                          <button
                            type="button"
                            disabled={updatingId === vendor.id}
                            onClick={() =>
                              handleStatusChange(vendor.id, "approved")
                            }
                            className="neo-button-green flex h-8 items-center gap-1 rounded-lg px-3 text-xs font-bold"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>অনুমোদন দিন</span>
                          </button>
                          <button
                            type="button"
                            disabled={updatingId === vendor.id}
                            onClick={() =>
                              handleStatusChange(vendor.id, "rejected")
                            }
                            className="neo-button-light flex h-8 items-center gap-1 rounded-lg px-2.5 text-xs font-bold text-rose-600"
                          >
                            <XCircle className="h-3.5 w-3.5" />
                            <span>বাতিল</span>
                          </button>
                        </>
                      )}

                      {isApproved && (
                        <button
                          type="button"
                          disabled={updatingId === vendor.id}
                          onClick={() =>
                            handleStatusChange(vendor.id, "suspended")
                          }
                          className="neo-button-light flex h-8 items-center gap-1 rounded-lg px-3 text-xs font-bold text-rose-600 hover:bg-rose-50"
                        >
                          <AlertCircle className="h-3.5 w-3.5" />
                          <span>স্থগিত করুন</span>
                        </button>
                      )}

                      {isSuspended && (
                        <button
                          type="button"
                          disabled={updatingId === vendor.id}
                          onClick={() =>
                            handleStatusChange(vendor.id, "approved")
                          }
                          className="neo-button-light flex h-8 items-center gap-1 rounded-lg px-3 text-xs font-bold text-emerald-700 hover:bg-emerald-50"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>পুনরায় চালু করুন</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
