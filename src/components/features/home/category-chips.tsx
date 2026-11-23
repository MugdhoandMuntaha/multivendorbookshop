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
  bgColor: string;
  iconColor: string;
  icon: React.ComponentType<{ className?: string }>;
}

const CATEGORY_CHIPS: CategoryChipItem[] = [
  {
    id: "cat-1",
    nameBn: "উপন্যাস",
    nameEn: "Novels",
    slug: "fiction-literature",
    bgColor: "bg-amber-100/80 hover:bg-amber-100",
    iconColor: "text-amber-700",
    icon: BookOpen,
  },
  {
    id: "cat-2",
    nameBn: "গল্প",
    nameEn: "Stories",
    slug: "fiction-literature",
    bgColor: "bg-purple-100/80 hover:bg-purple-100",
    iconColor: "text-purple-700",
    icon: Feather,
  },
  {
    id: "cat-3",
    nameBn: "প্রবন্ধ",
    nameEn: "Essays",
    slug: "history-heritage",
    bgColor: "bg-emerald-100/80 hover:bg-emerald-100",
    iconColor: "text-emerald-700",
    icon: FileText,
  },
  {
    id: "cat-4",
    nameBn: "ইসলামিক",
    nameEn: "Islamic",
    slug: "islamic-theological",
    bgColor: "bg-teal-100/80 hover:bg-teal-100",
    iconColor: "text-teal-700",
    icon: Moon,
  },
  {
    id: "cat-5",
    nameBn: "শিক্ষা",
    nameEn: "Education",
    slug: "academic-hsc-ssc",
    bgColor: "bg-blue-100/80 hover:bg-blue-100",
    iconColor: "text-blue-700",
    icon: GraduationCap,
  },
  {
    id: "cat-6",
    nameBn: "ইতিহাস",
    nameEn: "History",
    slug: "history-heritage",
    bgColor: "bg-orange-100/80 hover:bg-orange-100",
    iconColor: "text-orange-700",
    icon: Landmark,
  },
  {
    id: "cat-7",
    nameBn: "বিজ্ঞান",
    nameEn: "Science",
    slug: "computer-science-engineering",
    bgColor: "bg-sky-100/80 hover:bg-sky-100",
    iconColor: "text-sky-700",
    icon: FlaskConical,
  },
  {
    id: "cat-8",
    nameBn: "স্বাস্থ্য",
    nameEn: "Health",
    slug: "medical-engineering-admission",
    bgColor: "bg-rose-100/80 hover:bg-rose-100",
    iconColor: "text-rose-700",
    icon: Heart,
  },
  {
    id: "cat-9",
    nameBn: "অন্যান্য",
    nameEn: "Others",
    slug: "books",
    bgColor: "bg-slate-100/80 hover:bg-slate-100",
    iconColor: "text-slate-700",
    icon: LayoutGrid,
  },
];

export function CategoryChips() {
  const { locale } = useLanguage();

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
            {locale === "bn" ? "বিভাগ সমূহ" : "Browse Categories"}
          </h2>
          <p className="text-xs text-slate-500">
            {locale === "bn"
              ? "আপনার পছন্দের বই খুঁজুন"
              : "Discover books by your favorite genres & subjects"}
          </p>
        </div>

        <Link
          href="/categories"
          className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 hover:text-emerald-950"
        >
          <span>{locale === "bn" ? "সব বিভাগ" : "All Categories"}</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Categories Horizontal Carousel */}
      <div className="relative">
        <div className="flex items-center gap-3.5 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORY_CHIPS.map((cat) => {
            const Icon = cat.icon;
            const displayName = locale === "bn" ? cat.nameBn : cat.nameEn;
            const linkHref = cat.slug === "books" ? "/books" : `/books?category=${cat.slug}`;

            return (
              <Link
                key={cat.id}
                href={linkHref}
                className="group flex flex-col items-center gap-2 shrink-0 transition-transform hover:-translate-y-1"
              >
                <div
                  className={`flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl ${cat.bgColor} transition-shadow group-hover:shadow-md`}
                >
                  <Icon className={`h-7 w-7 sm:h-8 sm:w-8 ${cat.iconColor}`} />
                </div>
                <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-800 text-center">
                  {displayName}
                </span>
              </Link>
            );
          })}

          <Link
            href="/categories"
            className="flex h-16 w-16 sm:h-20 sm:w-20 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-400 hover:border-emerald-300 hover:text-emerald-800 hover:shadow-md transition-all self-start"
            title="View all categories"
          >
            <ChevronRight className="h-6 w-6" />
          </Link>
        </div>
      </div>
    </section>
  );
}
