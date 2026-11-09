"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/server/queries/auth";
import {
  vendorApplySchema,
  vendorProfileSchema,
  type VendorApplyInput,
  type VendorProfileInput,
} from "@/lib/validators/vendor";
import { toMinorUnits } from "@/lib/utils";

export interface VendorActionResult {
  success: boolean;
  error?: string;
  vendorId?: string;
}

export async function applyForVendor(
  input: VendorApplyInput
): Promise<VendorActionResult> {
  const user = await requireUser("/vendor/apply");
  const parsed = vendorApplySchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || "Invalid application data",
    };
  }

  const supabase = await createClient();

  // 1. Check if user already applied or is a vendor
  const { data: existingVendor } = await supabase
    .from("vendors")
    .select("id, status")
    .eq("owner_id", user.id)
    .maybeSingle();

  if (existingVendor) {
    return {
      success: false,
      error: `You already have an active vendor record (Status: ${existingVendor.status}).`,
    };
  }

  // 2. Check if slug is unique
  const { data: slugCheck } = await supabase
    .from("vendors")
    .select("id")
    .eq("slug", parsed.data.slug)
    .maybeSingle();

  if (slugCheck) {
    return {
      success: false,
      error: "This shop URL slug is already taken. Please choose another.",
    };
  }

  // 3. Insert vendor application
  const { data: newVendor, error: insertError } = await supabase
    .from("vendors")
    .insert({
      owner_id: user.id,
      shop_name: parsed.data.shopName,
      slug: parsed.data.slug,
      description: parsed.data.description,
      logo_key: parsed.data.logoKey || null,
      banner_key: parsed.data.bannerKey || null,
      status: "pending",
      commission_bps: 1000, // 10% standard platform commission
      shipping_fee_minor: toMinorUnits(parsed.data.shippingFee),
    })
    .select("id")
    .single();

  if (insertError) {
    return {
      success: false,
      error: insertError.message,
    };
  }

  revalidatePath("/", "layout");
  return {
    success: true,
    vendorId: newVendor.id,
  };
}

export async function updateVendorProfile(
  input: VendorProfileInput
): Promise<VendorActionResult> {
  const user = await requireUser();
  const parsed = vendorProfileSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || "Invalid profile data",
    };
  }

  const supabase = await createClient();

  // Update vendor profile matching owner_id
  const { error } = await supabase
    .from("vendors")
    .update({
      shop_name: parsed.data.shopName,
      description: parsed.data.description,
      shipping_fee_minor: toMinorUnits(parsed.data.shippingFee),
      logo_key: parsed.data.logoKey || null,
      banner_key: parsed.data.bannerKey || null,
    })
    .eq("owner_id", user.id);

  if (error) {
    return {
      success: false,
      error: error.message,
    };
  }

  revalidatePath("/vendor/settings");
  revalidatePath("/vendor/dashboard");
  return { success: true };
}
