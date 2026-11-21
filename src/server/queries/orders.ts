import { createClient } from "@/lib/supabase/server";
import { Database, OrderStatus, PaymentStatus, FulfillmentStatus } from "@/types/database";
import { FALLBACK_BOOKS } from "./books";
import { FALLBACK_VENDORS } from "./vendors";

export type OrderRow = Database["public"]["Tables"]["orders"]["Row"];
export type OrderItemRow = Database["public"]["Tables"]["order_items"]["Row"];

export interface ShippingAddressData {
  fullName: string;
  phone: string;
  division: string;
  district: string;
  streetAddress: string;
  deliveryNotes?: string;
}

export interface OrderItemDetail extends OrderItemRow {
  book?: {
    id: string;
    title: string;
    author: string;
    condition: string;
    coverUrl?: string;
  };
  vendor?: {
    id: string;
    shop_name: string;
    slug: string;
  };
}

export interface OrderDetail extends OrderRow {
  items: OrderItemDetail[];
  shippingAddressParsed: ShippingAddressData;
}

export interface VendorOrderItemDetail extends OrderItemRow {
  book?: {
    id: string;
    title: string;
    author: string;
    condition: string;
    coverUrl?: string;
  };
  order?: {
    id: string;
    created_at: string;
    status: OrderStatus;
    payment_status: PaymentStatus;
    payment_provider: string;
    shippingAddressParsed: ShippingAddressData;
  };
}

/**
 * Parses raw JSON / JSONB shipping address safely.
 */
function parseShippingAddress(rawAddress: unknown): ShippingAddressData {
  const defaultAddress: ShippingAddressData = {
    fullName: "Customer",
    phone: "01700000000",
    division: "Dhaka",
    district: "Dhaka",
    streetAddress: "Standard Delivery Address",
  };

  if (!rawAddress) return defaultAddress;

  try {
    if (typeof rawAddress === "string") {
      return { ...defaultAddress, ...JSON.parse(rawAddress) };
    }
    if (typeof rawAddress === "object") {
      return { ...defaultAddress, ...(rawAddress as Record<string, unknown>) };
    }
  } catch {
    // fallback on JSON parse error
  }
  return defaultAddress;
}

/**
 * Get an individual order by ID (with authorization and full item / vendor joins).
 */
export async function getOrderById(orderId: string): Promise<OrderDetail | null> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data: order, error } = await supabase
      .from("orders")
      .select(
        `
        *,
        order_items (
          *,
          books (
            id,
            title,
            author,
            condition,
            book_images (
              r2_key,
              position
            )
          ),
          vendors (
            id,
            shop_name,
            slug
          )
        )
      `
      )
      .eq("id", orderId)
      .maybeSingle();

    if (error || !order) {
      return getFallbackOrder(orderId, user?.id);
    }

    const raw = order as unknown as OrderRow & {
      order_items: (OrderItemRow & {
        books?: {
          id: string;
          title: string;
          author: string;
          condition: string;
          book_images?: { r2_key: string; position: number }[];
        } | null;
        vendors?: {
          id: string;
          shop_name: string;
          slug: string;
        } | null;
      })[];
    };

    const shippingAddressParsed = parseShippingAddress(raw.shipping_address);

    const items: OrderItemDetail[] = (raw.order_items || []).map((item) => ({
      ...item,
      book: item.books
        ? {
            id: item.books.id,
            title: item.books.title,
            author: item.books.author,
            condition: item.books.condition,
            coverUrl: item.books.book_images?.[0]?.r2_key,
          }
        : undefined,
      vendor: item.vendors
        ? {
            id: item.vendors.id,
            shop_name: item.vendors.shop_name,
            slug: item.vendors.slug,
          }
        : undefined,
    }));

    return {
      ...raw,
      items,
      shippingAddressParsed,
    };
  } catch {
    return getFallbackOrder(orderId);
  }
}

/**
 * Retrieves all orders placed by the currently authenticated buyer.
 */
export async function getBuyerOrders(): Promise<OrderDetail[]> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return [getFallbackOrder("sample-order-buyer-preview")];
    }

    const { data: orders, error } = await supabase
      .from("orders")
      .select(
        `
        *,
        order_items (
          *,
          books (
            id,
            title,
            author,
            condition,
            book_images (
              r2_key,
              position
            )
          ),
          vendors (
            id,
            shop_name,
            slug
          )
        )
      `
      )
      .eq("buyer_id", user.id)
      .order("created_at", { ascending: false });

    if (error || !orders || orders.length === 0) {
      return [getFallbackOrder("sample-order-buyer-preview", user.id)];
    }

    return orders.map((order) => {
      const raw = order as unknown as OrderRow & {
        order_items: (OrderItemRow & {
          books?: {
            id: string;
            title: string;
            author: string;
            condition: string;
            book_images?: { r2_key: string; position: number }[];
          } | null;
          vendors?: {
            id: string;
            shop_name: string;
            slug: string;
          } | null;
        })[];
      };

      const shippingAddressParsed = parseShippingAddress(raw.shipping_address);

      const items: OrderItemDetail[] = (raw.order_items || []).map((item) => ({
        ...item,
        book: item.books
          ? {
              id: item.books.id,
              title: item.books.title,
              author: item.books.author,
              condition: item.books.condition,
              coverUrl: item.books.book_images?.[0]?.r2_key,
            }
          : undefined,
        vendor: item.vendors
          ? {
              id: item.vendors.id,
              shop_name: item.vendors.shop_name,
              slug: item.vendors.slug,
            }
          : undefined,
      }));

      return {
        ...raw,
        items,
        shippingAddressParsed,
      };
    });
  } catch {
    return [getFallbackOrder("sample-order-buyer-preview")];
  }
}

