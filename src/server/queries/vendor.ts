import { createClient } from "@/lib/supabase/server";
import { Database, BookStatus, BookCondition } from "@/types/database";

export type VendorRow = Database["public"]["Tables"]["vendors"]["Row"];
export type CategoryRow = Database["public"]["Tables"]["categories"]["Row"];

export type VendorBookListItem = {
  id: string;
  vendor_id: string;
  title: string;
  author: string;
  isbn: string | null;
  description: string | null;
  category_id: string;
  condition: BookCondition;
  price_minor: number;
  currency: string;
  stock: number;
  status: BookStatus;
  created_at: string;
  updated_at: string;
  category?: {
    name: string;
    slug: string;
  } | null;
  book_images?: {
    id?: string;
    r2_key: string;
    position: number;
  }[];
};

interface RawVendorBookQueryItem extends Omit<
  VendorBookListItem,
  "category" | "book_images"
> {
  categories: { name: string; slug: string } | null;
  book_images: { id?: string; r2_key: string; position: number }[];
}

export const FALLBACK_CATEGORIES: CategoryRow[] = [
  {
    id: "22222222-2222-2222-2222-222222222201",
    name: "Fiction & Literature",
    slug: "fiction-literature",
    parent_id: null,
    sort_order: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: "22222222-2222-2222-2222-222222222202",
    name: "Sci-Fi & Fantasy",
    slug: "scifi-fantasy",
    parent_id: null,
    sort_order: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: "22222222-2222-2222-2222-222222222203",
    name: "Medical & Engineering Admission",
    slug: "medical-engineering-admission",
    parent_id: null,
    sort_order: 3,
    created_at: new Date().toISOString(),
  },
  {
    id: "22222222-2222-2222-2222-222222222204",
    name: "Islamic & Theological Books",
    slug: "islamic-theological",
    parent_id: null,
    sort_order: 4,
    created_at: new Date().toISOString(),
  },
  {
    id: "22222222-2222-2222-2222-222222222205",
    name: "History & Heritage",
    slug: "history-heritage",
    parent_id: null,
    sort_order: 5,
    created_at: new Date().toISOString(),
  },
  {
    id: "22222222-2222-2222-2222-222222222206",
    name: "Philosophy & Society",
    slug: "philosophy-society",
    parent_id: null,
    sort_order: 6,
    created_at: new Date().toISOString(),
  },
  {
    id: "22222222-2222-2222-2222-222222222207",
    name: "Computer Science & Engineering",
    slug: "computer-science-engineering",
    parent_id: null,
    sort_order: 7,
    created_at: new Date().toISOString(),
  },
  {
    id: "22222222-2222-2222-2222-222222222208",
    name: "Business, Finance & Startups",
    slug: "business-finance-startups",
    parent_id: null,
    sort_order: 8,
    created_at: new Date().toISOString(),
  },
];

/**
 * Gets the current vendor profile for the authenticated session.
 */
export async function getCurrentVendor(): Promise<VendorRow | null> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    const { data, error } = await supabase
      .from("vendors")
      .select("*")
      .eq("owner_id", user.id)
      .maybeSingle();

    if (error || !data) return null;
    return data as VendorRow;
  } catch {
    return null;
  }
}

/**
 * Gets all marketplace categories for select menus and navigation.
 */
export async function getCategories(): Promise<CategoryRow[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) {
      return FALLBACK_CATEGORIES;
    }

    return data as CategoryRow[];
  } catch {
    return FALLBACK_CATEGORIES;
  }
}

/**
 * Gets vendor dashboard statistics.
 */
export async function getVendorDashboardStats(vendorId: string) {
  try {
    const supabase = await createClient();

    // 1. Total books count
    const { count: totalBooks } = await supabase
      .from("books")
      .select("*", { count: "exact", head: true })
      .eq("vendor_id", vendorId);

    // 2. Active books count
    const { count: activeBooks } = await supabase
      .from("books")
      .select("*", { count: "exact", head: true })
      .eq("vendor_id", vendorId)
      .eq("status", "active");

    // 3. Low stock books count (<= 2)
    const { count: lowStockBooks } = await supabase
      .from("books")
      .select("*", { count: "exact", head: true })
      .eq("vendor_id", vendorId)
      .eq("status", "active")
      .lte("stock", 2);

    // 4. Pending vendor order items count
    const { count: pendingOrders } = await supabase
      .from("order_items")
      .select("*", { count: "exact", head: true })
      .eq("vendor_id", vendorId)
      .eq("fulfillment_status", "pending");

    // 5. Total earnings from delivered order items
    const { data: earningsData } = await supabase
      .from("order_items")
      .select("qty, unit_price_minor")
      .eq("vendor_id", vendorId)
      .eq("fulfillment_status", "delivered");

    let totalEarningsMinor = 0;
    if (earningsData && earningsData.length > 0) {
      totalEarningsMinor = earningsData.reduce(
        (sum, item) => sum + item.qty * item.unit_price_minor,
        0
      );
    }

    return {
      totalBooks: totalBooks ?? 0,
      activeBooks: activeBooks ?? 0,
      lowStockBooks: lowStockBooks ?? 0,
      pendingOrders: pendingOrders ?? 0,
      totalEarningsMinor,
    };
  } catch {
    return {
      totalBooks: 0,
      activeBooks: 0,
      lowStockBooks: 0,
      pendingOrders: 0,
      totalEarningsMinor: 0,
    };
  }
}

/**
 * Gets vendor book listings with cover images and categories.
 */
export async function getVendorBooks(
  vendorId: string
): Promise<VendorBookListItem[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("books")
      .select(
        `
        id,
        vendor_id,
        title,
        author,
        isbn,
        description,
        category_id,
        condition,
        price_minor,
        currency,
        stock,
        status,
        created_at,
        updated_at,
        categories (
          name,
          slug
        ),
        book_images (
          id,
          r2_key,
          position
        )
      `
      )
      .eq("vendor_id", vendorId)
      .order("created_at", { ascending: false });

    if (error || !data) {
      return [];
    }

    return (data as unknown as RawVendorBookQueryItem[]).map((item) => ({
      ...item,
      category: item.categories,
      book_images: (item.book_images || []).sort(
        (a, b) => a.position - b.position
      ),
    }));
  } catch {
    return [];
  }
}

/**
 * Gets a specific vendor book for editing.
 */
export async function getVendorBookById(
  vendorId: string,
  bookId: string
): Promise<VendorBookListItem | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("books")
      .select(
        `
        id,
        vendor_id,
        title,
        author,
        isbn,
        description,
        category_id,
        condition,
        price_minor,
        currency,
        stock,
        status,
        created_at,
        updated_at,
        categories (
          name,
          slug
        ),
        book_images (
          id,
          r2_key,
          position
        )
      `
      )
      .eq("id", bookId)
      .eq("vendor_id", vendorId)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    const item = data as unknown as RawVendorBookQueryItem;
    return {
      ...item,
      category: item.categories,
      book_images: (item.book_images || []).sort(
        (a, b) => a.position - b.position
      ),
    };
  } catch {
    return null;
  }
}
