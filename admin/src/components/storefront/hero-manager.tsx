"use client";

import { useState } from "react";
import {
  Plus,
  Trash2,
  CheckCircle,
  XCircle,
  Upload,
  ArrowUpDown,
  Sparkles,
  Link as LinkIcon,
} from "lucide-react";
import { HeroSlideRow } from "@/server/queries/admin";
import {
  createHeroSlideAction,
  deleteHeroSlideAction,
  toggleHeroSlideActiveAction,
} from "@/server/actions/storefront";
import { getAdminPresignedUploadUrl } from "@/server/actions/upload";

const GRADIENT_PRESETS = [
  {
    label: "Emerald Lush (Default)",
    value: "from-emerald-800 via-emerald-700 to-teal-800",
  },
  {
    label: "Forest Pine & Gold",
    value: "from-emerald-900 via-teal-900 to-slate-900",
  },
  {
    label: "Teal Academic",
    value: "from-teal-800 via-emerald-800 to-cyan-900",
  },
  {
    label: "Midnight Emerald",
    value: "from-slate-900 via-emerald-950 to-teal-950",
  },
];

interface HeroManagerProps {
  initialSlides: HeroSlideRow[];
}

export function HeroManager({ initialSlides }: HeroManagerProps) {
  const [slides, setSlides] = useState<HeroSlideRow[]>(initialSlides);
  const [isAdding, setIsAdding] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [r2Key, setR2Key] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [badgeText, setBadgeText] = useState("RTDS National Book Fair & Admission Fest 2026");
  const [ctaText, setCtaText] = useState("Browse Book Catalog");
  const [ctaLink, setCtaLink] = useState("/books");
  const [bgGradient, setBgGradient] = useState(GRADIENT_PRESETS[0].value);
  const [sortOrder, setSortOrder] = useState(slides.length);
  const [isActive, setIsActive] = useState(true);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const { success, presignedUrl, r2Key, error } =
        await getAdminPresignedUploadUrl(
          file.name,
          file.type,
          file.size,
          "hero"
        );

      if (!success || !presignedUrl || !r2Key) {
        alert(error || "Failed to generate presigned upload URL");
        setUploading(false);
        return;
      }

      // Direct PUT to Cloudflare R2 (Next.js server never touches the binary)
      const uploadRes = await fetch(presignedUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });

      if (!uploadRes.ok) {
        alert("Failed to upload image directly to Cloudflare R2 bucket");
        setUploading(false);
        return;
      }

      setR2Key(r2Key);
      alert("Image uploaded successfully to Cloudflare R2 bucket!");
    } catch (err) {
      alert("Upload error: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setUploading(false);
    }
  }

  async function handleCreateSlide(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.set("title", title);
    formData.set("subtitle", subtitle);
    formData.set("badge_text", badgeText);
    formData.set("cta_text", ctaText);
    formData.set("cta_link", ctaLink);
    formData.set("bg_gradient", bgGradient);
    formData.set("sort_order", String(sortOrder));
    formData.set("is_active", String(isActive));
    if (r2Key) {
      formData.set("image_r2_key", r2Key);
    }

    const res = await createHeroSlideAction(formData);
    setLoading(false);

    if (res.success) {
      setIsAdding(false);
      window.location.reload();
    } else {
      alert("Error: " + res.error);
    }
  }

  async function handleToggle(id: string, current: boolean) {
    const res = await toggleHeroSlideActiveAction(id, !current);
    if (res.success) {
      setSlides((prev) =>
        prev.map((s) => (s.id === id ? { ...s, is_active: !current } : s))
      );
    } else {
      alert("Error: " + res.error);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this hero slide?")) return;
    const res = await deleteHeroSlideAction(id);
    if (res.success) {
      setSlides((prev) => prev.filter((s) => s.id !== id));
    } else {
      alert("Error: " + res.error);
    }
  }

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900">
            Hero Campaign Banners ({slides.length})
          </h2>
          <p className="text-xs text-slate-500">
            Configure promotional sliders and campaign banners displayed on the storefront
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAdding(!isAdding)}
          className="neo-button-green flex h-9 items-center gap-1.5 rounded-xl px-4 text-xs font-bold"
        >
          <Plus className="h-4 w-4" />
          <span>{isAdding ? "Cancel" : "Add New Slide"}</span>
        </button>
      </div>

      {/* Add New Slide Form Modal / Card */}
      {isAdding && (
        <form onSubmit={handleCreateSlide} className="neo-card p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-emerald-100 pb-3">
            <Sparkles className="h-4 w-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Create New Hero Campaign Slide
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-bold text-slate-700">
                Headline Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Trusted Marketplace for Medical, Engineering & Academic Books"
                className="neo-input-recessed w-full rounded-xl px-3.5 py-2 text-xs"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-bold text-slate-700">
                Subtitle Description
              </label>
              <textarea
                rows={2}
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Order RTDS Medical Master Series, Engineering Guides, and Literature..."
                className="neo-input-recessed w-full rounded-xl px-3.5 py-2 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                Badge Text
              </label>
              <input
                type="text"
                value={badgeText}
                onChange={(e) => setBadgeText(e.target.value)}
                placeholder="RTDS National Book Fair & Admission Fest 2026"
                className="neo-input-recessed w-full rounded-xl px-3.5 py-2 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                Background Theme Gradient
              </label>
              <select
                value={bgGradient}
                onChange={(e) => setBgGradient(e.target.value)}
                className="neo-input-recessed w-full rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-800"
              >
                {GRADIENT_PRESETS.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                CTA Button Label
              </label>
              <input
                type="text"
                value={ctaText}
                onChange={(e) => setCtaText(e.target.value)}
                placeholder="Browse Book Catalog"
                className="neo-input-recessed w-full rounded-xl px-3.5 py-2 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                CTA Button Link
              </label>
              <input
                type="text"
                value={ctaLink}
                onChange={(e) => setCtaLink(e.target.value)}
                placeholder="/books"
                className="neo-input-recessed w-full rounded-xl px-3.5 py-2 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                Display Sort Order
              </label>
              <input
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(Number(e.target.value))}
                className="neo-input-recessed w-full rounded-xl px-3.5 py-2 text-xs"
              />
            </div>

            {/* Direct Cloudflare R2 Upload */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                Slide Image (Direct Cloudflare R2 Upload)
              </label>
              <div className="flex items-center gap-3">
                <label className="neo-button-light flex h-9 cursor-pointer items-center gap-1.5 rounded-xl px-3 text-xs font-bold">
                  <Upload className="h-3.5 w-3.5 text-emerald-600" />
                  <span>{uploading ? "Uploading..." : "Select Image"}</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    disabled={uploading}
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                {r2Key && (
                  <span className="text-[11px] font-mono text-emerald-700 truncate max-w-[200px]">
                    {r2Key}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 sm:col-span-2">
              <input
                type="checkbox"
                id="is_active_input"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="h-4 w-4 rounded accent-emerald-600"
              />
              <label
                htmlFor="is_active_input"
                className="text-xs font-bold text-slate-800 cursor-pointer"
              >
                Publish Immediately on Storefront
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-emerald-100">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="neo-button-light rounded-xl px-4 py-2 text-xs font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || uploading}
              className="neo-button-green rounded-xl px-5 py-2 text-xs font-bold disabled:opacity-50"
            >
              {loading ? "Saving Slide..." : "Save & Publish"}
            </button>
          </div>
        </form>
      )}

      {/* Existing Slides List */}
      <div className="space-y-4">
        {slides.map((slide) => (
          <div
            key={slide.id}
            className="neo-card p-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                  Order: {slide.sort_order}
                </span>
                {slide.badge_text && (
                  <span className="rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                    {slide.badge_text}
                  </span>
                )}
                <span
                  className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                    slide.is_active
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {slide.is_active ? "Active" : "Draft"}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 leading-snug">
                {slide.title}
              </h3>
              <p className="text-xs text-slate-500 line-clamp-2">
                {slide.subtitle}
              </p>

              <div className="flex items-center gap-3 text-[11px] text-slate-400">
                <span className="flex items-center gap-1 font-mono text-emerald-700">
                  <LinkIcon className="h-3 w-3" />
                  {slide.cta_link}
                </span>
                <span>•</span>
                <span>Button: {slide.cta_text}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                type="button"
                onClick={() => handleToggle(slide.id, slide.is_active)}
                className={`neo-button-light flex h-8 items-center gap-1.5 rounded-lg px-3 text-xs font-bold ${
                  slide.is_active ? "text-amber-700" : "text-emerald-700"
                }`}
              >
                {slide.is_active ? (
                  <>
                    <XCircle className="h-3.5 w-3.5" />
                    <span>Deactivate</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-3.5 w-3.5" />
                    <span>Activate</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => handleDelete(slide.id)}
                className="neo-button-light flex h-8 items-center gap-1 rounded-lg px-2.5 text-xs font-bold text-rose-600 hover:text-rose-700"
                title="Delete slide"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
