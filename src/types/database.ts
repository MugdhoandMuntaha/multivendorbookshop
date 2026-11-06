export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = "buyer" | "vendor" | "admin";
export type VendorStatus = "pending" | "approved" | "suspended" | "rejected";
export type BookCondition = "new" | "like_new" | "good" | "fair";
export type BookStatus = "draft" | "active" | "archived";
export type OrderStatus = "pending" | "processing" | "completed" | "cancelled";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";
export type FulfillmentStatus =
  "pending" | "shipped" | "delivered" | "cancelled";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: UserRole;
          full_name: string;
          avatar_key: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          role?: UserRole;
          full_name: string;
          avatar_key?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          role?: UserRole;
          full_name?: string;
          avatar_key?: string | null;
          updated_at?: string;
        };
      };
      vendors: {
        Row: {
          id: string;
          owner_id: string;
          shop_name: string;
          slug: string;
          description: string | null;
          logo_key: string | null;
          banner_key: string | null;
          status: VendorStatus;
          commission_bps: number;
          shipping_fee_minor: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          shop_name: string;
          slug: string;
          description?: string | null;
          logo_key?: string | null;
          banner_key?: string | null;
          status?: VendorStatus;
          commission_bps?: number;
          shipping_fee_minor?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          owner_id?: string;
          shop_name?: string;
          slug?: string;
          description?: string | null;
          logo_key?: string | null;
          banner_key?: string | null;
          status?: VendorStatus;
          commission_bps?: number;
          shipping_fee_minor?: number;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          parent_id: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          parent_id?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          parent_id?: string | null;
          sort_order?: number;
        };
      };
      books: {
        Row: {
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
          search_tsv: unknown | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          vendor_id: string;
          title: string;
          author: string;
          isbn?: string | null;
          description?: string | null;
          category_id: string;
          condition?: BookCondition;
          price_minor: number;
          currency?: string;
          stock?: number;
          status?: BookStatus;
          search_tsv?: unknown | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          vendor_id?: string;
          title?: string;
          author?: string;
          isbn?: string | null;
          description?: string | null;
          category_id?: string;
          condition?: BookCondition;
          price_minor?: number;
          currency?: string;
          stock?: number;
          status?: BookStatus;
          search_tsv?: unknown | null;
          updated_at?: string;
        };
      };
      book_images: {
        Row: {
          id: string;
          book_id: string;
          r2_key: string;
          position: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          book_id: string;
          r2_key: string;
          position?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          book_id?: string;
          r2_key?: string;
          position?: number;
        };
      };
      carts: {
        Row: {
          id: string;
          user_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          updated_at?: string;
        };
      };
      cart_items: {
        Row: {
          id: string;
          cart_id: string;
          book_id: string;
          qty: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          cart_id: string;
          book_id: string;
          qty?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          cart_id?: string;
          book_id?: string;
          qty?: number;
        };
      };
      wishlists: {
        Row: {
          id: string;
          user_id: string;
          book_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          book_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          book_id?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          buyer_id: string;
          subtotal_minor: number;
          shipping_minor: number;
          total_minor: number;
          currency: string;
          status: OrderStatus;
          payment_status: PaymentStatus;
          payment_provider: string;
          payment_reference: string | null;
          shipping_address: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          buyer_id: string;
          subtotal_minor: number;
          shipping_minor?: number;
          total_minor: number;
          currency?: string;
          status?: OrderStatus;
          payment_status?: PaymentStatus;
          payment_provider?: string;
          payment_reference?: string | null;
          shipping_address: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          buyer_id?: string;
          subtotal_minor?: number;
          shipping_minor?: number;
          total_minor?: number;
          currency?: string;
          status?: OrderStatus;
          payment_status?: PaymentStatus;
          payment_provider?: string;
          payment_reference?: string | null;
          shipping_address?: Json;
          updated_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          book_id: string;
          vendor_id: string;
          qty: number;
          unit_price_minor: number;
          commission_bps: number;
          commission_amount_minor: number;
          fulfillment_status: FulfillmentStatus;
          tracking_number: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          book_id: string;
          vendor_id: string;
          qty: number;
          unit_price_minor: number;
          commission_bps?: number;
          commission_amount_minor?: number;
          fulfillment_status?: FulfillmentStatus;
          tracking_number?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          book_id?: string;
          vendor_id?: string;
          qty?: number;
          unit_price_minor?: number;
          commission_bps?: number;
          commission_amount_minor?: number;
          fulfillment_status?: FulfillmentStatus;
          tracking_number?: string | null;
          updated_at?: string;
        };
      };
      reviews: {
        Row: {
          id: string;
          book_id: string;
          buyer_id: string;
          rating: number;
          body: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          book_id: string;
          buyer_id: string;
          rating: number;
          body: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          book_id?: string;
          buyer_id?: string;
          rating?: number;
          body?: string;
          updated_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: {
      create_order_atomic: {
        Args: {
          p_buyer_id: string;
          p_items: Json;
          p_shipping_address: Json;
          p_payment_provider: string;
        };
        Returns: string;
      };
    };
    Enums: {
      user_role: UserRole;
      vendor_status: VendorStatus;
      book_condition: BookCondition;
      book_status: BookStatus;
      order_status: OrderStatus;
      payment_status: PaymentStatus;
      fulfillment_status: FulfillmentStatus;
    };
  };
}
