"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Banknote,
  ArrowRight,
  Store,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useCart } from "@/lib/cart/context";
import { useLanguage } from "@/lib/i18n/context";
import { formatPrice } from "@/lib/utils";
import { checkoutOrderAction } from "@/server/actions/checkout";

const BANGLADESH_DIVISIONS: Record<string, string[]> = {
  Dhaka: [
    "Dhaka",
    "Gazipur",
    "Narayanganj",
    "Tangail",
    "Kishoreganj",
    "Manikganj",
    "Munshiganj",
    "Narsingdi",
    "Faridpur",
    "Gopalganj",
    "Madaripur",
    "Rajbari",
    "Shariatpur",
  ],
  Chattogram: [
    "Chattogram",
    "Cox's Bazar",
    "Cumilla",
    "Feni",
    "Brahmanbaria",
    "Noakhali",
    "Chandpur",
    "Lakshmipur",
    "Rangamati",
    "Khagrachhari",
    "Bandarban",
  ],
  Rajshahi: [
    "Rajshahi",
    "Bogura",
    "Pabna",
    "Sirajganj",
    "Naogaon",
    "Natore",
    "Chapainawabganj",
    "Joypurhat",
  ],
  Khulna: [
    "Khulna",
    "Jashore",
    "Kushtia",
    "Jhenaidah",
    "Satkhira",
    "Bagerhat",
    "Chuadanga",
    "Meherpur",
    "Narail",
    "Magura",
  ],
  Barishal: [
    "Barishal",
    "Patuakhali",
    "Bhola",
    "Pirojpur",
    "Barguna",
    "Jhalokati",
  ],
  Sylhet: ["Sylhet", "Moulvibazar", "Habiganj", "Sunamganj"],
  Rangpur: [
    "Rangpur",
    "Dinajpur",
    "Gaibandha",
    "Kurigram",
    "Lalmonirhat",
    "Nilphamari",
    "Panchagarh",
    "Thakurgaon",
  ],
  Mymensingh: ["Mymensingh", "Jamalpur", "Netrokona", "Sherpur"],
};

interface CheckoutFormProps {
  userFullName?: string;
}

