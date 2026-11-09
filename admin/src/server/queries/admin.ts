import { createClient } from "@/lib/supabase/server";
import { Database } from "@/types/database";

export type StorefrontSettingsRow =
  Database["public"]["Tables"]["storefront_settings"]["Row"];
export type HeroSlideRow = Database["public"]["Tables"]["hero_slides"]["Row"];
export type CuratedShelfRow =
  Database["public"]["Tables"]["curated_shelves"]["Row"];

export interface AdminVendorRow {
  id: string;
  shop_name: string;
  slug: string;
  description: string | null;
  status: "pending" | "approved" | "suspended" | "rejected";
  commission_bps: number;
  created_at: string;
  owner?: { full_name: string } | null;
}

export interface AdminBookRow {
  id: string;
  title: string;
  author: string;
  isbn: string | null;
  price_minor: number;
  stock: number;
  condition: string;
  status: "active" | "draft" | "archived";
  vendor?: { shop_name: string; slug: string } | null;
  category?: { name: string; slug: string } | null;
}

export interface AdminOrderRow {
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

export async function getAdminMetrics() {
  const supabase = await createClient();

  const [
    { count: totalVendors },
    { count: pendingVendors },
    { count: totalBooks },
    { data: ordersData },
  ] = await Promise.all([
    supabase.from("vendors").select("*", { count: "exact", head: true }),
    supabase
      .from("vendors")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending"),
    supabase.from("books").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("total_minor, status, payment_status"),
  ]);

  const orders = ordersData || [];
  const totalOrders = orders.length;
  const paidOrders = orders.filter((o) => o.payment_status === "paid");
  const totalGmvMinor = paidOrders.reduce((sum, o) => sum + (o.total_minor || 0), 0);
  const estimatedCommissionMinor = Math.round(totalGmvMinor * 0.1);

  return {
    totalVendors: totalVendors || 0,
    pendingVendors: pendingVendors || 0,
    totalBooks: totalBooks || 0,
    totalOrders,
    totalGmvMinor,
    estimatedCommissionMinor,
  };
}

export async function getAdminVendors(): Promise<AdminVendorRow[]> {
  const supabase = await createClient();

  const { data: vendors, error } = await supabase
    .from("vendors")
    .select(`
      *,
      owner:profiles!vendors_owner_id_fkey(full_name)
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching admin vendors:", error);
    return [];
  }

  return (vendors || []) as unknown as AdminVendorRow[];
}

export async function getAdminBooks(): Promise<AdminBookRow[]> {
  const supabase = await createClient();

  const { data: books, error } = await supabase
    .from("books")
    .select(`
      *,
      vendor:vendors(shop_name, slug),
      category:categories(name, slug)
    `)
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    console.error("Error fetching admin books:", error);
    return [];
  }

  return (books || []) as unknown as AdminBookRow[];
}

export async function getAdminOrders(): Promise<AdminOrderRow[]> {
  const supabase = await createClient();

  const { data: orders, error } = await supabase
    .from("orders")
    .select(`
      *,
      buyer:profiles!orders_buyer_id_fkey(full_name),
      items:order_items(
        id,
        qty,
        unit_price_minor,
        fulfillment_status,
        vendor:vendors(shop_name),
        book:books(title)
      )
    `)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error("Error fetching admin orders:", error);
    return [];
  }

  return (orders || []) as unknown as AdminOrderRow[];
}

export async function getStorefrontSettingsAdmin(): Promise<StorefrontSettingsRow> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("storefront_settings")
    .select("*")
    .eq("id", "global")
    .maybeSingle();

  if (!data) {
    return {
      id: "global",
      site_name: "RTDS Bookshop",
      tagline: "Official Book Marketplace of RTDS Platform",
      announcement_text:
        "⚡ সারা দেশে ক্যাশ অন ডেলিভারি | ৳১,০০০ টাকার অর্ডারে ফ্রি ডেলিভারি",
      announcement_enabled: true,
      helpline_phone: "০৯৬১২-০০৭৮৩৭",
      helpline_hours: "সকাল ৯টা - রাত ১০টা",
      free_shipping_threshold_minor: 100000,
      flat_shipping_rate_minor: 7000,
      emergency_alert: null,
      emergency_alert_enabled: false,
      updated_at: new Date().toISOString(),
    };
  }

  return data as StorefrontSettingsRow;
}

export async function getHeroSlidesAdmin(): Promise<HeroSlideRow[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("hero_slides")
    .select("*")
    .order("sort_order", { ascending: true });

  return (data || []) as HeroSlideRow[];
}

export async function getCuratedShelvesAdmin(): Promise<CuratedShelfRow[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("curated_shelves")
    .select("*")
    .order("sort_order", { ascending: true });

  return (data || []) as CuratedShelfRow[];
}

export async function getCategoriesAdmin() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("categories")
    .select("id, name, slug")
    .order("name", { ascending: true });

  return data || [];
}
