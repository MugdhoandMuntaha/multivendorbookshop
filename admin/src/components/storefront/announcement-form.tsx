"use client";

import { useState } from "react";
import { Bell, PhoneCall, Truck, Save, Check } from "lucide-react";
import { StorefrontSettingsRow } from "@/server/queries/admin";
import { updateStorefrontSettingsAction } from "@/server/actions/storefront";

interface AnnouncementFormProps {
  initialSettings: StorefrontSettingsRow;
}

export function AnnouncementForm({ initialSettings }: AnnouncementFormProps) {
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [siteName, setSiteName] = useState(initialSettings.site_name || "RTDS Bookshop");
  const [tagline, setTagline] = useState(
    initialSettings.tagline || "Official Book Marketplace of RTDS Platform"
  );
  const [announcementText, setAnnouncementText] = useState(
    initialSettings.announcement_text ||
      "⚡ Nationwide Cash on Delivery | Free shipping on orders over ৳1,000"
  );
  const [announcementEnabled, setAnnouncementEnabled] = useState(
    Boolean(initialSettings.announcement_enabled)
  );
  const [helplinePhone, setHelplinePhone] = useState(
    initialSettings.helpline_phone || "09612-007837"
  );
  const [helplineHours, setHelplineHours] = useState(
    initialSettings.helpline_hours || "9:00 AM - 10:00 PM"
  );
  const [freeShippingBdt, setFreeShippingBdt] = useState(
    (initialSettings.free_shipping_threshold_minor || 100000) / 100
  );
  const [flatShippingBdt, setFlatShippingBdt] = useState(
    (initialSettings.flat_shipping_rate_minor || 7000) / 100
  );
  const [emergencyAlert, setEmergencyAlert] = useState(
    initialSettings.emergency_alert || ""
  );
  const [emergencyAlertEnabled, setEmergencyAlertEnabled] = useState(
    Boolean(initialSettings.emergency_alert_enabled)
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setSaved(false);

    const formData = new FormData();
    formData.set("site_name", siteName);
    formData.set("tagline", tagline);
    formData.set("announcement_text", announcementText);
    formData.set("announcement_enabled", String(announcementEnabled));
    formData.set("helpline_phone", helplinePhone);
    formData.set("helpline_hours", helplineHours);
    formData.set("free_shipping_threshold_bdt", String(freeShippingBdt));
    formData.set("flat_shipping_rate_bdt", String(flatShippingBdt));
    formData.set("emergency_alert", emergencyAlert);
    formData.set("emergency_alert_enabled", String(emergencyAlertEnabled));

    const res = await updateStorefrontSettingsAction(formData);
    setLoading(false);

    if (res.success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } else {
      alert("Error: " + res.error);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900">
            Announcement, Helpline & Shipping Rules
          </h2>
          <p className="text-xs text-slate-500">
            Real-time configuration for top ticker announcement bar, customer hotline, and delivery rates
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="neo-button-green flex h-9 items-center gap-1.5 rounded-xl px-5 text-xs font-bold disabled:opacity-50"
        >
          {saved ? (
            <>
              <Check className="h-4 w-4" />
              <span>Saved Successfully!</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              <span>{loading ? "Saving..." : "Save Changes"}</span>
            </>
          )}
        </button>
      </div>

      {/* 1. Platform Identity */}
      <div className="neo-card p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 border-b border-emerald-100 pb-2.5">
          Platform Identity
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Site Name</label>
            <input
              type="text"
              required
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              className="neo-input-recessed w-full rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-900"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Tagline</label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="neo-input-recessed w-full rounded-xl px-3.5 py-2 text-xs"
            />
          </div>
        </div>
      </div>

      {/* 2. Top Announcement Bar */}
      <div className="neo-card p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-emerald-100 pb-2.5">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Top Announcement Ticker
            </h3>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={announcementEnabled}
              onChange={(e) => setAnnouncementEnabled(e.target.checked)}
              className="h-4 w-4 rounded accent-emerald-600"
            />
            <span className="text-xs font-bold text-slate-700">Enable Ticker</span>
          </label>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">
            Ticker Message Text
          </label>
          <input
            type="text"
            value={announcementText}
            onChange={(e) => setAnnouncementText(e.target.value)}
            placeholder="⚡ Nationwide Cash on Delivery | Free shipping on orders over ৳1,000"
            className="neo-input-recessed w-full rounded-xl px-3.5 py-2 text-xs"
          />
          <p className="text-[11px] text-slate-400">
            This message appears on the topmost emerald banner across the customer storefront.
          </p>
        </div>
      </div>

      {/* 3. Customer Helpline */}
      <div className="neo-card p-6 space-y-4">
        <div className="flex items-center gap-2 border-b border-emerald-100 pb-2.5">
          <PhoneCall className="h-4 w-4 text-emerald-600" />
          <h3 className="text-sm font-bold text-slate-900">
            Customer Helpline & Support
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">
              Helpline Phone Number
            </label>
            <input
              type="text"
              value={helplinePhone}
              onChange={(e) => setHelplinePhone(e.target.value)}
              placeholder="09612-007837"
              className="neo-input-recessed w-full rounded-xl px-3.5 py-2 text-xs font-semibold text-emerald-800"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">
              Operating Hours
            </label>
            <input
              type="text"
              value={helplineHours}
              onChange={(e) => setHelplineHours(e.target.value)}
              placeholder="9:00 AM - 10:00 PM"
              className="neo-input-recessed w-full rounded-xl px-3.5 py-2 text-xs"
            />
          </div>
        </div>
      </div>

      {/* 4. Delivery & Shipping Rates */}
      <div className="neo-card p-6 space-y-4">
        <div className="flex items-center gap-2 border-b border-emerald-100 pb-2.5">
          <Truck className="h-4 w-4 text-emerald-600" />
          <h3 className="text-sm font-bold text-slate-900">
            Nationwide Shipping Rates (BDT ৳)
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">
              Free Delivery Minimum Order Threshold (৳ BDT)
            </label>
            <input
              type="number"
              value={freeShippingBdt}
              onChange={(e) => setFreeShippingBdt(Number(e.target.value))}
              className="neo-input-recessed w-full rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900"
            />
            <p className="text-[11px] text-slate-400">
              Orders equal to or exceeding this amount automatically receive free courier delivery.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">
              Flat Delivery Fee (৳ BDT)
            </label>
            <input
              type="number"
              value={flatShippingBdt}
              onChange={(e) => setFlatShippingBdt(Number(e.target.value))}
              className="neo-input-recessed w-full rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900"
            />
            <p className="text-[11px] text-slate-400">
              Standard doorstep delivery rate charged via courier partners (Steadfast/Pathao/RedX).
            </p>
          </div>
        </div>
      </div>
    </form>
  );
}
