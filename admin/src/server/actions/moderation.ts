"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

// Verify admin permission
async function verifyAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized: Sign in required");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    throw new Error("Forbidden: Admin privileges required");
  }

  return user;
}

/**
 * Approves, suspends, or rejects a vendor shop.
 */
export async function updateVendorStatusAction(
  vendorId: string,
  status: "approved" | "suspended" | "rejected" | "pending"
) {
  await verifyAdmin();
  const adminClient = createAdminClient();

  const { error } = await adminClient
    .from("vendors")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", vendorId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/vendors");
  revalidatePath("/");
  return { success: true };
}

/**
 * Updates vendor platform commission rate (in basis points, e.g. 1000 = 10%).
 */
export async function updateVendorCommissionAction(
  vendorId: string,
  commissionBps: number
) {
  await verifyAdmin();
  const adminClient = createAdminClient();

  const { error } = await adminClient
    .from("vendors")
    .update({ commission_bps: commissionBps, updated_at: new Date().toISOString() })
    .eq("id", vendorId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/vendors");
  return { success: true };
}

/**
 * Moderates a book listing status (active, draft, archived).
 */
export async function updateBookStatusAction(
  bookId: string,
  status: "active" | "draft" | "archived"
) {
  await verifyAdmin();
  const adminClient = createAdminClient();

  const { error } = await adminClient
    .from("books")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", bookId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/books");
  return { success: true };
}

/**
 * Updates order fulfillment and courier tracking details.
 */
export async function updateOrderStatusAction(
  orderId: string,
  status: "pending" | "processing" | "completed" | "cancelled",
  paymentStatus: "pending" | "paid" | "failed" | "refunded",
  courierNotes?: string
) {
  await verifyAdmin();
  const adminClient = createAdminClient();

  const { error } = await adminClient
    .from("orders")
    .update({
      status,
      payment_status: paymentStatus,
      ...(courierNotes
        ? {
            shipping_address: {
              admin_notes: courierNotes,
              updated_at: new Date().toISOString(),
            },
          }
        : {}),
      updated_at: new Date().toISOString(),
    })
    .eq("id", orderId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/orders");
  revalidatePath("/");
  return { success: true };
}
