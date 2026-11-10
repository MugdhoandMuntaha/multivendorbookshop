"use client";

import { useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Dictionary } from "@/lib/i18n/types";

interface CatalogPaginationProps {
  page: number;
  totalPages: number;
  dict: Dictionary;
}

export function CatalogPagination({
  page,
  totalPages,
  dict,
}: CatalogPaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  if (totalPages <= 1) return null;

  function goToPage(newPage: number) {
    if (newPage < 1 || newPage > totalPages) return;
    const params = new URLSearchParams(searchParams.toString());
    if (newPage === 1) {
      params.delete("page");
    } else {
      params.set("page", newPage.toString());
    }

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }

  // Calculate visible page buttons (e.g., [1, 2, 3, 4, 5])
  const pages: number[] = [];
  const maxButtons = 5;
  let startPage = Math.max(1, page - Math.floor(maxButtons / 2));
  let endPage = startPage + maxButtons - 1;

  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, endPage - maxButtons + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-center gap-1.5 pt-8 pb-4">
      {/* Previous Button */}
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => goToPage(page - 1)}
        className="neo-button-light flex h-9 items-center gap-1 px-3 rounded-xl text-xs font-bold text-slate-700 disabled:opacity-40 disabled:pointer-events-none"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="hidden sm:inline">{dict.catalog.previous}</span>
      </button>

      {/* First Page Link if scrolled far */}
      {startPage > 1 && (
        <>
          <button
            type="button"
            onClick={() => goToPage(1)}
            className="neo-button-light flex h-9 w-9 items-center justify-center rounded-xl text-xs font-bold text-slate-700"
          >
            1
          </button>
          {startPage > 2 && (
            <span className="px-1 text-xs text-slate-400">...</span>
          )}
        </>
      )}

      {/* Middle Page Numbers */}
      {pages.map((p) => {
        const isActive = p === page;
        return (
          <button
            key={p}
            type="button"
            onClick={() => goToPage(p)}
            className={`flex h-9 w-9 items-center justify-center rounded-xl text-xs font-black transition-all ${
              isActive
                ? "neo-button-green"
                : "neo-button-light text-slate-700 hover:text-emerald-700"
            }`}
          >
            {p}
          </button>
        );
      })}

      {/* Last Page Link if distant */}
      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && (
            <span className="px-1 text-xs text-slate-400">...</span>
          )}
          <button
            type="button"
            onClick={() => goToPage(totalPages)}
            className="neo-button-light flex h-9 w-9 items-center justify-center rounded-xl text-xs font-bold text-slate-700"
          >
            {totalPages}
          </button>
        </>
      )}

      {/* Next Button */}
      <button
        type="button"
        disabled={page >= totalPages}
        onClick={() => goToPage(page + 1)}
        className="neo-button-light flex h-9 items-center gap-1 px-3 rounded-xl text-xs font-bold text-slate-700 disabled:opacity-40 disabled:pointer-events-none"
      >
        <span className="hidden sm:inline">{dict.catalog.next}</span>
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