export function CheckoutForm({ userFullName }: CheckoutFormProps) {
  const router = useRouter();
  const { items, calculations, clearCart } = useCart();
  const { t, locale } = useLanguage();

  const [fullName, setFullName] = useState(userFullName || "");
  const [phone, setPhone] = useState("");
  const [division, setDivision] = useState("Dhaka");
  const [district, setDistrict] = useState("Dhaka");
  const [streetAddress, setStreetAddress] = useState("");
  const [deliveryNotes, setDeliveryNotes] = useState("");
  const [paymentProvider, setPaymentProvider] = useState<"cod" | "mock">("cod");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Available districts for chosen division
  const availableDistricts = BANGLADESH_DIVISIONS[division] || [];

  function handleDivisionChange(newDivision: string) {
    setDivision(newDivision);
    const districts = BANGLADESH_DIVISIONS[newDivision] || [];
    setDistrict(districts[0] || "");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (items.length === 0) {
      setError("Your cart is empty. Please add books before checkout.");
      return;
    }

    if (!fullName.trim() || fullName.trim().length < 2) {
      setError("Please provide your full name.");
      return;
    }

    const bdPhoneRegex = /^(?:\+8801|01)[3-9]\d{8}$/;
    if (!bdPhoneRegex.test(phone.trim())) {
      setError(
        "Please enter a valid Bangladeshi mobile number (e.g. 01712345678 or +8801812345678)."
      );
      return;
    }

    if (!streetAddress.trim() || streetAddress.trim().length < 5) {
      setError("Please provide your full street address, house/road number, and area.");
      return;
    }

    setIsSubmitting(true);

    try {
      const orderItemsPayload = items.map((i) => ({
        book_id: i.bookId,
        qty: i.qty,
      }));

      const result = await checkoutOrderAction({
        fullName: fullName.trim(),
        phone: phone.trim(),
        division,
        district,
        streetAddress: streetAddress.trim(),
        deliveryNotes: deliveryNotes.trim() || undefined,
        paymentProvider,
        items: orderItemsPayload,
      });

      if (!result.success || !result.orderId) {
        setError(result.error || "Failed to place order. Please try again.");
        setIsSubmitting(false);
        return;
      }

      // Order placed successfully! Clear cart & redirect
      clearCart();
      router.push(`/checkout/success/${result.orderId}`);
    } catch {
      setError("An unexpected error occurred while placing order. Please retry.");
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Column: Delivery Address & Payment Method (7 cols) */}
      <div className="lg:col-span-7 space-y-6">
        {/* Error Alert */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-start gap-2.5 animate-in fade-in">
            <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* 1. Address Form Section */}
        <div className="neo-card p-6 sm:p-7 rounded-2xl space-y-5 border border-emerald-950/5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-emerald-100/60">
            <Truck className="h-5 w-5 text-emerald-600" />
            <h2 className="text-base font-bold text-slate-900">
              {t.checkout.shippingInfo}
            </h2>
          </div>

          <div className="space-y-4 text-xs">
            {/* Full Name */}
            <div>
              <label className="block text-slate-700 font-bold mb-1.5 uppercase tracking-wider text-[11px]">
                {t.checkout.fullName} *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Tahmid Hasan"
                className="neo-input-recessed w-full px-3.5 py-2.5 text-xs rounded-xl"
              />
            </div>

            {/* Mobile Phone */}
            <div>
              <label className="block text-slate-700 font-bold mb-1.5 uppercase tracking-wider text-[11px]">
                {t.checkout.phone} *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="01712345678"
                className="neo-input-recessed w-full px-3.5 py-2.5 text-xs rounded-xl"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Order status and delivery OTP notifications will be sent to this number.
              </span>
            </div>

            {/* Division & District Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-bold mb-1.5 uppercase tracking-wider text-[11px]">
                  {t.checkout.division} *
                </label>
                <select
                  value={division}
                  onChange={(e) => handleDivisionChange(e.target.value)}
                  className="neo-input-recessed w-full px-3 py-2.5 text-xs rounded-xl cursor-pointer"
                >
                  {Object.keys(BANGLADESH_DIVISIONS).map((div) => (
                    <option key={div} value={div}>
                      {div}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1.5 uppercase tracking-wider text-[11px]">
                  {t.checkout.district} *
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="neo-input-recessed w-full px-3 py-2.5 text-xs rounded-xl cursor-pointer"
                >
                  {availableDistricts.map((dst) => (
                    <option key={dst} value={dst}>
                      {dst}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Detailed Street Address */}
            <div>
              <label className="block text-slate-700 font-bold mb-1.5 uppercase tracking-wider text-[11px]">
                {t.checkout.streetAddress} *
              </label>
              <textarea
                required
                rows={3}
                value={streetAddress}
                onChange={(e) => setStreetAddress(e.target.value)}
                placeholder={t.checkout.streetAddressPlaceholder}
                className="neo-input-recessed w-full px-3.5 py-2 text-xs rounded-xl resize-none"
              />
            </div>

            {/* Delivery Instructions */}
            <div>
              <label className="block text-slate-700 font-bold mb-1.5 uppercase tracking-wider text-[11px]">
                {t.checkout.deliveryNotes}
              </label>
              <input
                type="text"
                value={deliveryNotes}
                onChange={(e) => setDeliveryNotes(e.target.value)}
                placeholder={t.checkout.deliveryNotesPlaceholder}
                className="neo-input-recessed w-full px-3.5 py-2 text-xs rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* 2. Payment Method Selector */}
        <div className="neo-card p-6 sm:p-7 rounded-2xl space-y-4 border border-emerald-950/5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-emerald-100/60">
            <CreditCard className="h-5 w-5 text-emerald-600" />
            <h2 className="text-base font-bold text-slate-900">
              {t.checkout.paymentMethod}
            </h2>
          </div>

          <div className="space-y-3">
            {/* Cash on Delivery (COD) */}
            <label
              onClick={() => setPaymentProvider("cod")}
              className={`flex items-start gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                paymentProvider === "cod"
                  ? "border-emerald-600 bg-emerald-50/50 shadow-xs"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                checked={paymentProvider === "cod"}
                onChange={() => setPaymentProvider("cod")}
                className="mt-1 h-4 w-4 text-emerald-600 accent-emerald-600 cursor-pointer"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Banknote className="h-4 w-4 text-emerald-700" />
                  <span className="text-xs font-bold text-slate-900">
                    {t.checkout.codTitle}
                  </span>
                  <span className="neo-pill-mint px-2 py-0.5 text-[10px] font-bold">
                    Recommended
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {t.checkout.codDesc}
                </p>
              </div>
            </label>

            {/* Instant Online Payment (Mock / Digital Sandbox) */}
            <label
              onClick={() => setPaymentProvider("mock")}
              className={`flex items-start gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                paymentProvider === "mock"
                  ? "border-emerald-600 bg-emerald-50/50 shadow-xs"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                checked={paymentProvider === "mock"}
                onChange={() => setPaymentProvider("mock")}
                className="mt-1 h-4 w-4 text-emerald-600 accent-emerald-600 cursor-pointer"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-emerald-700" />
                  <span className="text-xs font-bold text-slate-900">
                    {t.checkout.onlineTitle}
                  </span>
                  <span className="neo-pill-mint px-2 py-0.5 text-[10px] font-bold">
                    Sandbox Mock
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {t.checkout.onlineDesc}
                </p>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Right Column: Order Review & Placement CTA (5 cols) */}
      <div className="lg:col-span-5 space-y-6">
        <div className="neo-card p-6 rounded-2xl space-y-5 sticky top-24 border border-emerald-950/5">
          <h2 className="text-base font-bold text-slate-900 border-b border-emerald-100/60 pb-3">
            {t.checkout.orderReview}
          </h2>

          {/* Multi-Vendor Items Summary */}
          <div className="space-y-4 max-h-60 overflow-y-auto pr-1">
            {calculations.groups.map((g) => (
              <div key={g.vendorId} className="space-y-2 text-xs">
                <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-[11px]">
                  <Store className="h-3 w-3" />
                  <span>{g.vendorName}</span>
                </div>
                <div className="divide-y divide-slate-100 bg-slate-50/70 p-3 rounded-xl border border-slate-200/60">
                  {g.items.map((it) => (
                    <div
                      key={it.bookId}
                      className="py-1.5 flex items-center justify-between text-xs"
                    >
                      <div className="truncate max-w-[170px]">
                        <span className="font-semibold text-slate-800">
                          {it.title}
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          Qty: {it.qty} × {formatPrice(it.priceMinor, it.currency)}
                        </span>
                      </div>
                      <span className="font-bold text-slate-900">
                        {formatPrice(it.priceMinor * it.qty, it.currency)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Pricing Totals */}
          <dl className="space-y-2.5 border-t border-emerald-100/60 pt-4 text-xs">
            <div className="flex items-center justify-between text-slate-600">
              <dt>{t.cart.subtotal}</dt>
              <dd className="font-bold text-slate-900">
                {formatPrice(calculations.subtotalMinor, "BDT")}
              </dd>
            </div>

            <div className="flex items-center justify-between text-slate-600">
              <dt>{t.cart.deliveryFee}</dt>
              <dd className="font-bold">
                {calculations.isFreeShipping ? (
                  <span className="text-emerald-700 uppercase font-black">
                    {locale === "bn" ? "ফ্রি" : "Free"}
                  </span>
                ) : (
                  <span className="text-slate-900">
                    {formatPrice(calculations.shippingTotalMinor, "BDT")}
                  </span>
                )}
              </dd>
            </div>

            <div className="border-t border-emerald-100/60 pt-3 flex items-baseline justify-between">
              <dt className="text-sm font-black text-slate-900">
                {t.cart.total}
              </dt>
              <dd className="text-xl font-black text-emerald-800">
                {formatPrice(calculations.totalMinor, "BDT")}
              </dd>
            </div>
          </dl>

          {/* Order Placement Trigger */}
          <button
            type="submit"
            disabled={isSubmitting || items.length === 0}
            className="neo-button-green w-full flex items-center justify-center gap-2 py-3.5 px-4 text-xs font-black rounded-xl shadow-md disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>{t.checkout.placingOrder}</span>
              </>
            ) : (
              <>
                <span>{t.checkout.placeOrder}</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>

          <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 font-semibold pt-1">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            <span>Guaranteed by RTDS Verified Marketplace</span>
          </div>
        </div>
      </div>
    </form>
  );
}