/**
 * Retrieves incoming order items for the vendor's bookstore to manage packaging & fulfillment.
 */
export async function getVendorOrderItems(
  vendorId?: string
): Promise<VendorOrderItemDetail[]> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    let effectiveVendorId = vendorId;

    if (!effectiveVendorId && user) {
      const { data: vendor } = await supabase
        .from("vendors")
        .select("id")
        .eq("owner_id", user.id)
        .maybeSingle();

      if (vendor) {
        effectiveVendorId = vendor.id;
      }
    }

    if (!effectiveVendorId) {
      return getFallbackVendorOrderItems();
    }

    const { data: items, error } = await supabase
      .from("order_items")
      .select(
        `
        *,
        books (
          id,
          title,
          author,
          condition,
          book_images (
            r2_key,
            position
          )
        ),
        orders (
          id,
          created_at,
          status,
          payment_status,
          payment_provider,
          shipping_address
        )
      `
      )
      .eq("vendor_id", effectiveVendorId)
      .order("created_at", { ascending: false });

    if (error || !items || items.length === 0) {
      return getFallbackVendorOrderItems(effectiveVendorId);
    }

    return items.map((rawItem) => {
      const item = rawItem as unknown as OrderItemRow & {
        books?: {
          id: string;
          title: string;
          author: string;
          condition: string;
          book_images?: { r2_key: string; position: number }[];
        } | null;
        orders?: {
          id: string;
          created_at: string;
          status: OrderStatus;
          payment_status: PaymentStatus;
          payment_provider: string;
          shipping_address: unknown;
        } | null;
      };

      const shippingAddressParsed = parseShippingAddress(item.orders?.shipping_address);

      return {
        ...item,
        book: item.books
          ? {
              id: item.books.id,
              title: item.books.title,
              author: item.books.author,
              condition: item.books.condition,
              coverUrl: item.books.book_images?.[0]?.r2_key,
            }
          : undefined,
        order: item.orders
          ? {
              id: item.orders.id,
              created_at: item.orders.created_at,
              status: item.orders.status,
              payment_status: item.orders.payment_status,
              payment_provider: item.orders.payment_provider,
              shippingAddressParsed,
            }
          : undefined,
      };
    });
  } catch {
    return getFallbackVendorOrderItems(vendorId);
  }
}

/**
 * Fallback order for preview or fallback rendering.
 */
