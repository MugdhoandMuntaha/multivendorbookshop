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

// Fallback high-quality catalog data matching Rokomari, Aspect Series & RTDS Live
export const FALLBACK_BOOKS: BookRow[] = [
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
    price_minor: 4500, // $45.00
    currency: "USD",
    stock: 8,
    status: "active",
    search_tsv: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    vendors: {
      shop_name: "The Old Paper Mill",
      slug: "the-old-paper-mill",
      status: "approved",
    },
    book_images: [{ r2_key: "books/dune-cover-1.webp", position: 0 }],
  },
  {
    id: "44444444-4444-4444-4444-444444444405",
    vendor_id: "33333333-3333-3333-3333-333333333302",
    title: "Designing Data-Intensive Applications",
    author: "Martin Kleppmann",
    isbn: "9781449373320",
    description:
      "The definitive guide to distributed systems architecture, reliable data storage, and stream processing.",
    category_id: "22222222-2222-2222-2222-222222222207",
    condition: "new",
    price_minor: 4200,
    currency: "USD",
    stock: 15,
    status: "active",
    search_tsv: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    vendors: {
      shop_name: "Beacon Hill Bookshop",
      slug: "beacon-hill-books",
      status: "approved",
    },
    book_images: [{ r2_key: "books/ddia-oreilly.webp", position: 0 }],
  },
  {
    id: "44444444-4444-4444-4444-444444444409",
    vendor_id: "33333333-3333-3333-3333-333333333302",
    title: "Aspect Physics: Medical & Engineering Question Bank",
    author: "Aspect Editorial Board",
    isbn: "9789849281144",
    description:
      "Comprehensive question bank with chapter-wise shortcut formulas, past 20 years medical admission solutions, and model test papers.",
    category_id: "22222222-2222-2222-2222-222222222203",
    condition: "new",
    price_minor: 3800,
    currency: "USD",
    stock: 25,
    status: "active",
    search_tsv: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    vendors: {
      shop_name: "RTDS & Aspect Official Depot",
      slug: "rtds-aspect-depot",
      status: "approved",
    },
    book_images: [{ r2_key: "books/aspect-physics.webp", position: 0 }],
  },
  {
    id: "44444444-4444-4444-4444-444444444410",
    vendor_id: "33333333-3333-3333-3333-333333333302",
    title: "RTDS Medical Master Biology: Final Revision Set",
    author: "Dr. Hasan & RTDS Team",
    isbn: "9789849281199",
    description:
      "Complete NCERT-based medical biology handbook, high-yield diagrams, and memory mnemonics for admission test candidates.",
    category_id: "22222222-2222-2222-2222-222222222203",
    condition: "new",
    price_minor: 3200,
    currency: "USD",
    stock: 40,
    status: "active",
    search_tsv: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    vendors: {
      shop_name: "RTDS & Aspect Official Depot",
      slug: "rtds-aspect-depot",
      status: "approved",
    },
    book_images: [{ r2_key: "books/rtds-biology.webp", position: 0 }],
  },
  {
    id: "44444444-4444-4444-4444-444444444406",
    vendor_id: "33333333-3333-3333-3333-333333333302",
    title: "Neuromancer (Sprawl Trilogy)",
    author: "William Gibson",
    isbn: "9780441569595",
    description:
      "The Hugo and Nebula award-winning cyberpunk masterwork that defined modern digital culture.",
    category_id: "22222222-2222-2222-2222-222222222202",
    condition: "like_new",
    price_minor: 1600,
    currency: "USD",
    stock: 6,
    status: "active",
    search_tsv: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    vendors: {
      shop_name: "Beacon Hill Bookshop",
      slug: "beacon-hill-books",
      status: "approved",
    },
    book_images: [{ r2_key: "books/neuromancer.webp", position: 0 }],
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
    price_minor: 2400,
    currency: "USD",
    stock: 10,
    status: "active",
    search_tsv: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    vendors: {
      shop_name: "The Old Paper Mill",
      slug: "the-old-paper-mill",
      status: "approved",
    },
    book_images: [{ r2_key: "books/meditations.webp", position: 0 }],
  },
  {
    id: "44444444-4444-4444-4444-444444444408",
    vendor_id: "33333333-3333-3333-3333-333333333302",
    title: "One Hundred Years of Solitude",
    author: "Gabriel García Márquez",
    isbn: "9780060883287",
    description:
      "The monumental Nobel-prize winning epic chronicle of the mythical town of Macondo.",
    category_id: "22222222-2222-2222-2222-222222222201",
    condition: "like_new",
    price_minor: 2100,
    currency: "USD",
    stock: 5,
    status: "active",
    search_tsv: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    vendors: {
      shop_name: "Beacon Hill Bookshop",
      slug: "beacon-hill-books",
      status: "approved",
    },
    book_images: [{ r2_key: "books/marquez.webp", position: 0 }],
  },
  {
    id: "44444444-4444-4444-4444-444444444407",
    vendor_id: "33333333-3333-3333-3333-333333333302",
    title: "Structure and Interpretation of Computer Programs (SICP)",
    author: "Harold Abelson, Gerald Jay Sussman",
    isbn: "9780262510875",
    description:
      "MIT Press textbook exploring computational models, metacircular evaluators, and functional abstraction.",
    category_id: "22222222-2222-2222-2222-222222222207",
    condition: "good",
    price_minor: 5200,
    currency: "USD",
    stock: 3,
    status: "active",
    search_tsv: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    vendors: {
      shop_name: "The Old Paper Mill",
      slug: "the-old-paper-mill",
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
