import { createClient } from "@/lib/supabase/server";
import { Database } from "@/types/database";
import { FALLBACK_CATEGORIES } from "./vendor";

export type CategoryRow = Database["public"]["Tables"]["categories"]["Row"];

export type CategoryWithCount = CategoryRow & {
  book_count: number;
  icon_name?: string;
  description?: string;
};

export const CATEGORY_METADATA: Record<
  string,
  { icon_name: string; description: string; book_count: number }
> = {
  "medical-engineering-admission": {
    icon_name: "GraduationCap",
    description: "RTDS Master Series, high-yield question banks, and admission shortcuts",
    book_count: 14,
  },
  "fiction-literature": {
    icon_name: "BookOpen",
    description: "Classic Bengali novels, contemporary stories, poetry, and dramas",
    book_count: 18,
  },
  "computer-science-engineering": {
    icon_name: "Cpu",
    description: "Algorithms, distributed systems, system design, and competitive programming",
    book_count: 9,
  },
  "scifi-fantasy": {
    icon_name: "Rocket",
    description: "Space opera, epic fantasy sagas, speculative fiction, and dystopian tales",
    book_count: 7,
  },
  "philosophy-society": {
    icon_name: "Lightbulb",
    description: "Stoic meditations, political philosophy, sociology, and critical thinking",
    book_count: 6,
  },
  "history-heritage": {
    icon_name: "Landmark",
    description: "Liberation war history, Bengal heritage, civilizations, and archival records",
    book_count: 11,
  },
  "islamic-theological": {
    icon_name: "Compass",
    description: "Tafsir, Hadith compilations, Islamic economics, and spirituality",
    book_count: 12,
  },
  "business-finance-startups": {
    icon_name: "TrendingUp",
    description: "Economics, investing, entrepreneurship, and Bangladeshi business cases",
    book_count: 5,
  },
};

export const FALLBACK_CATEGORIES_WITH_COUNTS: CategoryWithCount[] =
  FALLBACK_CATEGORIES.map((cat) => {
    const meta = CATEGORY_METADATA[cat.slug] || {
      icon_name: "BookOpen",
      description: "Explore authentic books in this category",
      book_count: 4,
    };
    return {
      ...cat,
      book_count: meta.book_count,
      icon_name: meta.icon_name,
      description: meta.description,
    };
  });

/**
 * Gets all categories with live active book counts.
 */
export async function getAllCategoriesWithCounts(): Promise<CategoryWithCount[]> {
  try {
    const supabase = await createClient();
    const { data: categories, error } = await supabase
      .from("categories")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error || !categories || categories.length === 0) {
      return FALLBACK_CATEGORIES_WITH_COUNTS;
    }

    // Try fetching counts per category
    const { data: books } = await supabase
      .from("books")
      .select("category_id")
      .eq("status", "active");

    const counts: Record<string, number> = {};
    if (books) {
      books.forEach((b) => {
        counts[b.category_id] = (counts[b.category_id] || 0) + 1;
      });
    }

    return categories.map((cat) => {
      const meta = CATEGORY_METADATA[cat.slug];
      const liveCount = counts[cat.id];
      return {
        ...cat,
        book_count:
          liveCount !== undefined && liveCount > 0
            ? liveCount
            : meta?.book_count ?? 0,
        icon_name: meta?.icon_name || "BookOpen",
        description: meta?.description || "Explore books in this category",
      };
    });
  } catch {
    return FALLBACK_CATEGORIES_WITH_COUNTS;
  }
}

/**
 * Gets a specific category by its slug.
 */
export async function getCategoryBySlug(
  slug: string
): Promise<CategoryRow | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (error || !data) {
      return (
        FALLBACK_CATEGORIES.find((cat) => cat.slug === slug) ?? null
      );
    }

    return data as CategoryRow;
  } catch {
    return (
      FALLBACK_CATEGORIES.find((cat) => cat.slug === slug) ?? null
    );
  }
}
