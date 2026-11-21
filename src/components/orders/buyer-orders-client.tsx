"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
  ExternalLink,
  Receipt,
  Store,
  ChevronRight,
  Search,
  MapPin,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";
import { OrderDetail } from "@/server/queries/orders";
import { formatPrice, getR2ImageUrl, getCourierTrackingUrl } from "@/lib/utils";

interface BuyerOrdersClientProps {
  initialOrders: OrderDetail[];
}

type FilterTab = "all" | "active" | "completed" | "cancelled";

export function BuyerOrdersClient({ initialOrders }: BuyerOrdersClientProps) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOrders = useMemo(() => {
    return initialOrders.filter((order) => {
      // Tab filter
      if (activeTab === "active") {
        if (order.status !== "pending" && order.status !== "processing") return false;
      } else if (activeTab === "completed") {
        if (order.status !== "completed") return false;
      } else if (activeTab === "cancelled") {
        if (order.status !== "cancelled") return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesId = order.id.toLowerCase().includes(query);
        const matchesBook = order.items.some((item) =>
          item.book?.title.toLowerCase().includes(query)
        );
        const matchesVendor = order.items.some((item) =>
          item.vendor?.shop_name.toLowerCase().includes(query)
        );
        return matchesId || matchesBook || matchesVendor;
      }

      return true;
    });
  }, [initialOrders, activeTab, searchQuery]);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 border border-emerald-200/60 mb-2">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>RTDS Platform Guaranteed Orders</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">
            {t.orders.historyTitle}
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            {t.orders.historySubtitle}
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-emerald-600" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by order ID, title, vendor..."
            className="neo-input-recessed w-full rounded-2xl py-2.5 pl-10 pr-4 text-xs font-medium text-slate-800 placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-emerald-100">
        {(
          [
            { id: "all", label: t.orders.filterAll, count: initialOrders.length },
            {
              id: "active",
              label: t.orders.filterActive,
              count: initialOrders.filter(
                (o) => o.status === "pending" || o.status === "processing"
              ).length,
            },
            {
              id: "completed",
              label: t.orders.filterCompleted,
              count: initialOrders.filter((o) => o.status === "completed").length,
            },
            {
              id: "cancelled",
              label: t.orders.filterCancelled,
              count: initialOrders.filter((o) => o.status === "cancelled").length,
            },
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

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="neo-card p-12 text-center space-y-4 max-w-lg mx-auto">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
            <Package className="h-8 w-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-800">
              {t.orders.emptyBuyerTitle}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {t.orders.emptyBuyerSubtitle}
            </p>
          </div>
          <Link
            href="/books"
            className="neo-button-green inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-xs font-bold"
          >
            <Package className="h-4 w-4" />
            <span>{t.orders.startShopping}</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => {
            // Group order items by vendor
            const itemsByVendor = new Map<string, typeof order.items>();
            order.items.forEach((item) => {
              const vendorKey = item.vendor?.id || item.vendor_id;
              const existing = itemsByVendor.get(vendorKey) || [];
              existing.push(item);
              itemsByVendor.set(vendorKey, existing);
            });

            return (
              <div key={order.id} className="neo-card overflow-hidden">
                {/* Order Top Bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-emerald-100 bg-emerald-50/40 p-4 sm:p-5">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="space-y-0.5">
                      <span className="text-[11px] font-medium text-slate-500">
                        {t.orders.orderId}
                      </span>
                      <p className="font-mono text-sm font-black text-slate-900">
                        #{order.id.slice(0, 13).toUpperCase()}
                      </p>
                    </div>

                    <div className="hidden sm:block h-7 w-px bg-emerald-200/60" />

                    <div className="space-y-0.5">
                      <span className="text-[11px] font-medium text-slate-500">
                        {t.orders.orderDate}
                      </span>
                      <p className="text-xs font-semibold text-slate-700">
                        {new Date(order.created_at).toLocaleDateString("en-BD", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>

                    <div className="hidden sm:block h-7 w-px bg-emerald-200/60" />

                    <div className="space-y-0.5">
                      <span className="text-[11px] font-medium text-slate-500">
                        {t.orders.paymentMethod}
                      </span>
                      <p className="text-xs font-semibold text-slate-700">
                        {order.payment_provider === "cod"
                          ? "Cash on Delivery (COD)"
                          : "Digital Payment Gateway"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Status Pill */}
                    <div className="text-right">
                      <span className="text-[11px] font-medium text-slate-500 block">
                        {t.orders.totalAmount}
                      </span>
                      <span className="text-base font-black text-emerald-800">
                        {formatPrice(order.total_minor)}
                      </span>
                    </div>

                    <Link
                      href={`/checkout/success/${order.id}`}
                      className="neo-pill-mint inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-transform hover:scale-105"
                      title={t.orders.viewReceipt}
                    >
                      <Receipt className="h-3.5 w-3.5 text-emerald-700" />
                      <span className="hidden sm:inline">{t.orders.viewReceipt}</span>
                    </Link>
                  </div>
                </div>

                {/* Status Timeline */}
                <div className="p-5 border-b border-emerald-100 bg-white">
                  <div className="relative flex items-center justify-between max-w-2xl mx-auto py-2">
                    {/* Stepper Line */}
                    <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-slate-100 rounded-full z-0">
                      <div
                        className={`h-full bg-emerald-500 transition-all duration-500 rounded-full ${
                          order.status === "completed"
                            ? "w-full"
                            : order.status === "processing"
                            ? "w-2/3"
                            : "w-1/4"
                        }`}
                      />
                    </div>

                    {/* Step 1: Placed */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600 text-white shadow-sm ring-4 ring-emerald-50">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                      <span className="mt-2 text-[11px] font-bold text-slate-800">
                        {t.orders.statusPlaced}
                      </span>
                    </div>

                    {/* Step 2: Packaging */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-full shadow-sm ring-4 ${
                          order.status === "processing" || order.status === "completed"
                            ? "bg-emerald-600 text-white ring-emerald-50"
                            : "bg-slate-200 text-slate-500 ring-slate-100"
                        }`}
                      >
                        <Clock className="h-4 w-4" />
                      </div>
                      <span className="mt-2 text-[11px] font-bold text-slate-800">
                        {t.orders.statusProcessing}
                      </span>
                    </div>

                    {/* Step 3: Shipped */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-full shadow-sm ring-4 ${
                          order.items.some((i) => i.fulfillment_status === "shipped") ||
                          order.status === "completed"
                            ? "bg-emerald-600 text-white ring-emerald-50"
                            : "bg-slate-200 text-slate-500 ring-slate-100"
                        }`}
                      >
                        <Truck className="h-4 w-4" />
                      </div>
                      <span className="mt-2 text-[11px] font-bold text-slate-800">
                        {t.orders.statusShipped}
                      </span>
                    </div>

                    {/* Step 4: Delivered */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-full shadow-sm ring-4 ${
                          order.status === "completed"
                            ? "bg-emerald-600 text-white ring-emerald-50"
                            : "bg-slate-200 text-slate-500 ring-slate-100"
                        }`}
                      >
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                      <span className="mt-2 text-[11px] font-bold text-slate-800">
                        {t.orders.statusDelivered}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Vendor Packages Section */}
                <div className="p-5 space-y-6">
                  {Array.from(itemsByVendor.entries()).map(([vendorId, items], vIdx) => {
                    const vendorInfo = items[0]?.vendor;
                    const vendorStatus = items[0]?.fulfillment_status || "pending";
                    const trackingNumber = items[0]?.tracking_number;
                    const trackingUrl = getCourierTrackingUrl(trackingNumber);

                    return (
                      <div
                        key={vendorId || vIdx}
                        className="rounded-2xl border border-emerald-100 bg-slate-50/50 p-4 space-y-3"
                      >
                        {/* Package Header */}
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-100/70 pb-3">
                          <div className="flex items-center gap-2">
                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                              <Store className="h-4 w-4" />
                            </div>
                            <div>
                              <Link
                                href={vendorInfo?.slug ? `/vendors/${vendorInfo.slug}` : "#"}
                                className="text-xs font-bold text-slate-900 hover:text-emerald-700 hover:underline flex items-center gap-1"
                              >
                                <span>{vendorInfo?.shop_name || "Verified Bookstore"}</span>
                                <ChevronRight className="h-3 w-3 text-slate-400" />
                              </Link>
                              <span className="text-[10px] text-slate-500">
                                {items.length} {items.length > 1 ? "books" : "book"} in this package
                              </span>
                            </div>
                          </div>

                          {/* Fulfillment Status & Tracking */}
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                                vendorStatus === "delivered"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : vendorStatus === "shipped"
                                  ? "bg-blue-100 text-blue-800"
                                  : vendorStatus === "cancelled"
                                  ? "bg-rose-100 text-rose-800"
                                  : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              {vendorStatus === "delivered" ? (
                                <CheckCircle2 className="h-3 w-3" />
                              ) : vendorStatus === "shipped" ? (
                                <Truck className="h-3 w-3" />
                              ) : vendorStatus === "cancelled" ? (
                                <XCircle className="h-3 w-3" />
                              ) : (
                                <Clock className="h-3 w-3" />
                              )}
                              <span>
                                {vendorStatus === "delivered"
                                  ? t.orders.statusDelivered
                                  : vendorStatus === "shipped"
                                  ? t.orders.statusShipped
                                  : vendorStatus === "cancelled"
                                  ? t.orders.statusCancelled
                                  : t.orders.statusProcessing}
                              </span>
                            </span>

                            {trackingNumber && (
                              <div className="flex items-center gap-1.5">
                                <span className="font-mono text-[11px] font-bold text-slate-700 bg-white border border-slate-200 px-2 py-0.5 rounded-md">
                                  {trackingNumber}
                                </span>
                                {trackingUrl && (
                                  <a
                                    href={trackingUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="neo-button-green inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-bold text-white shadow-sm"
                                  >
                                    <ExternalLink className="h-3 w-3" />
                                    <span>{t.orders.trackParcel}</span>
                                  </a>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Package Books */}
                        <div className="divide-y divide-emerald-50">
                          {items.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center justify-between gap-4 py-2 text-xs"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="relative h-12 w-10 flex-shrink-0 overflow-hidden rounded-md border border-slate-200 bg-white">
                                  <Image
                                    src={getR2ImageUrl(item.book?.coverUrl)}
                                    alt={item.book?.title || "Book"}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <div className="min-w-0 space-y-0.5">
                                  <Link
                                    href={item.book_id ? `/books/${item.book_id}` : "#"}
                                    className="font-bold text-slate-800 hover:text-emerald-700 truncate block"
                                  >
                                    {item.book?.title || "Book"}
                                  </Link>
                                  <p className="text-[11px] text-slate-500 truncate">
                                    {item.book?.author}
                                  </p>
                                  {item.book?.condition && (
                                    <span className="inline-block rounded bg-slate-200/80 px-1.5 py-0.5 text-[9px] font-semibold uppercase text-slate-700">
                                      {item.book.condition}
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="text-right flex-shrink-0">
                                <span className="text-[11px] text-slate-500">
                                  {item.qty} × {formatPrice(item.unit_price_minor)}
                                </span>
                                <p className="font-bold text-slate-800">
                                  {formatPrice(item.qty * item.unit_price_minor)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}

                  {/* Delivery Destination Snippet */}
                  <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-emerald-50/50 p-3 text-xs text-slate-700">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-emerald-700 flex-shrink-0" />
                      <span>
                        <strong className="font-bold text-slate-900">
                          {order.shippingAddressParsed.fullName}
                        </strong>{" "}
                        — {order.shippingAddressParsed.streetAddress},{" "}
                        {order.shippingAddressParsed.district},{" "}
                        {order.shippingAddressParsed.division}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 font-medium text-slate-600">
                      <Phone className="h-3.5 w-3.5 text-emerald-600" />
                      <span>{order.shippingAddressParsed.phone}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
