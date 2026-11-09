"use server";

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2Client, R2_BUCKET_NAME } from "@/server/r2";
import { createClient } from "@/lib/supabase/server";
import crypto from "crypto";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export interface PresignedUrlResult {
  success: boolean;
  presignedUrl?: string;
  r2Key?: string;
  error?: string;
}

/**
 * Generates a presigned PUT URL for direct client-to-R2 upload for admin CMS.
 * Direct upload: Next.js server never touches image binaries.
 */
export async function getAdminPresignedUploadUrl(
  fileName: string,
  contentType: string,
  fileSize: number,
  folder: "hero" | "shelves" | "banners" = "hero"
): Promise<PresignedUrlResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Authentication required" };
    }

    if (!ALLOWED_MIME_TYPES.includes(contentType)) {
      return {
        success: false,
        error: "Invalid file type. Allowed: JPEG, PNG, WebP, SVG.",
      };
    }

    if (fileSize > MAX_FILE_SIZE_BYTES) {
      return {
        success: false,
        error: "File size exceeds the 5 MB limit.",
      };
    }

    const ext = fileName.split(".").pop()?.toLowerCase() || "jpg";
    const randomHex = crypto.randomBytes(16).toString("hex");
    const r2Key = `cms/${folder}/${Date.now()}-${randomHex}.${ext}`;

    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: r2Key,
      ContentType: contentType,
      ContentLength: fileSize,
    });

    const presignedUrl = await getSignedUrl(r2Client, command, {
      expiresIn: 300, // 5 minutes
    });

    return {
      success: true,
      presignedUrl,
      r2Key,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to generate presigned upload URL",
    };
  }
}
