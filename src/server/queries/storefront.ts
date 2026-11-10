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
    "⚡ Nationwide Cash on Delivery | Free shipping on orders over ৳1,000",
  announcement_enabled: true,
  helpline_phone: "09612-007837",
  helpline_hours: "9:00 AM - 10:00 PM",
  free_shipping_threshold_minor: 100000, // ৳ 1,000
  flat_shipping_rate_minor: 7000, // ৳ 70
  emergency_alert: null,
  emergency_alert_enabled: false,
  updated_at: new Date().toISOString(),
};

export const DEFAULT_HERO_SLIDES: HeroSlideRow[] = [
  {
    id: "66666666-6666-6666-6666-666666666601",
    title: "Trusted Marketplace for Medical, Engineering & Academic Books",
    subtitle:
      "Order RTDS Medical Master Series, Engineering Admission Guides, Academic Textbooks, and Literature in one cart directly from verified publishers and bookstores.",
    badge_text: "RTDS National Book Fair & Admission Fest 2026",
    cta_text: "Browse Book Catalog",
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
    title: "Trending Bestsellers",
    subtitle: "Top-selling books loved by thousands of readers nationwide",
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
    title: "Medical & University Admission Prep (RTDS Master Series)",
    subtitle:
      "Official RTDS question banks, shortcut techniques, and comprehensive model test papers",
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
    title: "Literature, Philosophy & Classics",
    subtitle:
      "Classic Bengali novels, Nobel laureate international literature, and special collector editions",
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
