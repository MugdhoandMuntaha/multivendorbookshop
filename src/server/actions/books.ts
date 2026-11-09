"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/server/queries/auth";
import { bookSchema, type BookInput } from "@/lib/validators/book";
import { toMinorUnits } from "@/lib/utils";
import { BookStatus } from "@/types/database";

export interface BookActionResult {
  success: boolean;
  error?: string;
  bookId?: string;
}

/**
 * Creates a new book listing with R2 image associations.
 * Enforces vendor approval status and ownership.
 */
export async function createBook(input: BookInput): Promise<BookActionResult> {
  try {
    const user = await requireUser("/login");
    const parsed = bookSchema.safeParse(input);

    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message || "Invalid book details",
      };
    }

    const supabase = await createClient();

    // 1. Verify caller owns an approved vendor account
    const { data: vendor, error: vendorError } = await supabase
      .from("vendors")
      .select("id, status")
      .eq("owner_id", user.id)
      .maybeSingle();

    if (vendorError || !vendor) {
      return {
        success: false,
        error: "Vendor profile not found. Please apply for a vendor account.",
      };
    }

    if (vendor.status !== "approved") {
      return {
        success: false,
        error: `Your shop status is '${vendor.status}'. Listings can only be created once your shop is approved by admin.`,
      };
    }

    // 2. Insert book record
    const { data: newBook, error: bookInsertError } = await supabase
      .from("books")
      .insert({
        vendor_id: vendor.id,
        title: parsed.data.title,
        author: parsed.data.author,
        isbn: parsed.data.isbn || null,
        description: parsed.data.description,
        category_id: parsed.data.categoryId,
        condition: parsed.data.condition,
        price_minor: toMinorUnits(parsed.data.price),
        currency: "BDT",
        stock: parsed.data.stock,
        status: parsed.data.status,
      })
      .select("id")
      .single();

    if (bookInsertError || !newBook) {
      return {
        success: false,
        error: bookInsertError?.message || "Failed to create book listing",
      };
    }

    // 3. Associate uploaded R2 images
    if (parsed.data.images && parsed.data.images.length > 0) {
      const imageRecords = parsed.data.images.map((img, index) => ({
        book_id: newBook.id,
        r2_key: img.r2_key,
        position: img.position ?? index,
      }));

      const { error: imageError } = await supabase
        .from("book_images")
        .insert(imageRecords);

      if (imageError) {
        console.error("Failed to associate book images:", imageError);
      }
    }

    revalidatePath("/vendor/books");
    revalidatePath("/vendor/dashboard");
    revalidatePath("/books");
    revalidatePath("/");

    return {
      success: true,
      bookId: newBook.id,
    };
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to create book";
    return {
      success: false,
      error: message,
    };
  }
}

/**
 * Updates an existing book listing and synchronizes images.
 * Enforces vendor ownership via RLS and server check.
 */
export async function updateBook(
  bookId: string,
  input: BookInput
): Promise<BookActionResult> {
  try {
    const user = await requireUser("/login");
    const parsed = bookSchema.safeParse(input);

    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message || "Invalid book details",
      };
    }

    const supabase = await createClient();

    // 1. Verify caller owns this vendor
    const { data: vendor } = await supabase
      .from("vendors")
      .select("id")
      .eq("owner_id", user.id)
      .maybeSingle();

    if (!vendor) {
      return {
        success: false,
        error: "Unauthorized: Vendor account not found",
      };
    }

    // 2. Update book details
    const { error: updateError } = await supabase
      .from("books")
      .update({
        title: parsed.data.title,
        author: parsed.data.author,
        isbn: parsed.data.isbn || null,
        description: parsed.data.description,
        category_id: parsed.data.categoryId,
        condition: parsed.data.condition,
        price_minor: toMinorUnits(parsed.data.price),
        stock: parsed.data.stock,
        status: parsed.data.status,
      })
      .eq("id", bookId)
      .eq("vendor_id", vendor.id);

    if (updateError) {
      return {
        success: false,
        error: updateError.message,
      };
    }

    // 3. Sync images: replace existing with updated image set
    if (parsed.data.images && parsed.data.images.length > 0) {
      await supabase.from("book_images").delete().eq("book_id", bookId);

      const imageRecords = parsed.data.images.map((img, index) => ({
        book_id: bookId,
        r2_key: img.r2_key,
        position: img.position ?? index,
      }));

      await supabase.from("book_images").insert(imageRecords);
    }

    revalidatePath("/vendor/books");
    revalidatePath(`/vendor/books/${bookId}/edit`);
    revalidatePath(`/books/${bookId}`);
    revalidatePath("/books");
    revalidatePath("/");

    return {
      success: true,
      bookId,
    };
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to update book";
    return {
      success: false,
      error: message,
    };
  }
}

/**
 * Changes status of a book (e.g. active, draft, archived).
 */
export async function toggleBookStatus(
  bookId: string,
  status: BookStatus
): Promise<BookActionResult> {
  try {
    const user = await requireUser();
    const supabase = await createClient();

    const { data: vendor } = await supabase
      .from("vendors")
      .select("id")
      .eq("owner_id", user.id)
      .maybeSingle();

    if (!vendor) {
      return { success: false, error: "Unauthorized" };
    }

    const { error } = await supabase
      .from("books")
      .update({ status })
      .eq("id", bookId)
      .eq("vendor_id", vendor.id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/vendor/books");
    revalidatePath("/vendor/dashboard");
    revalidatePath("/books");
    return { success: true };
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to change book status";
    return { success: false, error: message };
  }
}

/**
 * Archives a book listing.
 */
export async function archiveBook(bookId: string): Promise<BookActionResult> {
  return toggleBookStatus(bookId, "archived");
}
