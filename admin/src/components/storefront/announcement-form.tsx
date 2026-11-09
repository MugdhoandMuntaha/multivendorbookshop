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
  const [tagline, setTagline] = useState(initialSettings.tagline || "");
  const [announcementText, setAnnouncementText] = useState(
    initialSettings.announcement_text || ""
  );
  const [announcementEnabled, setAnnouncementEnabled] = useState(
    Boolean(initialSettings.announcement_enabled)
  );
  const [helplinePhone, setHelplinePhone] = useState(
    initialSettings.helpline_phone || ""
  );
  const [helplineHours, setHelplineHours] = useState(
    initialSettings.helpline_hours || ""
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
            অ্যানাউন্সমেন্ট, হেল্পলাইন ও ডেলিভারি রেট
          </h2>
          <p className="text-xs text-slate-500">
            স্টোরফ্রন্টের টপ বার, গ্রাহক হেল্পলাইন এবং শিপিং শর্তাবলী লাইভ আপডেট করুন
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
              <span>আপডেট সম্পন্ন হয়েছে!</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              <span>{loading ? "সংরক্ষণ করা হচ্ছে..." : "পরিবর্তন সংরক্ষণ করুন"}</span>
            </>
          )}
        </button>
      </div>

      {/* 1. Brand Identity */}
      <div className="neo-card p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 border-b border-emerald-100 pb-2.5">
          প্ল্যাটফর্ম পরিচয় (Platform Identity)
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">সাইটের নাম (Site Name)</label>
            <input
              type="text"
              required
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              className="neo-input-recessed w-full rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-900"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">ট্যাগলাইন (Tagline)</label>
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
              টপ অ্যানাউন্সমেন্ট টিকার (Top Announcement Bar)
            </h3>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={announcementEnabled}
              onChange={(e) => setAnnouncementEnabled(e.target.checked)}
              className="h-4 w-4 rounded accent-emerald-600"
            />
            <span className="text-xs font-bold text-slate-700">টিকার সক্রিয় রাখুন</span>
          </label>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">
            বিজ্ঞপ্তি বার্তা (Announcement Ticker Text)
          </label>
          <input
            type="text"
            value={announcementText}
            onChange={(e) => setAnnouncementText(e.target.value)}
            placeholder="⚡ সারা দেশে ক্যাশ অন ডেলিভারি | ৳১,০০০ টাকার অর্ডারে ফ্রি ডেলিভারি"
            className="neo-input-recessed w-full rounded-xl px-3.5 py-2 text-xs"
          />
          <p className="text-[11px] text-slate-400">
            এই বার্তাটি স্টোরফ্রন্টের সর্বোচ্চ শীর্ষে ডিপ এমারেল্ড ব্যানারে প্রদর্শিত হবে।
          </p>
        </div>
      </div>

      {/* 3. Customer Helpline */}
      <div className="neo-card p-6 space-y-4">
        <div className="flex items-center gap-2 border-b border-emerald-100 pb-2.5">
          <PhoneCall className="h-4 w-4 text-emerald-600" />
          <h3 className="text-sm font-bold text-slate-900">
            গ্রাহক সহায়তা ও হেল্পলাইন (Customer Helpline)
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">
              হেল্পলাইন নম্বর (Phone Number)
            </label>
            <input
              type="text"
              value={helplinePhone}
              onChange={(e) => setHelplinePhone(e.target.value)}
              placeholder="০৯৬১২-০০৭৮৩৭"
              className="neo-input-recessed w-full rounded-xl px-3.5 py-2 text-xs font-semibold text-emerald-800"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">
              অপারেটিং সময়সীমা (Service Hours)
            </label>
            <input
              type="text"
              value={helplineHours}
              onChange={(e) => setHelplineHours(e.target.value)}
              placeholder="সকাল ৯টা - রাত ১০টা"
              className="neo-input-recessed w-full rounded-xl px-3.5 py-2 text-xs"
            />
          </div>
        </div>
      </div>

      {/* 4. Delivery & Nationwide Shipping Rates */}
      <div className="neo-card p-6 space-y-4">
        <div className="flex items-center gap-2 border-b border-emerald-100 pb-2.5">
          <Truck className="h-4 w-4 text-emerald-600" />
          <h3 className="text-sm font-bold text-slate-900">
            ডেলিভারি চার্জ ও ফ্রি ডেলিভারি থ্রেশহোল্ড (Shipping Logic)
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">
              ফ্রি ডেলিভারি ন্যূনতম অর্ডার (৳ BDT)
            </label>
            <input
              type="number"
              value={freeShippingBdt}
              onChange={(e) => setFreeShippingBdt(Number(e.target.value))}
              className="neo-input-recessed w-full rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900"
            />
            <p className="text-[11px] text-slate-400">
              এই পরিমাণের সমপরিমাণ বা বেশি মূল্যের অর্ডারে স্বয়ংক্রিয়ভাবে শিপিং চার্জ ফ্রি হবে।
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">
              সারাদেশে স্ট্যান্ডার্ড ডেলিভারি চার্জ (৳ BDT)
            </label>
            <input
              type="number"
              value={flatShippingBdt}
              onChange={(e) => setFlatShippingBdt(Number(e.target.value))}
              className="neo-input-recessed w-full rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900"
            />
            <p className="text-[11px] text-slate-400">
              কুরিয়ার (Steadfast/RedX/Pathao) পার্টনারদের মাধ্যমে হোম ডেলিভারির নির্ধারিত ফি।
            </p>
          </div>
        </div>
      </div>
    </form>
  );
}
