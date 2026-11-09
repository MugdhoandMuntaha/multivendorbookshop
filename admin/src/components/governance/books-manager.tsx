"use client";

import { useState } from "react";
import { BookOpen, CheckCircle, Archive, FileText, Search } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { updateBookStatusAction } from "@/server/actions/moderation";

interface BookItem {
  id: string;
  title: string;
  author: string;
  isbn: string | null;
  price_minor: number;
  stock: number;
  condition: string;
  status: "active" | "draft" | "archived";
  vendor?: { shop_name: string; slug: string } | null;
  category?: { name: string; slug: string } | null;
}

interface BooksManagerProps {
  initialBooks: BookItem[];
}

export function BooksManager({ initialBooks }: BooksManagerProps) {
  const [books, setBooks] = useState<BookItem[]>(initialBooks);
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const filteredBooks = books.filter(
    (b) =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase()) ||
      b.vendor?.shop_name.toLowerCase().includes(search.toLowerCase())
  );

  async function handleStatusChange(
    bookId: string,
    newStatus: "active" | "draft" | "archived"
  ) {
    setUpdatingId(bookId);
    const res = await updateBookStatusAction(bookId, newStatus);
    setUpdatingId(null);

    if (res.success) {
      setBooks((prev) =>
        prev.map((b) => (b.id === bookId ? { ...b, status: newStatus } : b))
      );
    } else {
      alert("Error: " + res.error);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900">
            বই ক্যাটালগ ও লিস্টিং মডারেশন ({filteredBooks.length})
          </h2>
          <p className="text-xs text-slate-500">
            সকল ভেন্ডরের বই লিস্টিং পর্যালোচনা ও স্ট্যাটাস পরিবর্তন করুন
          </p>
        </div>

        <div className="relative w-full max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-emerald-600" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="বই, লেখক বা ভেন্ডর দিয়ে খুঁজুন..."
            className="neo-input-recessed w-full rounded-xl py-2 pl-9 pr-3 text-xs"
          />
        </div>
      </div>

      <div className="neo-card p-6 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-emerald-100 text-slate-500">
            <tr>
              <th className="pb-3 font-semibold">বই ও লেখক</th>
              <th className="pb-3 font-semibold">ভেন্ডর</th>
              <th className="pb-3 font-semibold">ক্যাটাগরি ও অবস্থা</th>
              <th className="pb-3 font-semibold">মূল্য</th>
              <th className="pb-3 font-semibold">স্টক</th>
              <th className="pb-3 font-semibold">স্ট্যাটাস</th>
              <th className="pb-3 font-semibold text-right">মডারেশন</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-emerald-50">
            {filteredBooks.map((book) => (
              <tr key={book.id} className="hover:bg-emerald-50/30">
                <td className="py-3 max-w-[220px]">
                  <div className="font-bold text-slate-900 truncate">
                    {book.title}
                  </div>
                  <div className="text-[11px] text-slate-500">{book.author}</div>
                </td>

                <td className="py-3 font-medium text-emerald-800">
                  {book.vendor?.shop_name || "স্বতন্ত্র ভেন্ডর"}
                </td>

                <td className="py-3">
                  <span className="inline-block rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                    {book.category?.name || "সাধারণ"}
                  </span>
                  <span className="ml-1 text-[10px] text-slate-400 capitalize">
                    ({book.condition})
                  </span>
                </td>

                <td className="py-3 font-bold text-emerald-700">
                  {formatPrice(book.price_minor)}
                </td>

                <td className="py-3 font-semibold text-slate-800">
                  {book.stock} কপি
                </td>

                <td className="py-3">
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      book.status === "active"
                        ? "bg-emerald-100 text-emerald-800"
                        : book.status === "draft"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {book.status === "active"
                      ? "সক্রিয় (Active)"
                      : book.status === "draft"
                        ? "খসড়া (Draft)"
                        : "আর্কাইভ (Archived)"}
                  </span>
                </td>

                <td className="py-3 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    {book.status !== "active" && (
                      <button
                        type="button"
                        disabled={updatingId === book.id}
                        onClick={() => handleStatusChange(book.id, "active")}
                        className="neo-button-green flex h-7 items-center gap-1 rounded-md px-2 text-[11px] font-bold"
                        title="সরাসরি লাইভ করুন"
                      >
                        <CheckCircle className="h-3 w-3" />
                        <span>লাইভ</span>
                      </button>
                    )}

                    {book.status === "active" && (
                      <button
                        type="button"
                        disabled={updatingId === book.id}
                        onClick={() => handleStatusChange(book.id, "draft")}
                        className="neo-button-light flex h-7 items-center gap-1 rounded-md px-2 text-[11px] font-bold text-amber-700"
                        title="ড্রাফট করুন"
                      >
                        <FileText className="h-3 w-3" />
                        <span>ড্রাফট</span>
                      </button>
                    )}

                    {book.status !== "archived" && (
                      <button
                        type="button"
                        disabled={updatingId === book.id}
                        onClick={() => handleStatusChange(book.id, "archived")}
                        className="neo-button-light flex h-7 items-center gap-1 rounded-md px-2 text-[11px] font-bold text-slate-500 hover:text-rose-600"
                        title="আর্কাইভ করুন"
                      >
                        <Archive className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
