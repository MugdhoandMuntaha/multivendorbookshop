import { createClient } from "@/lib/supabase/server";
import { Database } from "@/types/database";

export type StorefrontSettingsRow =
  Database["public"]["Tables"]["storefront_settings"]["Row"];
export type HeroSlideRow = Database["public"]["Tables"]["hero_slides"]["Row"];
export type CuratedShelfRow =
  Database["public"]["Tables"]["curated_shelves"]["Row"];

export const DEFAULT_STOREFRONT_SETTINGS: StorefrontSettingsRow = {
  id: "global",
  site_name: "RTDS Bookshop",
  tagline: "Official Book Marketplace of RTDS Platform",
  announcement_text:
    "⚡ সারা দেশে ক্যাশ অন ডেলিভারি | ৳১,০০০ টাকার অর্ডারে ফ্রি ডেলিভারি",
  announcement_enabled: true,
  helpline_phone: "০৯৬১২-০০৭৮৩৭",
  helpline_hours: "সকাল ৯টা - রাত ১০টা",
  free_shipping_threshold_minor: 100000, // ৳ 1,000
  flat_shipping_rate_minor: 7000, // ৳ 70
  emergency_alert: null,
  emergency_alert_enabled: false,
  updated_at: new Date().toISOString(),
};

export const DEFAULT_HERO_SLIDES: HeroSlideRow[] = [
  {
    id: "66666666-6666-6666-6666-666666666601",
    title: "মেডিকেল, প্রকৌশল ও একাডেমিক বইয়ের বিশ্বস্ত মার্কেটপ্লেস",
    subtitle:
      "RTDS মেডিকেল মাস্টার সিরিজ, ইঞ্জিনিয়ারিং ভর্তি সহায়িকা, একাডেমিক গাইড এবং সাহিত্য এক কার্টে অর্ডার করুন সরাসরি নির্ভরযোগ্য প্রকাশক ও বুকশপ থেকে।",
    badge_text: "RTDS জাতীয় বইমেলা ও ভর্তি উৎসব ২০২৬",
    cta_text: "বইয়ের তালিকা দেখুন (Catalog)",
    cta_link: "/books",
    image_r2_key: null,
    bg_gradient: "from-emerald-800 via-emerald-700 to-teal-800",
    sort_order: 0,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const DEFAULT_CURATED_SHELVES: CuratedShelfRow[] = [
  {
    id: "77777777-7777-7777-7777-777777777701",
    title: "সর্বাধিক বিক্রিত বইসমূহ (Trending Bestsellers)",
    subtitle: "দেশজুড়ে হাজারো পাঠকের পছন্দের তালিকায় থাকা সেরা বইসমূহ",
    category_id: null,
    shelf_type: "bestseller",
    icon_name: "Flame",
    max_items: 4,
    sort_order: 0,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "77777777-7777-7777-7777-777777777702",
    title: "মেডিকেল ও বিশ্ববিদ্যালয় ভর্তি প্রস্তুতি (RTDS Master Series)",
    subtitle:
      "RTDS অফিসিয়াল প্রশ্নব্যাংক, শর্টকাট টেকনিক ও পূর্ণাঙ্গ মডেল টেস্ট পেপার",
    category_id: "22222222-2222-2222-2222-222222222203",
    shelf_type: "admission_special",
    icon_name: "GraduationCap",
    max_items: 4,
    sort_order: 1,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "77777777-7777-7777-7777-777777777703",
    title: "সাহিত্য, দর্শন ও ধ্রুপদী সংগ্রহ (Literature & Classics)",
    subtitle:
      "ধ্রুপদী বাংলা উপন্যাস, নোবেলজয়ী আন্তর্জাতিক সাহিত্য ও সংগ্রাহকদের বিশেষ বাঁধাইকৃত সংস্করণ",
    category_id: "22222222-2222-2222-2222-222222222201",
    shelf_type: "literature_rare",
    icon_name: "Sparkles",
    max_items: 4,
    sort_order: 2,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

/**
 * Gets live storefront configuration (announcement text, helpline phone, delivery thresholds).
 */
export async function getStorefrontSettings(): Promise<StorefrontSettingsRow> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("storefront_settings")
      .select("*")
      .eq("id", "global")
      .maybeSingle();

    if (error || !data) {
      return DEFAULT_STOREFRONT_SETTINGS;
    }

    return data as StorefrontSettingsRow;
  } catch {
    return DEFAULT_STOREFRONT_SETTINGS;
  }
}

/**
 * Gets active hero campaign slides ordered by sort_order.
 */
export async function getActiveHeroSlides(): Promise<HeroSlideRow[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("hero_slides")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) {
      return DEFAULT_HERO_SLIDES;
    }

    return data as HeroSlideRow[];
  } catch {
    return DEFAULT_HERO_SLIDES;
  }
}

/**
 * Gets active curated shelves configured by the admin CMS.
 */
export async function getActiveCuratedShelves(): Promise<CuratedShelfRow[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("curated_shelves")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) {
      return DEFAULT_CURATED_SHELVES;
    }

    return data as CuratedShelfRow[];
  } catch {
    return DEFAULT_CURATED_SHELVES;
  }
}
