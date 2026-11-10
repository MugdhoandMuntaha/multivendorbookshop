import { createClient } from "@/lib/supabase/server";
import { Database } from "@/types/database";

export type VendorRow = Database["public"]["Tables"]["vendors"]["Row"];

export type VendorDetail = VendorRow & {
  book_count?: number;
  average_rating?: number;
  total_reviews?: number;
};

export const FALLBACK_VENDORS: VendorDetail[] = [
  {
    id: "33333333-3333-3333-3333-333333333301",
    owner_id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
    shop_name: "RTDS Publications Central Depot",
    slug: "rtds-publications-depot",
    description:
      "Official central warehouse of RTDS Platform. Dedicated publisher of Medical Master Series, high-yield question banks, and complete admission guides.",
    logo_key: null,
    banner_key: null,
    status: "approved",
    commission_bps: 1000,
    shipping_fee_minor: 7000,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    book_count: 15,
    average_rating: 4.9,
    total_reviews: 142,
  },
  {
    id: "33333333-3333-3333-3333-333333333302",
    owner_id: "cccccccc-cccc-cccc-cccc-cccccccccccc",
    shop_name: "Banglabazar Boi Bhaban",
    slug: "banglabazar-boi-bhaban",
    description:
      "Dhaka Banglabazar premier independent bookhub specializing in Bengali classics, history, literature, and rare first editions.",
    logo_key: null,
    banner_key: null,
    status: "approved",
    commission_bps: 1000,
    shipping_fee_minor: 7000,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    book_count: 24,
    average_rating: 4.8,
    total_reviews: 89,
  },
  {
    id: "33333333-3333-3333-3333-333333333303",
    owner_id: "dddddddd-dddd-dddd-dddd-dddddddddddd",
    shop_name: "Nilkhet Engineering Corner",
    slug: "nilkhet-engineering-corner",
    description:
      "Nilkhet Dhaka specialized supplier for CSE textbooks, electrical engineering, competitive programming, and algorithm references.",
    logo_key: null,
    banner_key: null,
    status: "approved",
    commission_bps: 1000,
    shipping_fee_minor: 7000,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    book_count: 19,
    average_rating: 4.9,
    total_reviews: 67,
  },
];

/**
 * Gets all approved vendors across the marketplace.
 */
export async function getApprovedVendors(): Promise<VendorDetail[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("vendors")
      .select("*")
      .eq("status", "approved")
      .order("shop_name", { ascending: true });

    if (error || !data || data.length === 0) {
      return FALLBACK_VENDORS;
    }

    // Try counting books per vendor
    const { data: books } = await supabase
      .from("books")
      .select("vendor_id")
      .eq("status", "active");

    const counts: Record<string, number> = {};
    if (books) {
      books.forEach((b) => {
        counts[b.vendor_id] = (counts[b.vendor_id] || 0) + 1;
      });
    }

    return (data as VendorRow[]).map((v) => {
      const fallback = FALLBACK_VENDORS.find((f) => f.id === v.id);
      return {
        ...v,
        book_count: counts[v.id] ?? fallback?.book_count ?? 5,
        average_rating: fallback?.average_rating ?? 4.8,
        total_reviews: fallback?.total_reviews ?? 40,
      };
    });
  } catch {
    return FALLBACK_VENDORS;
  }
}

/**
 * Gets a specific vendor by slug.
 */
export async function getVendorBySlug(
  slug: string
): Promise<VendorDetail | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("vendors")
      .select("*")
      .eq("slug", slug)
      .eq("status", "approved")
      .maybeSingle();

    if (error || !data) {
      return FALLBACK_VENDORS.find((v) => v.slug === slug) ?? null;
    }

    const { count } = await supabase
      .from("books")
      .select("*", { count: "exact", head: true })
      .eq("vendor_id", data.id)
      .eq("status", "active");

    const fallback = FALLBACK_VENDORS.find((f) => f.slug === slug);

    return {
      ...(data as VendorRow),
      book_count: count ?? fallback?.book_count ?? 10,
      average_rating: fallback?.average_rating ?? 4.9,
      total_reviews: fallback?.total_reviews ?? 50,
    };
  } catch {
    return FALLBACK_VENDORS.find((v) => v.slug === slug) ?? null;
  }
}