function getFallbackOrder(orderId: string, userId?: string): OrderDetail {
  const sampleBook1 = FALLBACK_BOOKS[0];
  const sampleBook2 = FALLBACK_BOOKS[1] || FALLBACK_BOOKS[0];
  const sampleVendor1 = FALLBACK_VENDORS[0];
  const sampleVendor2 = FALLBACK_VENDORS[1] || FALLBACK_VENDORS[0];

  const subtotal = sampleBook1.price_minor + sampleBook2.price_minor;
  const shipping = 7000;

  return {
    id: orderId,
    buyer_id: userId || "sample-buyer-uuid",
    subtotal_minor: subtotal,
    shipping_minor: shipping,
    total_minor: subtotal + shipping,
    currency: "BDT",
    status: "processing" as OrderStatus,
    payment_status: "pending" as PaymentStatus,
    payment_provider: "cod",
    payment_reference: `COD-${orderId.slice(0, 8).toUpperCase()}`,
    shipping_address: {
      fullName: "Tahmid Hasan",
      phone: "01712345678",
      division: "Dhaka",
      district: "Dhaka",
      streetAddress: "House 24, Road 5, Dhanmondi, Dhaka 1205",
      deliveryNotes: "Please deliver between 2 PM and 6 PM",
    },
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
    updated_at: new Date().toISOString(),
    items: [
      {
        id: `oi-${orderId}-1`,
        order_id: orderId,
        book_id: sampleBook1.id,
        vendor_id: sampleVendor1.id,
        qty: 1,
        unit_price_minor: sampleBook1.price_minor,
        commission_bps: 1000,
        commission_amount_minor: Math.round((sampleBook1.price_minor * 1000) / 10000),
        fulfillment_status: "shipped" as FulfillmentStatus,
        tracking_number: "ST-DH-8849201",
        created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
        updated_at: new Date(Date.now() - 3600000 * 2).toISOString(),
        book: {
          id: sampleBook1.id,
          title: sampleBook1.title,
          author: sampleBook1.author,
          condition: sampleBook1.condition,
          coverUrl: sampleBook1.book_images?.[0]?.r2_key,
        },
        vendor: {
          id: sampleVendor1.id,
          shop_name: sampleVendor1.shop_name,
          slug: sampleVendor1.slug,
        },
      },
      {
        id: `oi-${orderId}-2`,
        order_id: orderId,
        book_id: sampleBook2.id,
        vendor_id: sampleVendor2.id,
        qty: 1,
        unit_price_minor: sampleBook2.price_minor,
        commission_bps: 1000,
        commission_amount_minor: Math.round((sampleBook2.price_minor * 1000) / 10000),
        fulfillment_status: "pending" as FulfillmentStatus,
        tracking_number: null,
        created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
        updated_at: new Date(Date.now() - 3600000 * 4).toISOString(),
        book: {
          id: sampleBook2.id,
          title: sampleBook2.title,
          author: sampleBook2.author,
          condition: sampleBook2.condition,
          coverUrl: sampleBook2.book_images?.[0]?.r2_key,
        },
        vendor: {
          id: sampleVendor2.id,
          shop_name: sampleVendor2.shop_name,
          slug: sampleVendor2.slug,
        },
      },
    ],
    shippingAddressParsed: {
      fullName: "Tahmid Hasan",
      phone: "01712345678",
      division: "Dhaka",
      district: "Dhaka",
      streetAddress: "House 24, Road 5, Dhanmondi, Dhaka 1205",
      deliveryNotes: "Please deliver between 2 PM and 6 PM",
    },
  };
}

/**
 * Fallback vendor order items for preview or demo mode.
 */
function getFallbackVendorOrderItems(vendorId?: string): VendorOrderItemDetail[] {
  const sampleBook1 = FALLBACK_BOOKS[0];
  const sampleBook2 = FALLBACK_BOOKS[2] || FALLBACK_BOOKS[0];
  const sampleVendor = FALLBACK_VENDORS[0];

  return [
    {
      id: "oi-v-sample-101",
      order_id: "ord-bd-991201",
      book_id: sampleBook1.id,
      vendor_id: vendorId || sampleVendor.id,
      qty: 1,
      unit_price_minor: sampleBook1.price_minor,
      commission_bps: 1000,
      commission_amount_minor: Math.round((sampleBook1.price_minor * 1000) / 10000),
      fulfillment_status: "pending" as FulfillmentStatus,
      tracking_number: null,
      created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
      updated_at: new Date(Date.now() - 3600000 * 2).toISOString(),
      book: {
        id: sampleBook1.id,
        title: sampleBook1.title,
        author: sampleBook1.author,
        condition: sampleBook1.condition,
        coverUrl: sampleBook1.book_images?.[0]?.r2_key,
      },
      order: {
        id: "ord-bd-991201",
        created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
        status: "processing" as OrderStatus,
        payment_status: "pending" as PaymentStatus,
        payment_provider: "cod",
        shippingAddressParsed: {
          fullName: "Mahmudur Rahman",
          phone: "01819283746",
          division: "Dhaka",
          district: "Gazipur",
          streetAddress: "Holding 12, Block B, Joydebpur, Gazipur",
          deliveryNotes: "Call before coming",
        },
      },
    },
    {
      id: "oi-v-sample-102",
      order_id: "ord-bd-882310",
      book_id: sampleBook2.id,
      vendor_id: vendorId || sampleVendor.id,
      qty: 2,
      unit_price_minor: sampleBook2.price_minor,
      commission_bps: 1000,
      commission_amount_minor: Math.round((sampleBook2.price_minor * 2 * 1000) / 10000),
      fulfillment_status: "shipped" as FulfillmentStatus,
      tracking_number: "ST-GZ-441208",
      created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
      updated_at: new Date(Date.now() - 3600000 * 6).toISOString(),
      book: {
        id: sampleBook2.id,
        title: sampleBook2.title,
        author: sampleBook2.author,
        condition: sampleBook2.condition,
        coverUrl: sampleBook2.book_images?.[0]?.r2_key,
      },
      order: {
        id: "ord-bd-882310",
        created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
        status: "processing" as OrderStatus,
        payment_status: "paid" as PaymentStatus,
        payment_provider: "mock",
        shippingAddressParsed: {
          fullName: "Nusrat Jahan",
          phone: "01755123987",
          division: "Chittagong",
          district: "Chittagong",
          streetAddress: "Flat 4A, Nasirabad Housing Society, Chattogram",
          deliveryNotes: "",
        },
      },
    },
  ];
}
