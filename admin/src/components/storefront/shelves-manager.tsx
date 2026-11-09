"use client";

import { useState } from "react";
import {
  Layers,
  Plus,
  Trash2,
  Edit2,
  Flame,
  GraduationCap,
  Sparkles,
  BookOpen,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { CuratedShelfRow } from "@/server/queries/admin";
import {
  upsertCuratedShelfAction,
  deleteCuratedShelfAction,
} from "@/server/actions/storefront";

const ICON_OPTIONS = [
  { label: "Flame (Trending)", value: "Flame" },
  { label: "GraduationCap (Admission)", value: "GraduationCap" },
  { label: "Sparkles (Classics/Rare)", value: "Sparkles" },
  { label: "BookOpen (General)", value: "BookOpen" },
  { label: "Layers (Curated)", value: "Layers" },
];

interface ShelvesManagerProps {
  initialShelves: CuratedShelfRow[];
  categories: { id: string; name: string }[];
}

export function ShelvesManager({
  initialShelves,
  categories,
}: ShelvesManagerProps) {
  const [shelves, setShelves] = useState<CuratedShelfRow[]>(initialShelves);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [categoryId, setCategoryId] = useState("all");
  const [shelfType, setShelfType] = useState("custom");
  const [iconName, setIconName] = useState("Flame");
  const [maxItems, setMaxItems] = useState(4);
  const [sortOrder, setSortOrder] = useState(shelves.length);
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);

  function openCreateModal() {
    setEditingId(null);
    setTitle("");
    setSubtitle("");
    setCategoryId("all");
    setShelfType("custom");
    setIconName("Flame");
    setMaxItems(4);
    setSortOrder(shelves.length);
    setIsActive(true);
    setIsModalOpen(true);
  }

  function openEditModal(shelf: CuratedShelfRow) {
    setEditingId(shelf.id);
    setTitle(shelf.title);
    setSubtitle(shelf.subtitle || "");
    setCategoryId(shelf.category_id || "all");
    setShelfType(shelf.shelf_type);
    setIconName(shelf.icon_name || "Layers");
    setMaxItems(shelf.max_items || 4);
    setSortOrder(shelf.sort_order);
    setIsActive(shelf.is_active);
    setIsModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    if (editingId) formData.set("id", editingId);
    formData.set("title", title);
    formData.set("subtitle", subtitle);
    formData.set("category_id", categoryId);
    formData.set("shelf_type", shelfType);
    formData.set("icon_name", iconName);
    formData.set("max_items", String(maxItems));
    formData.set("sort_order", String(sortOrder));
    formData.set("is_active", String(isActive));

    const res = await upsertCuratedShelfAction(formData);
    setLoading(false);

    if (res.success) {
      setIsModalOpen(false);
      window.location.reload();
    } else {
      alert("Error: " + res.error);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("আপনি কি নিশ্চিতভাবে এই শেলফটি মুছে ফেলতে চান?")) return;
    const res = await deleteCuratedShelfAction(id);
    if (res.success) {
      setShelves((prev) => prev.filter((s) => s.id !== id));
    } else {
      alert("Error: " + res.error);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900">
            হোমপেজ বুক শেলফসমূহ ({shelves.length})
          </h2>
          <p className="text-xs text-slate-500">
            হোমপেজে প্রদর্শিত ক্যাটাগরি, বেস্টসেলার ও স্পেশাল বুক সেকশন সাজান
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="neo-button-green flex h-9 items-center gap-1.5 rounded-xl px-4 text-xs font-bold"
        >
          <Plus className="h-4 w-4" />
          <span>নতুন শেলফ তৈরি করুন</span>
        </button>
      </div>

      {/* Modal / Form */}
      {isModalOpen && (
        <form onSubmit={handleSubmit} className="neo-card p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">
              {editingId ? "শেলফ তথ্য সম্পাদনা করুন" : "নতুন হোমপেজ শেলফ যোগ করুন"}
            </h3>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="text-xs font-bold text-slate-400 hover:text-slate-600"
            >
              ✕ বন্ধ করুন
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-bold text-slate-700">শেলফ শিরোনাম (Title) *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="যেমন: সর্বাধিক বিক্রিত বইসমূহ (Trending Bestsellers)"
                className="neo-input-recessed w-full rounded-xl px-3.5 py-2 text-xs"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-bold text-slate-700">উপ-শিরোনাম (Subtitle)</label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="দেশজুড়ে পাঠকদের পছন্দের তালিকায় থাকা সেরা বইসমূহ"
                className="neo-input-recessed w-full rounded-xl px-3.5 py-2 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">ক্যাটাগরি ফিল্টার</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="neo-input-recessed w-full rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-800"
              >
                <option value="all">সকল বই (Global Bestsellers)</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">আইকন (Icon)</label>
              <select
                value={iconName}
                onChange={(e) => setIconName(e.target.value)}
                className="neo-input-recessed w-full rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-800"
              >
                {ICON_OPTIONS.map((i) => (
                  <option key={i.value} value={i.value}>
                    {i.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">সর্বোচ্চ বই সংখ্যা</label>
              <input
                type="number"
                value={maxItems}
                onChange={(e) => setMaxItems(Number(e.target.value))}
                className="neo-input-recessed w-full rounded-xl px-3.5 py-2 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">সর্ট অর্ডার (ক্রম)</label>
              <input
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(Number(e.target.value))}
                className="neo-input-recessed w-full rounded-xl px-3.5 py-2 text-xs"
              />
            </div>

            <div className="flex items-center gap-2 pt-2 sm:col-span-2">
              <input
                type="checkbox"
                id="shelf_active"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="h-4 w-4 rounded accent-emerald-600"
              />
              <label
                htmlFor="shelf_active"
                className="text-xs font-bold text-slate-800 cursor-pointer"
              >
                হোমপেজে সক্রিয় রাখুন (Show on Homepage)
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-emerald-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="neo-button-light rounded-xl px-4 py-2 text-xs font-bold"
            >
              বাতিল
            </button>
            <button
              type="submit"
              disabled={loading}
              className="neo-button-green rounded-xl px-5 py-2 text-xs font-bold disabled:opacity-50"
            >
              {loading ? "সংরক্ষণ করা হচ্ছে..." : "শেলফ সংরক্ষণ করুন"}
            </button>
          </div>
        </form>
      )}

      {/* Shelves List */}
      <div className="space-y-4">
        {shelves.map((shelf) => (
          <div
            key={shelf.id}
            className="neo-card p-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                  ক্রম: {shelf.sort_order}
                </span>
                <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                  আইকন: {shelf.icon_name}
                </span>
                <span
                  className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                    shelf.is_active
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {shelf.is_active ? "সক্রিয়" : "বন্ধ"}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 leading-snug">
                {shelf.title}
              </h3>
              <p className="text-xs text-slate-500">{shelf.subtitle}</p>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                type="button"
                onClick={() => openEditModal(shelf)}
                className="neo-button-light flex h-8 items-center gap-1.5 rounded-lg px-3 text-xs font-bold text-emerald-800"
              >
                <Edit2 className="h-3.5 w-3.5" />
                <span>সম্পাদনা</span>
              </button>

              <button
                type="button"
                onClick={() => handleDelete(shelf.id)}
                className="neo-button-light flex h-8 items-center gap-1 rounded-lg px-2.5 text-xs font-bold text-rose-600 hover:text-rose-700"
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
