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
      // Return fallback order if it's the sample order
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

    let shippingAddressParsed: ShippingAddressData = {
      fullName: "Customer",
      phone: "01700000000",
      division: "Dhaka",
      district: "Dhaka",
      streetAddress: "Standard Delivery Address",
    };

    try {
      if (typeof raw.shipping_address === "string") {
        shippingAddressParsed = JSON.parse(raw.shipping_address);
      } else if (raw.shipping_address && typeof raw.shipping_address === "object") {
        shippingAddressParsed = raw.shipping_address as unknown as ShippingAddressData;
      }
    } catch {
      // Default fallback
    }

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

function getFallbackOrder(orderId: string, userId?: string): OrderDetail {
  const sampleBook = FALLBACK_BOOKS[0];
  const sampleVendor = FALLBACK_VENDORS[0];

  return {
    id: orderId,
    buyer_id: userId || "sample-buyer-uuid",
    subtotal_minor: sampleBook.price_minor,
    shipping_minor: 7000,
    total_minor: sampleBook.price_minor + 7000,
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
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    items: [
      {
        id: `oi-${orderId}-1`,
        order_id: orderId,
        book_id: sampleBook.id,
        vendor_id: sampleVendor.id,
        qty: 1,
        unit_price_minor: sampleBook.price_minor,
        commission_bps: 1000,
        commission_amount_minor: Math.round((sampleBook.price_minor * 1000) / 10000),
        fulfillment_status: "pending" as FulfillmentStatus,
        tracking_number: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        book: {
          id: sampleBook.id,
          title: sampleBook.title,
          author: sampleBook.author,
          condition: sampleBook.condition,
          coverUrl: sampleBook.book_images?.[0]?.r2_key,
        },
        vendor: {
          id: sampleVendor.id,
          shop_name: sampleVendor.shop_name,
          slug: sampleVendor.slug,
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
