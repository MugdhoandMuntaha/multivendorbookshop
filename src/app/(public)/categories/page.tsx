import Link from "next/link";
import { Metadata } from "next";
import {
  ChevronRight,
  GraduationCap,
  BookOpen,
  Cpu,
  Rocket,
  Lightbulb,
  Landmark,
  Compass,
  TrendingUp,
  ArrowRight,
  Grid,
} from "lucide-react";
import { getServerLocale, getDictionary } from "@/lib/i18n/server";
import { getAllCategoriesWithCounts } from "@/server/queries/categories";

export const metadata: Metadata = {
  title: "Book Categories & Subjects | RTDS Bookshop",
  description:
    "Explore categories across medical admission guides, university test series, engineering, Bengali literature, and classics.",
};

const iconMap: Record<string, React.ElementType> = {
  GraduationCap,
  BookOpen,
  Cpu,
  Rocket,
  Lightbulb,
  Landmark,
  Compass,
  TrendingUp,
};

export default async function CategoriesPage() {
  const locale = await getServerLocale();
  const dict = getDictionary(locale);
  const categories = await getAllCategoriesWithCounts();

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20">
      {/* Breadcrumb Strip */}
      <div className="border-b border-emerald-950/5 bg-white/70 backdrop-blur-xs">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <Link
              href="/"
              className="hover:text-emerald-700 transition-colors"
            >
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
            <span className="font-bold text-emerald-800">
              {dict.categories.title}
            </span>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Banner */}
        <div className="neo-card p-6 sm:p-8 rounded-2xl relative overflow-hidden">
          <div className="max-w-2xl relative z-10 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black tracking-wide uppercase">
              <Grid className="h-3.5 w-3.5 text-emerald-700" />
              <span>{dict.categories.allCategories}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {dict.categories.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
              {dict.categories.subtitle}
            </p>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {categories.map((cat) => {
            const Icon = (cat.icon_name && iconMap[cat.icon_name]) || BookOpen;

            return (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                className="neo-card neo-card-hover p-5 rounded-2xl flex flex-col justify-between group transition-all"
              >
                <div className="space-y-3">
                  <div className="h-12 w-12 rounded-xl bg-emerald-100/70 text-emerald-800 flex items-center justify-center transition-colors group-hover:bg-emerald-600 group-hover:text-white shadow-xs">
                    <Icon className="h-6 w-6 transition-transform group-hover:scale-110" />
                  </div>

                  <div>
                    <h2 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                      {cat.name}
                    </h2>
                    <p className="text-xs text-slate-500 font-normal mt-1 line-clamp-2">
                      {cat.description ||
                        "Browse quality authentic books in this category."}
                    </p>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-emerald-100/60 flex items-center justify-between text-xs">
                  <span className="neo-pill-mint px-2 py-0.5 text-[11px] font-bold">
                    {cat.book_count}{" "}
                    {locale === "bn"
                      ? dict.categories.booksCount
                      : dict.categories.booksCount}
                  </span>
                  <span className="font-bold text-emerald-700 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    <span>{dict.categories.viewCategory}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
