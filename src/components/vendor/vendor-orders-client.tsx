"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  ExternalLink,
  Search,
  Phone,
  MapPin,
  DollarSign,
  Send,
  X,
  ShieldAlert,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";
import { VendorOrderItemDetail } from "@/server/queries/orders";
import { updateFulfillmentStatusAction } from "@/server/actions/fulfillment";
import { formatPrice, getR2ImageUrl, getCourierTrackingUrl } from "@/lib/utils";

interface VendorOrdersClientProps {
  initialItems: VendorOrderItemDetail[];
  vendorShopName?: string;
}

type TabType = "all" | "pending" | "shipped" | "delivered";

const COURIER_OPTIONS = [
  { id: "Steadfast Courier", label: "Steadfast Courier (Recommended)" },
  { id: "Pathao Courier", label: "Pathao Courier" },
  { id: "RedX Logistics", label: "RedX Logistics" },
  { id: "Paperfly", label: "Paperfly Courier" },
  { id: "Sundarban Courier", label: "Sundarban Courier Service" },
  { id: "Other", label: "Other / Merchant Direct Delivery" },
];

export function VendorOrdersClient({
  initialItems,
  vendorShopName = "My Bookstore",
}: VendorOrdersClientProps) {
  const { t } = useLanguage();
  const [items, setItems] = useState<VendorOrderItemDetail[]>(initialItems);
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isPending, startTransition] = useTransition();

  // Dispatch modal state
  const [selectedItemForDispatch, setSelectedItemForDispatch] =
    useState<VendorOrderItemDetail | null>(null);
  const [selectedCourier, setSelectedCourier] = useState(COURIER_OPTIONS[0].id);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Filter items
  const filteredItems = items.filter((item) => {
    // Tab filter
    if (activeTab === "pending" && item.fulfillment_status !== "pending") return false;
    if (activeTab === "shipped" && item.fulfillment_status !== "shipped") return false;
    if (activeTab === "delivered" && item.fulfillment_status !== "delivered") return false;

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchesOrder = item.order_id.toLowerCase().includes(q);
      const matchesTitle = item.book?.title.toLowerCase().includes(q) || false;
      const matchesCustomer =
        item.order?.shippingAddressParsed.fullName.toLowerCase().includes(q) ||
        item.order?.shippingAddressParsed.phone.includes(q) ||
        false;
      return matchesOrder || matchesTitle || matchesCustomer;
    }

    return true;
  });

  // KPI Calculations
  const totalOrdersCount = items.length;
  const pendingCount = items.filter((i) => i.fulfillment_status === "pending").length;
  const inTransitCount = items.filter((i) => i.fulfillment_status === "shipped").length;
  const deliveredCount = items.filter((i) => i.fulfillment_status === "delivered").length;

  const totalPayoutMinor = items.reduce((sum, item) => {
    const gross = item.qty * item.unit_price_minor;
    const fee = item.commission_amount_minor || Math.round((gross * (item.commission_bps || 1000)) / 10000);
    return sum + (gross - fee);
  }, 0);

  // Handle Dispatch submit
  function handleDispatchSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedItemForDispatch) return;

    if (!trackingNumber.trim()) {
      setErrorMessage("Please enter a valid tracking or consignment code.");
      return;
    }

    setErrorMessage(null);

    startTransition(async () => {
      const formattedTracking = `${selectedCourier}: ${trackingNumber.trim()}`;
      const res = await updateFulfillmentStatusAction({
        orderItemId: selectedItemForDispatch.id,
        status: "shipped",
        courier: selectedCourier,
        trackingNumber: trackingNumber.trim(),
      });

      if (res.success) {
        setItems((prev) =>
          prev.map((i) =>
            i.id === selectedItemForDispatch.id
              ? {
                  ...i,
                  fulfillment_status: "shipped",
                  tracking_number: formattedTracking,
                }
              : i
          )
        );
        setSuccessMessage(t.orders.dispatchSuccess);
        setSelectedItemForDispatch(null);
        setTrackingNumber("");
        setTimeout(() => setSuccessMessage(null), 4000);
      } else {
        setErrorMessage(res.error || "Failed to update fulfillment status");
      }
    });
  }

  // Handle Quick Mark as Delivered
  function handleMarkDelivered(orderItemId: string) {
    startTransition(async () => {
      const res = await updateFulfillmentStatusAction({
        orderItemId,
        status: "delivered",
      });

      if (res.success) {
        setItems((prev) =>
          prev.map((i) =>
            i.id === orderItemId ? { ...i, fulfillment_status: "delivered" } : i
          )
        );
        setSuccessMessage(t.orders.deliveredSuccess);
        setTimeout(() => setSuccessMessage(null), 4000);
      } else {
        alert(res.error || "Failed to update delivery status");
      }
    });
  }

  return (
    <div className="space-y-8">
      {/* Notifications */}
      {successMessage && (
        <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-4 text-xs font-bold text-emerald-900 shadow-sm flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">
            {t.orders.vendorOrdersTitle}
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            {t.orders.vendorOrdersSubtitle} — {vendorShopName}
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-emerald-600" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search order ID, book, customer..."
            className="neo-input-recessed w-full rounded-2xl py-2.5 pl-10 pr-4 text-xs font-medium text-slate-800 placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {/* Total Orders */}
        <div className="neo-card p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold">{t.orders.kpiTotalOrders}</span>
            <Package className="h-4 w-4 text-slate-400" />
          </div>
          <p className="text-2xl font-black text-slate-900">{totalOrdersCount}</p>
        </div>

        {/* Pending Packaging */}
        <div className="neo-card p-4 space-y-1 border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between text-amber-700">
            <span className="text-xs font-bold">{t.orders.kpiPendingPackaging}</span>
            <Clock className="h-4 w-4" />
          </div>
          <p className="text-2xl font-black text-amber-900">{pendingCount}</p>
          <span className="text-[10px] text-amber-700 font-medium">SLA: Dispatch in 48h</span>
        </div>

        {/* In Transit */}
        <div className="neo-card p-4 space-y-1 border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between text-blue-700">
            <span className="text-xs font-bold">{t.orders.kpiInTransit}</span>
            <Truck className="h-4 w-4" />
          </div>
          <p className="text-2xl font-black text-blue-900">{inTransitCount}</p>
          <span className="text-[10px] text-blue-700 font-medium">With Couriers</span>
        </div>

        {/* Completed Net Payout */}
        <div className="neo-card p-4 space-y-1 border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between text-emerald-700">
            <span className="text-xs font-bold">{t.orders.kpiCompletedPayouts}</span>
            <DollarSign className="h-4 w-4" />
          </div>
          <p className="text-2xl font-black text-emerald-900">
            {formatPrice(totalPayoutMinor)}
          </p>
          <span className="text-[10px] text-emerald-700 font-medium">Net Earnings</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-emerald-100">
        {(
          [
            { id: "all", label: t.orders.filterAll, count: items.length },
            { id: "pending", label: t.orders.filterPending, count: pendingCount },
            { id: "shipped", label: t.orders.filterShipped, count: inTransitCount },
            { id: "delivered", label: t.orders.filterDelivered, count: deliveredCount },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-white/80 text-slate-600 hover:bg-emerald-50/50 hover:text-emerald-700"
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-black ${
                activeTab === tab.id
                  ? "bg-white/20 text-white"
                  : "bg-emerald-100 text-emerald-800"
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Order Items List */}
      {filteredItems.length === 0 ? (
        <div className="neo-card p-12 text-center space-y-3">
          <Package className="mx-auto h-12 w-12 text-emerald-300" />
          <h3 className="text-base font-bold text-slate-800">No Orders in this Status</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            When buyers purchase your books, order items will appear here for packaging and shipping.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredItems.map((item) => {
            const grossMinor = item.qty * item.unit_price_minor;
            const commissionMinor =
              item.commission_amount_minor ||
              Math.round((grossMinor * (item.commission_bps || 1000)) / 10000);
            const netEarningsMinor = grossMinor - commissionMinor;
            const trackingUrl = getCourierTrackingUrl(item.tracking_number);

            return (
              <div
                key={item.id}
                className="neo-card p-5 space-y-4 transition-all hover:shadow-md"
              >
                {/* Top Row: IDs, Dates & Status */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-100 pb-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono text-xs font-black text-slate-900 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/60">
                      #{item.order_id.slice(0, 13).toUpperCase()}
                    </span>
                    <span className="text-xs text-slate-500">
                      {new Date(item.created_at).toLocaleDateString("en-BD", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${
                        item.fulfillment_status === "delivered"
                          ? "bg-emerald-100 text-emerald-800"
                          : item.fulfillment_status === "shipped"
                          ? "bg-blue-100 text-blue-800"
                          : item.fulfillment_status === "cancelled"
                          ? "bg-rose-100 text-rose-800"
                          : "bg-amber-100 text-amber-800 animate-pulse"
                      }`}
                    >
                      {item.fulfillment_status === "delivered" ? (
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      ) : item.fulfillment_status === "shipped" ? (
                        <Truck className="h-3.5 w-3.5" />
                      ) : (
                        <Clock className="h-3.5 w-3.5" />
                      )}
                      <span>
                        {item.fulfillment_status === "delivered"
                          ? t.orders.statusDelivered
                          : item.fulfillment_status === "shipped"
                          ? t.orders.statusShipped
                          : item.fulfillment_status === "cancelled"
                          ? t.orders.statusCancelled
                          : t.orders.filterPending}
                      </span>
                    </span>
                  </div>
                </div>

                {/* Main Content Grid: Book Info | Financials | Customer Address */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Column 1: Book Info */}
                  <div className="flex items-start gap-3">
                    <div className="relative h-20 w-16 flex-shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                      <Image
                        src={getR2ImageUrl(item.book?.coverUrl)}
                        alt={item.book?.title || "Book"}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="space-y-1 min-w-0">
                      <h4 className="text-sm font-bold text-slate-900 line-clamp-2">
                        {item.book?.title || "Book Listing"}
                      </h4>
                      <p className="text-xs text-slate-600">{item.book?.author}</p>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500">
                        <span className="rounded bg-slate-100 px-1.5 py-0.5 font-semibold uppercase">
                          {item.book?.condition || "Good"}
                        </span>
                        <span>Qty: {item.qty}</span>
                      </div>
                    </div>
                  </div>

                  {/* Column 2: Payout Breakdown */}
                  <div className="rounded-xl bg-emerald-50/40 p-3 space-y-1.5 text-xs border border-emerald-100">
                    <div className="flex justify-between text-slate-600">
                      <span>Gross Sales ({item.qty} pcs):</span>
                      <span className="font-semibold">{formatPrice(grossMinor)}</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Platform Commission ({((item.commission_bps || 1000) / 100).toFixed(0)}%):</span>
                      <span className="text-rose-600 font-medium">-{formatPrice(commissionMinor)}</span>
                    </div>
                    <div className="border-t border-emerald-200/60 pt-1.5 flex justify-between font-bold text-slate-900">
                      <span className="text-emerald-800">{t.orders.netPayout}:</span>
                      <span className="text-sm text-emerald-800">{formatPrice(netEarningsMinor)}</span>
                    </div>
                  </div>

                  {/* Column 3: Customer & Shipping Details */}
                  <div className="space-y-1.5 text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      {t.orders.customerDetails}
                    </span>
                    <p className="font-bold text-slate-900">
                      {item.order?.shippingAddressParsed.fullName || "Customer"}
                    </p>
                    <a
                      href={`tel:${item.order?.shippingAddressParsed.phone}`}
                      className="inline-flex items-center gap-1.5 text-emerald-700 hover:underline font-semibold"
                    >
                      <Phone className="h-3.5 w-3.5" />
                      <span>{item.order?.shippingAddressParsed.phone}</span>
                    </a>
                    <div className="flex items-start gap-1.5 text-slate-600 pt-1">
                      <MapPin className="h-3.5 w-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                      <span className="line-clamp-2">
                        {item.order?.shippingAddressParsed.streetAddress},{" "}
                        {item.order?.shippingAddressParsed.district}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Bar: Action buttons & Tracking display */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-emerald-100 pt-3">
                  <div className="flex items-center gap-2">
                    {item.tracking_number ? (
                      <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4 text-emerald-600" />
                        <span className="font-mono text-xs font-bold text-slate-800 bg-white border border-slate-200 px-2.5 py-1 rounded-lg">
                          {item.tracking_number}
                        </span>
                        {trackingUrl && (
                          <a
                            href={trackingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="neo-pill-mint inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold text-emerald-800"
                          >
                            <ExternalLink className="h-3 w-3" />
                            <span>{t.orders.trackParcel}</span>
                          </a>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 italic">
                        {t.orders.noTrackingYet}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {item.fulfillment_status === "pending" && (
                      <button
                        onClick={() => {
                          setSelectedItemForDispatch(item);
                          setErrorMessage(null);
                        }}
                        disabled={isPending}
                        className="neo-button-green inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold shadow-sm"
                      >
                        <Send className="h-3.5 w-3.5" />
                        <span>{t.orders.markAsShipped}</span>
                      </button>
                    )}

                    {item.fulfillment_status === "shipped" && (
                      <button
                        onClick={() => handleMarkDelivered(item.id)}
                        disabled={isPending}
                        className="neo-pill-mint inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all hover:bg-emerald-200"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700" />
                        <span>{t.orders.markAsDelivered}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Dispatch Consignment Modal */}
      {selectedItemForDispatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="neo-card w-full max-w-lg bg-white p-6 shadow-2xl space-y-5 animate-in fade-in-50 zoom-in-95">
            <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-emerald-600" />
                <h3 className="text-base font-black text-slate-900">
                  {t.orders.dispatchOrder}
                </h3>
              </div>
              <button
                onClick={() => setSelectedItemForDispatch(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {errorMessage && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-medium text-rose-800 flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-rose-600 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleDispatchSubmit} className="space-y-4">
              {/* Book being dispatched */}
              <div className="rounded-xl bg-slate-50 p-3 border border-slate-200/60 flex items-center gap-3">
                <div className="relative h-12 w-10 flex-shrink-0 overflow-hidden rounded-md border border-slate-200 bg-white">
                  <Image
                    src={getR2ImageUrl(selectedItemForDispatch.book?.coverUrl)}
                    alt="Book"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate">
                    {selectedItemForDispatch.book?.title}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Recipient: {selectedItemForDispatch.order?.shippingAddressParsed.fullName} (
                    {selectedItemForDispatch.order?.shippingAddressParsed.district})
                  </p>
                </div>
              </div>

              {/* Courier Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  {t.orders.selectCourier}
                </label>
                <select
                  value={selectedCourier}
                  onChange={(e) => setSelectedCourier(e.target.value)}
                  className="neo-input-recessed w-full rounded-xl py-2.5 px-3 text-xs font-medium text-slate-800"
                >
                  {COURIER_OPTIONS.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Consignment Tracking ID */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  {t.orders.enterTrackingNumber}
                </label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="e.g. ST-DH-889214 or 49812938"
                  className="neo-input-recessed w-full rounded-xl py-2.5 px-3 text-xs font-medium text-slate-800 placeholder:text-slate-400 font-mono"
                  required
                />
                <p className="text-[11px] text-slate-500">
                  The buyer will receive an automated SMS with this tracking ID.
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-emerald-100">
                <button
                  type="button"
                  onClick={() => setSelectedItemForDispatch(null)}
                  className="rounded-xl px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="neo-button-green inline-flex items-center gap-2 rounded-xl px-5 py-2 text-xs font-bold shadow-sm"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>{isPending ? "Updating..." : t.orders.dispatchOrder}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
