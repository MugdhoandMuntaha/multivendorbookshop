"use client";

import { useState } from "react";
import { ShoppingBag, Truck, CheckCircle2, Clock, XCircle, Search } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { updateOrderStatusAction } from "@/server/actions/moderation";

interface OrderItem {
  id: string;
  total_minor: number;
  status: "pending" | "processing" | "completed" | "cancelled";
  payment_status: "pending" | "paid" | "failed" | "refunded";
  shipping_address: any;
  created_at: string;
  buyer?: { full_name: string } | null;
  items?: {
    id: string;
    qty: number;
    unit_price_minor: number;
    fulfillment_status: string;
    vendor?: { shop_name: string } | null;
    book?: { title: string } | null;
  }[];
}

interface OrdersManagerProps {
  initialOrders: OrderItem[];
}

export function OrdersManager({ initialOrders }: OrdersManagerProps) {
  const [orders, setOrders] = useState<OrderItem[]>(initialOrders);
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const filteredOrders = orders.filter(
    (o) =>
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.buyer?.full_name?.toLowerCase().includes(search.toLowerCase())
  );

  async function handleUpdateOrder(
    orderId: string,
    newStatus: "pending" | "processing" | "completed" | "cancelled",
    newPaymentStatus: "pending" | "paid" | "failed" | "refunded"
  ) {
    setUpdatingId(orderId);
    const res = await updateOrderStatusAction(
      orderId,
      newStatus,
      newPaymentStatus
    );
    setUpdatingId(null);

    if (res.success) {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? { ...o, status: newStatus, payment_status: newPaymentStatus }
            : o
        )
      );
    } else {
      alert("Error: " + res.error);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900">
            Marketplace Orders & Courier Oversight ({filteredOrders.length})
          </h2>
          <p className="text-xs text-slate-500">
            Monitor multi-vendor order fulfillment, courier delivery, and COD reconciliation
          </p>
        </div>

        <div className="relative w-full max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-emerald-600" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order ID or customer name..."
            className="neo-input-recessed w-full rounded-xl py-2 pl-9 pr-3 text-xs"
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="neo-card p-12 text-center text-xs text-slate-500">
            No orders found matching your criteria.
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order.id} className="neo-card p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 font-bold text-emerald-800">
                    <ShoppingBag className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-900">
                        #{order.id.slice(0, 12)}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          order.payment_status === "paid"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {order.payment_status === "paid"
                          ? "Paid"
                          : "Cash on Delivery"}
                      </span>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700 capitalize">
                        {order.status}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      Date: {new Date(order.created_at).toLocaleDateString("en-US")} | Customer:{" "}
                      <strong className="text-slate-700">
                        {order.buyer?.full_name || "Valued Customer"}
                      </strong>
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-base font-black text-emerald-700">
                    {formatPrice(order.total_minor)}
                  </div>
                  <span className="text-[10px] text-slate-400">
                    Total {order.items?.length || 0} item{order.items?.length === 1 ? "" : "s"}
                  </span>
                </div>
              </div>

              {/* Items Breakdown per Vendor */}
              <div className="space-y-1.5 rounded-xl bg-emerald-50/40 p-3">
                <span className="text-[10px] font-bold tracking-wider text-emerald-800 uppercase">
                  Vendor Item Breakdown:
                </span>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {order.items?.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between rounded-lg bg-white p-2 text-xs border border-emerald-100"
                    >
                      <div className="truncate mr-2">
                        <span className="font-bold text-slate-800">
                          {item.book?.title || "Book"}
                        </span>
                        <span className="block text-[10px] text-slate-400">
                          Vendor: {item.vendor?.shop_name || "Marketplace"}
                        </span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-semibold text-slate-700">
                          {item.qty} × {formatPrice(item.unit_price_minor)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery & Status Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Truck className="h-4 w-4 text-emerald-600" />
                  <span>
                    Courier: <strong>Steadfast / Pathao Logistics</strong> (2-3 days nationwide)
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {order.status !== "completed" && (
                    <button
                      type="button"
                      disabled={updatingId === order.id}
                      onClick={() =>
                        handleUpdateOrder(order.id, "completed", "paid")
                      }
                      className="neo-button-green flex h-8 items-center gap-1 rounded-lg px-3 text-xs font-bold"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Confirm Delivery & Payment</span>
                    </button>
                  )}

                  {order.status !== "cancelled" && (
                    <button
                      type="button"
                      disabled={updatingId === order.id}
                      onClick={() =>
                        handleUpdateOrder(
                          order.id,
                          "cancelled",
                          order.payment_status === "paid" ? "refunded" : "failed"
                        )
                      }
                      className="neo-button-light flex h-8 items-center gap-1 rounded-lg px-2.5 text-xs font-bold text-rose-600 hover:text-rose-700"
                    >
                      <XCircle className="h-3.5 w-3.5" />
                      <span>Cancel Order</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
