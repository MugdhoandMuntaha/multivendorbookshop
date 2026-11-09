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
 * Updates global storefront settings (Announcement, Helpline, Shipping Rates).
 */
export async function updateStorefrontSettingsAction(formData: FormData) {
  await verifyAdmin();
  const adminClient = createAdminClient();

  const site_name = formData.get("site_name") as string;
  const tagline = formData.get("tagline") as string;
  const announcement_text = formData.get("announcement_text") as string;
  const announcement_enabled = formData.get("announcement_enabled") === "true";
  const helpline_phone = formData.get("helpline_phone") as string;
  const helpline_hours = formData.get("helpline_hours") as string;
  const free_shipping_threshold = Number(
    formData.get("free_shipping_threshold_bdt") || 1000
  );
  const flat_shipping_rate = Number(
    formData.get("flat_shipping_rate_bdt") || 70
  );
  const emergency_alert = (formData.get("emergency_alert") as string) || null;
  const emergency_alert_enabled =
    formData.get("emergency_alert_enabled") === "true";

  const { error } = await adminClient
    .from("storefront_settings")
    .upsert({
      id: "global",
      site_name: site_name || "RTDS Bookshop",
      tagline: tagline || "Official Book Marketplace of RTDS Platform",
      announcement_text:
        announcement_text ||
        "⚡ সারা দেশে ক্যাশ অন ডেলিভারি | ৳১,০০০ টাকার অর্ডারে ফ্রি ডেলিভারি",
      announcement_enabled,
      helpline_phone: helpline_phone || "০৯৬১২-০০৭৮৩৭",
      helpline_hours: helpline_hours || "সকাল ৯টা - রাত ১০টা",
      free_shipping_threshold_minor: Math.round(free_shipping_threshold * 100),
      flat_shipping_rate_minor: Math.round(flat_shipping_rate * 100),
      emergency_alert,
      emergency_alert_enabled,
      updated_at: new Date().toISOString(),
    });

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/storefront/announcement");
  return { success: true };
}

/**
 * Creates a new hero campaign slide.
 */
export async function createHeroSlideAction(formData: FormData) {
  await verifyAdmin();
  const adminClient = createAdminClient();

  const title = formData.get("title") as string;
  const subtitle = formData.get("subtitle") as string;
  const badge_text = formData.get("badge_text") as string;
  const cta_text = formData.get("cta_text") as string;
  const cta_link = formData.get("cta_link") as string;
  const image_r2_key = (formData.get("image_r2_key") as string) || null;
  const bg_gradient =
    (formData.get("bg_gradient") as string) ||
    "from-emerald-800 via-emerald-700 to-teal-800";
  const sort_order = Number(formData.get("sort_order") || 0);
  const is_active = formData.get("is_active") === "true";

  if (!title) {
    return { success: false, error: "Title is required" };
  }

  const { error } = await adminClient.from("hero_slides").insert({
    title,
    subtitle: subtitle || "",
    badge_text: badge_text || null,
    cta_text: cta_text || "বইয়ের তালিকা দেখুন (Catalog)",
    cta_link: cta_link || "/books",
    image_r2_key,
    bg_gradient,
    sort_order,
    is_active,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/storefront/hero");
  return { success: true };
}

/**
 * Updates an existing hero slide.
 */
export async function updateHeroSlideAction(id: string, formData: FormData) {
  await verifyAdmin();
  const adminClient = createAdminClient();

  const title = formData.get("title") as string;
  const subtitle = formData.get("subtitle") as string;
  const badge_text = formData.get("badge_text") as string;
  const cta_text = formData.get("cta_text") as string;
  const cta_link = formData.get("cta_link") as string;
  const image_r2_key = formData.get("image_r2_key") as string;
  const bg_gradient = formData.get("bg_gradient") as string;
  const sort_order = Number(formData.get("sort_order") || 0);
  const is_active = formData.get("is_active") === "true";

  const { error } = await adminClient
    .from("hero_slides")
    .update({
      title,
      subtitle: subtitle || "",
      badge_text: badge_text || null,
      cta_text: cta_text || "বইয়ের তালিকা দেখুন",
      cta_link: cta_link || "/books",
      ...(image_r2_key !== undefined
        ? { image_r2_key: image_r2_key || null }
        : {}),
      ...(bg_gradient ? { bg_gradient } : {}),
      sort_order,
      is_active,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/storefront/hero");
  return { success: true };
}

/**
 * Toggles a hero slide active state.
 */
export async function toggleHeroSlideActiveAction(
  id: string,
  isActive: boolean
) {
  await verifyAdmin();
  const adminClient = createAdminClient();

  const { error } = await adminClient
    .from("hero_slides")
    .update({ is_active: isActive, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/storefront/hero");
  return { success: true };
}

/**
 * Deletes a hero slide.
 */
export async function deleteHeroSlideAction(id: string) {
  await verifyAdmin();
  const adminClient = createAdminClient();

  const { error } = await adminClient.from("hero_slides").delete().eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/storefront/hero");
  return { success: true };
}

/**
 * Creates or updates a curated homepage shelf.
 */
export async function upsertCuratedShelfAction(formData: FormData) {
  await verifyAdmin();
  const adminClient = createAdminClient();

  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const subtitle = formData.get("subtitle") as string;
  const category_id = (formData.get("category_id") as string) || null;
  const shelf_type = (formData.get("shelf_type") as string) || "custom";
  const icon_name = (formData.get("icon_name") as string) || "Layers";
  const max_items = Number(formData.get("max_items") || 4);
  const sort_order = Number(formData.get("sort_order") || 0);
  const is_active = formData.get("is_active") === "true";

  if (!title) {
    return { success: false, error: "Title is required" };
  }

  const payload = {
    title,
    subtitle: subtitle || "",
    category_id: category_id === "all" ? null : category_id,
    shelf_type,
    icon_name,
    max_items,
    sort_order,
    is_active,
    updated_at: new Date().toISOString(),
  };

  if (id) {
    const { error } = await adminClient
      .from("curated_shelves")
      .update(payload)
      .eq("id", id);
    if (error) return { success: false, error: error.message };
  } else {
    const { error } = await adminClient
      .from("curated_shelves")
      .insert(payload);
    if (error) return { success: false, error: error.message };
  }

  revalidatePath("/storefront/shelves");
  return { success: true };
}

/**
 * Deletes a curated shelf.
 */
export async function deleteCuratedShelfAction(id: string) {
  await verifyAdmin();
  const adminClient = createAdminClient();

  const { error } = await adminClient
    .from("curated_shelves")
    .delete()
    .eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/storefront/shelves");
  return { success: true };
}
