"use client";

import Link from "next/link";
import {
  BookOpen,
  Feather,
  FileText,
  Moon,
  GraduationCap,
  Landmark,
  FlaskConical,
  Heart,
  LayoutGrid,
  ChevronRight,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";

interface CategoryChipItem {
  id: string;
  nameBn: string;
  nameEn: string;
  slug: string;
  icon: React.ComponentType<{ className?: string }>;
}

const CATEGORY_CHIPS: CategoryChipItem[] = [
  {
    id: "cat-1",
    nameBn: "উপন্যাস",
    nameEn: "Novels",
    slug: "fiction-literature",
    icon: BookOpen,
  },
  {
    id: "cat-2",
    nameBn: "গল্প",
    nameEn: "Stories",
    slug: "fiction-literature",
    icon: Feather,
  },
  {
    id: "cat-3",
    nameBn: "প্রবন্ধ",
    nameEn: "Essays",
    slug: "history-heritage",
    icon: FileText,
  },
  {
    id: "cat-4",
    nameBn: "ইসলামিক",
    nameEn: "Islamic",
    slug: "islamic-theological",
    icon: Moon,
  },
  {
    id: "cat-5",
    nameBn: "শিক্ষা",
    nameEn: "Education",
    slug: "academic-hsc-ssc",
    icon: GraduationCap,
  },
  {
    id: "cat-6",
    nameBn: "ইতিহাস",
    nameEn: "History",
    slug: "history-heritage",
    icon: Landmark,
  },
  {
    id: "cat-7",
    nameBn: "বিজ্ঞান",
    nameEn: "Science",
    slug: "computer-science-engineering",
    icon: FlaskConical,
  },
  {
    id: "cat-8",
    nameBn: "স্বাস্থ্য",
    nameEn: "Health",
    slug: "medical-engineering-admission",
    icon: Heart,
  },
  {
    id: "cat-9",
    nameBn: "অন্যান্য",
    nameEn: "Others",
    slug: "books",
    icon: LayoutGrid,
  },
];

export function CategoryChips() {
  const { locale } = useLanguage();

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-slate-900">
            {locale === "bn" ? "বিভাগ সমূহ" : "Browse Categories"}
          </h2>
          <p className="text-xs text-slate-500">
            {locale === "bn"
              ? "আপনার পছন্দের বই খুঁজুন"
              : "Discover books by genres & subjects"}
          </p>
        </div>

        <Link
          href="/categories"
          className="hidden sm:inline-flex items-center gap-1 text-xs font-medium text-emerald-800 hover:text-emerald-950 transition-colors"
        >
          <span>{locale === "bn" ? "সব বিভাগ" : "All Categories"}</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Categories Horizontal Row */}
      <div className="relative">
        <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORY_CHIPS.map((cat) => {
            const Icon = cat.icon;
            const displayName = locale === "bn" ? cat.nameBn : cat.nameEn;
            const linkHref = cat.slug === "books" ? "/books" : `/books?category=${cat.slug}`;

            return (
              <Link
                key={cat.id}
                href={linkHref}
                className="group flex flex-col items-center gap-2 shrink-0"
              >
                <div className="flex h-16 w-16 sm:h-18 sm:w-18 items-center justify-center rounded-xl border border-stone-200/80 bg-stone-50/70 text-stone-700 transition-colors group-hover:border-[#0c3823] group-hover:bg-[#0c3823]/5 group-hover:text-[#0c3823]">
                  <Icon className="h-6 w-6 stroke-[1.5]" />
                </div>
                <span className="text-xs font-medium text-stone-700 group-hover:text-[#0c3823] text-center transition-colors">
                  {displayName}
                </span>
              </Link>
            );
          })}

          <Link
            href="/categories"
            className="flex h-16 w-16 sm:h-18 sm:w-18 shrink-0 items-center justify-center rounded-xl border border-stone-200/80 bg-white text-stone-400 hover:border-emerald-800 hover:text-emerald-900 transition-colors self-start"
            title="View all categories"
          >
            <ChevronRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
