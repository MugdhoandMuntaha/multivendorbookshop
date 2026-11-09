import { createClient } from "@/lib/supabase/server";
import { Database } from "@/types/database";

export type BookRow = Database["public"]["Tables"]["books"]["Row"] & {
  vendors?: {
    shop_name: string;
    slug: string;
    status: string;
  } | null;
  book_images?: {
    r2_key: string;
    position: number;
  }[];
};

// Fallback high-quality catalog data dedicated to RTDS Platform and Bangladeshi book market
export const FALLBACK_BOOKS: BookRow[] = [
  {
    id: "44444444-4444-4444-4444-444444444409",
    vendor_id: "33333333-3333-3333-3333-333333333302",
    title: "RTDS Master Physics: Medical & Engineering Question Bank",
    author: "RTDS Editorial Board",
    isbn: "9789849281144",
    description:
      "Comprehensive question bank with chapter-wise shortcut formulas, past 20 years medical admission solutions, and model test papers.",
    category_id: "22222222-2222-2222-2222-222222222203",
    condition: "new",
    price_minor: 65000, // ৳ 650.00
    currency: "BDT",
    stock: 35,
    status: "active",
    search_tsv: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    vendors: {
      shop_name: "RTDS Publications Central Depot",
      slug: "rtds-publications-depot",
      status: "approved",
    },
    book_images: [{ r2_key: "books/rtds-physics.webp", position: 0 }],
  },
  {
    id: "44444444-4444-4444-4444-444444444410",
    vendor_id: "33333333-3333-3333-3333-333333333302",
    title: "RTDS Medical Master Biology: Final Revision Set",
    author: "Dr. Hasan & RTDS Faculty Team",
    isbn: "9789849281199",
    description:
      "Complete medical biology handbook, high-yield diagrams, and memory mnemonics for medical admission candidates.",
    category_id: "22222222-2222-2222-2222-222222222203",
    condition: "new",
    price_minor: 58000, // ৳ 580.00
    currency: "BDT",
    stock: 50,
    status: "active",
    search_tsv: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    vendors: {
      shop_name: "RTDS Publications Central Depot",
      slug: "rtds-publications-depot",
      status: "approved",
    },
    book_images: [{ r2_key: "books/rtds-biology.webp", position: 0 }],
  },
  {
    id: "44444444-4444-4444-4444-444444444411",
    vendor_id: "33333333-3333-3333-3333-333333333302",
    title: "RTDS Chemistry Formula & Admission Shortcut Handbook",
    author: "Dr. Mahbub & RTDS Team",
    isbn: "9789849281151",
    description:
      "Organic and inorganic reactions, periodic trends, numerical solving shortcuts for Medical, BUET, and University tests.",
    category_id: "22222222-2222-2222-2222-222222222203",
    condition: "new",
    price_minor: 48000, // ৳ 480.00
    currency: "BDT",
    stock: 45,
    status: "active",
    search_tsv: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    vendors: {
      shop_name: "RTDS Publications Central Depot",
      slug: "rtds-publications-depot",
      status: "approved",
    },
    book_images: [{ r2_key: "books/rtds-chemistry.webp", position: 0 }],
  },
  {
    id: "44444444-4444-4444-4444-444444444405",
    vendor_id: "33333333-3333-3333-3333-333333333303",
    title: "Designing Data-Intensive Applications",
    author: "Martin Kleppmann",
    isbn: "9781449373320",
    description:
      "The definitive guide to distributed systems architecture, reliable data storage, and stream processing.",
    category_id: "22222222-2222-2222-2222-222222222207",
    condition: "new",
    price_minor: 85000, // ৳ 850.00
    currency: "BDT",
    stock: 15,
    status: "active",
    search_tsv: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    vendors: {
      shop_name: "Nilkhet Engineering Corner",
      slug: "nilkhet-engineering-corner",
      status: "approved",
    },
    book_images: [{ r2_key: "books/ddia-oreilly.webp", position: 0 }],
  },
  {
    id: "44444444-4444-4444-4444-444444444401",
    vendor_id: "33333333-3333-3333-3333-333333333301",
    title: "Dune (Deluxe Hardcover Collector's Edition)",
    author: "Frank Herbert",
    isbn: "9780441172719",
    description:
      "The seminal science fiction epic with archival cloth binding, gilded edges, and full-color map inserts.",
    category_id: "22222222-2222-2222-2222-222222222202",
    condition: "new",
    price_minor: 125000, // ৳ 1,250.00
    currency: "BDT",
    stock: 8,
    status: "active",
    search_tsv: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    vendors: {
      shop_name: "Banglabazar Boi Bhaban",
      slug: "banglabazar-boi-bhaban",
      status: "approved",
    },
    book_images: [{ r2_key: "books/dune-cover-1.webp", position: 0 }],
  },
  {
    id: "44444444-4444-4444-4444-444444444412",
    vendor_id: "33333333-3333-3333-3333-333333333301",
    title: "লালসালু (Lalsalu - Heritage Hardcover)",
    author: "সৈয়দ ওয়ালীউল্লাহ (Syed Waliullah)",
    isbn: "9789844120341",
    description:
      "বাংলা সাহিত্যের ধ্রুপদী উপন্যাস। নিখুঁত মুদ্রণ ও বাঁধাইকৃত বিশেষ সংস্করণ।",
    category_id: "22222222-2222-2222-2222-222222222201",
    condition: "new",
    price_minor: 26000, // ৳ 260.00
    currency: "BDT",
    stock: 25,
    status: "active",
    search_tsv: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    vendors: {
      shop_name: "Banglabazar Boi Bhaban",
      slug: "banglabazar-boi-bhaban",
      status: "approved",
    },
    book_images: [{ r2_key: "books/lalsalu.webp", position: 0 }],
  },
  {
    id: "44444444-4444-4444-4444-444444444403",
    vendor_id: "33333333-3333-3333-3333-333333333301",
    title: "Meditations (Crimson Clothbound)",
    author: "Marcus Aurelius",
    isbn: "9780140449334",
    description:
      "Stoic philosophy and royal personal reflections translated with critical notes and biographical preface.",
    category_id: "22222222-2222-2222-2222-222222222206",
    condition: "new",
    price_minor: 45000, // ৳ 450.00
    currency: "BDT",
    stock: 12,
    status: "active",
    search_tsv: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    vendors: {
      shop_name: "Banglabazar Boi Bhaban",
      slug: "banglabazar-boi-bhaban",
      status: "approved",
    },
    book_images: [{ r2_key: "books/meditations.webp", position: 0 }],
  },
  {
    id: "44444444-4444-4444-4444-444444444407",
    vendor_id: "33333333-3333-3333-3333-333333333303",
    title: "Structure and Interpretation of Computer Programs (SICP)",
    author: "Harold Abelson, Gerald Jay Sussman",
    isbn: "9780262510875",
    description:
      "MIT Press classic exploring computational models, metacircular evaluators, and functional abstraction.",
    category_id: "22222222-2222-2222-2222-222222222207",
    condition: "good",
    price_minor: 92000, // ৳ 920.00
    currency: "BDT",
    stock: 5,
    status: "active",
    search_tsv: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    vendors: {
      shop_name: "Nilkhet Engineering Corner",
      slug: "nilkhet-engineering-corner",
      status: "approved",
    },
    book_images: [{ r2_key: "books/sicp.webp", position: 0 }],
  },
];

export async function getFeaturedBooks(): Promise<BookRow[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("books")
      .select(
        "*, vendors(shop_name, slug, status), book_images(r2_key, position)"
      )
      .eq("status", "active")
      .limit(8);

    if (error || !data || data.length === 0) {
      return FALLBACK_BOOKS;
    }

    return data as unknown as BookRow[];
  } catch {
    return FALLBACK_BOOKS;
  }
}
