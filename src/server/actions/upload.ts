"use server";

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2Client, R2_BUCKET_NAME } from "@/server/r2";
import { requireUser } from "@/server/queries/auth";
import crypto from "crypto";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export interface PresignedUrlResult {
  success: boolean;
  presignedUrl?: string;
  r2Key?: string;
  error?: string;
}

/**
 * Generates a presigned PUT URL for direct client-to-R2 upload.
 * Enforces MIME type, size limit, and authentication.
 * Next.js server never touches the binary file.
 */
export async function getPresignedUploadUrl(
  fileName: string,
  contentType: string,
  fileSize: number,
  folder: "books" | "vendors" | "avatars" = "books"
): Promise<PresignedUrlResult> {
  try {
    // 1. Authorize: user must be authenticated
    const user = await requireUser();
    if (!user) {
      return { success: false, error: "Authentication required" };
    }

    // 2. Validate MIME type
    if (!ALLOWED_MIME_TYPES.includes(contentType)) {
      return {
        success: false,
        error:
          "Invalid file type. Only JPEG, PNG, and WebP images are allowed.",
      };
    }

    // 3. Validate size limit
    if (fileSize > MAX_FILE_SIZE_BYTES) {
      return {
        success: false,
        error: "File size exceeds the 5 MB limit.",
      };
    }

    // 4. Generate unique object key
    const extension = contentType.split("/")[1] || "webp";
    const uniqueId = crypto.randomUUID();
    const sanitizedName = fileName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .slice(0, 30);
    const r2Key = `${folder}/${uniqueId}-${sanitizedName}.${extension}`;

    // 5. Generate presigned PUT URL (valid for 5 minutes)
    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: r2Key,
      ContentType: contentType,
      ContentLength: fileSize,
    });

    const presignedUrl = await getSignedUrl(r2Client, command, {
      expiresIn: 300,
    });

    return {
      success: true,
      presignedUrl,
      r2Key,
    };
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to generate upload URL";
    return {
      success: false,
      error: message,
    };
  }
}
