"use client";

import { useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { getR2PublicUrl } from "@/lib/r2/utils";
import { Dictionary } from "@/lib/i18n/types";

interface BookGalleryProps {
  title: string;
  condition: string;
  discountPercent?: number;
  images: { r2_key: string; position: number }[];
  dict: Dictionary;
}

export function BookGallery({
  title,
  condition,
  discountPercent,
  images,
  dict,
}: BookGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const displayImages =
    images.length > 0
      ? images
      : [{ r2_key: "books/placeholder.webp", position: 0 }];

  const currentImageKey = displayImages[selectedIndex]?.r2_key;
  const currentImageUrl = getR2PublicUrl(currentImageKey);

  return (
    <div className="space-y-4">
      {/* Main Image Stage with Neomorphic soft frame */}
      <div className="neo-card relative aspect-[3/4] w-full max-w-md mx-auto overflow-hidden rounded-2xl p-3 border border-emerald-950/5">
        <div className="relative h-full w-full rounded-xl overflow-hidden bg-slate-50">
          <Image
            src={currentImageUrl}
            alt={title}
            fill
            priority
            className="object-cover transition-transform duration-500 hover:scale-105"
            sizes="(max-width: 768px) 90vw, 40vw"
          />
        </div>

        {/* Discount Badge */}
        {discountPercent !== undefined && discountPercent > 0 && (
          <Badge className="absolute top-5 left-5 bg-emerald-600 px-2.5 py-1 text-xs font-black text-white shadow-md">
            -{discountPercent}% {dict.common.off}
          </Badge>
        )}

        {/* Condition Badge */}
        <Badge
          variant="outline"
          className="absolute top-5 right-5 border-emerald-200/90 bg-white/95 text-xs font-bold text-emerald-800 capitalize shadow-xs backdrop-blur-md"
        >
          {condition.replace("_", " ")}
        </Badge>
      </div>

      {/* Thumbnails row if more than 1 image */}
      {displayImages.length > 1 && (
        <div className="flex items-center justify-center gap-3 overflow-x-auto py-2">
          {displayImages.map((img, idx) => {
            const thumbUrl = getR2PublicUrl(img.r2_key);
            const isSelected = idx === selectedIndex;
            return (
              <button
                key={img.r2_key + idx}
                type="button"
                onClick={() => setSelectedIndex(idx)}
                className={`relative h-16 w-12 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                  isSelected
                    ? "border-emerald-600 ring-2 ring-emerald-500/30 scale-105"
                    : "border-slate-200 opacity-70 hover:opacity-100"
                }`}
              >
                <Image
                  src={thumbUrl}
                  alt={`${title} - view ${idx + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
