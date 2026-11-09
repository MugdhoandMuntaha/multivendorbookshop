"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { UploadCloud, X, Star, Loader2 } from "lucide-react";
import { getPresignedUploadUrl } from "@/server/actions/upload";
import { getR2ImageUrl } from "@/lib/utils";

export interface UploadedImage {
  r2_key: string;
  position: number;
}

interface ImageUploaderProps {
  images: UploadedImage[];
  onChange: (images: UploadedImage[]) => void;
  maxImages?: number;
  folder?: "books" | "vendors" | "avatars";
}

export function ImageUploader({
  images,
  onChange,
  maxImages = 5,
  folder = "books",
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgressText, setUploadProgressText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    if (images.length + files.length > maxImages) {
      setError(`You can upload a maximum of ${maxImages} images.`);
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const newlyUploaded: UploadedImage[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setUploadProgressText(
          `Uploading ${file.name} (${i + 1}/${files.length})...`
        );

        // 1. Get direct-to-R2 presigned URL
        const presignedRes = await getPresignedUploadUrl(
          file.name,
          file.type,
          file.size,
          folder
        );

        if (
          !presignedRes.success ||
          !presignedRes.presignedUrl ||
          !presignedRes.r2Key
        ) {
          throw new Error(
            presignedRes.error ||
              `Failed to get upload authorization for ${file.name}`
          );
        }

        // 2. Direct PUT to Cloudflare R2
        const uploadRes = await fetch(presignedRes.presignedUrl, {
          method: "PUT",
          body: file,
          headers: {
            "Content-Type": file.type,
          },
        });

        if (!uploadRes.ok) {
          throw new Error(
            `Direct R2 upload failed with status ${uploadRes.status}`
          );
        }

        newlyUploaded.push({
          r2_key: presignedRes.r2Key,
          position: images.length + i,
        });
      }

      onChange([...images, ...newlyUploaded]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Image upload failed";
      setError(msg);
    } finally {
      setUploading(false);
      setUploadProgressText("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemove = (index: number) => {
    const updated = images
      .filter((_, i) => i !== index)
      .map((img, i) => ({ ...img, position: i }));
    onChange(updated);
  };

  const handleSetPrimary = (index: number) => {
    if (index === 0) return;
    const item = images[index];
    const filtered = images.filter((_, i) => i !== index);
    const updated = [item, ...filtered].map((img, i) => ({
      ...img,
      position: i,
    }));
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      {/* Upload Dropzone */}
      <div
        onClick={() => !uploading && fileInputRef.current?.click()}
        className={`border-muted-foreground/30 hover:border-primary/50 relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 transition-colors ${
          uploading ? "cursor-not-allowed opacity-60" : "cursor-pointer"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileSelect}
          disabled={uploading || images.length >= maxImages}
          className="hidden"
        />

        {uploading ? (
          <div className="flex flex-col items-center gap-2 py-2">
            <Loader2 className="text-primary h-8 w-8 animate-spin" />
            <p className="text-foreground text-sm font-medium">
              {uploadProgressText}
            </p>
            <p className="text-muted-foreground text-xs">
              Sending directly to Cloudflare R2...
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-full">
              <UploadCloud className="h-6 w-6" />
            </div>
            <div>
              <p className="text-foreground text-sm font-semibold">
                Click or drag to upload book photos
              </p>
              <p className="text-muted-foreground mt-0.5 text-xs">
                Supports JPEG, PNG, WebP up to 5 MB (Max {maxImages} images)
              </p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Uploaded Images Thumbnails */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {images.map((img, index) => {
            const isPrimary = index === 0;
            const url = getR2ImageUrl(img.r2_key);

            return (
              <div
                key={img.r2_key}
                className="group bg-muted relative aspect-3/4 overflow-hidden rounded-lg border"
              >
                <Image
                  src={url}
                  alt={`Book photo ${index + 1}`}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
                  className="object-cover"
                />

                {/* Primary Cover Badge */}
                {isPrimary ? (
                  <span className="bg-primary text-primary-foreground absolute top-1.5 left-1.5 flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-bold shadow">
                    <Star className="h-3 w-3 fill-current" />
                    Cover
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSetPrimary(index);
                    }}
                    className="bg-background/90 text-foreground hover:bg-background absolute top-1.5 left-1.5 hidden rounded px-1.5 py-0.5 text-[10px] font-medium shadow group-hover:block"
                    title="Set as primary cover"
                  >
                    Set Cover
                  </button>
                )}

                {/* Remove Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(index);
                  }}
                  className="bg-background/90 text-foreground hover:bg-destructive hover:text-destructive-foreground absolute top-1.5 right-1.5 flex h-6 w-6 items-center justify-center rounded-full shadow transition-colors"
                  title="Remove image"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
