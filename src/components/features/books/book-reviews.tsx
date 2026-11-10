import { Star, ShieldCheck, MessageSquare } from "lucide-react";
import { Dictionary } from "@/lib/i18n/types";
import { BookReviewItem } from "@/server/queries/books";

interface BookReviewsProps {
  reviews: BookReviewItem[];
  dict: Dictionary;
}

export function BookReviews({ reviews, dict }: BookReviewsProps) {
  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
        ).toFixed(1)
      : "5.0";

  return (
    <div className="space-y-6">
      {/* Header & Rating Overview */}
      <div className="neo-card p-5 rounded-2xl flex flex-col sm:flex-row items-center gap-6 justify-between">
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center justify-center h-20 w-20 rounded-2xl bg-emerald-50 border border-emerald-200/60 shadow-inner">
            <span className="text-3xl font-black text-emerald-800">
              {averageRating}
            </span>
            <div className="flex items-center text-amber-500 mt-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="h-3 w-3 fill-amber-400 text-amber-400"
                />
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800">
              {dict.bookDetail.customerReviews}
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Based on {reviews.length} {dict.common.reviews}
            </p>
          </div>
        </div>

        {/* Rating Breakdown Bars */}
        <div className="w-full sm:w-64 space-y-1.5 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span className="w-12 text-[11px] font-bold">5 Stars</span>
            <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full w-[92%]" />
            </div>
            <span className="w-8 text-[11px] text-right font-medium">92%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-12 text-[11px] font-bold">4 Stars</span>
            <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full w-[8%]" />
            </div>
            <span className="w-8 text-[11px] text-right font-medium">8%</span>
          </div>
        </div>
      </div>

      {/* Review List */}
      {reviews.length === 0 ? (
        <div className="neo-card p-8 rounded-2xl text-center space-y-2">
          <MessageSquare className="h-8 w-8 text-slate-400 mx-auto" />
          <p className="text-xs font-semibold text-slate-600">
            {dict.bookDetail.noReviewsYet}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="neo-card p-4 rounded-xl border border-emerald-950/5 space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-full bg-emerald-100 flex items-center justify-center text-xs font-black text-emerald-800">
                    {(rev.buyer_name || "R")[0]}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">
                      {rev.buyer_name || "Verified Reader"}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700">
                      <ShieldCheck className="h-3 w-3 text-emerald-600" />
                      {dict.bookDetail.verifiedPurchase}
                    </span>
                  </div>
                </div>

                {/* Star rating */}
                <div className="flex items-center text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 ${
                        i < rev.rating
                          ? "fill-amber-400 text-amber-400"
                          : "text-slate-200"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Review Body */}
              <p className="text-xs text-slate-700 leading-relaxed pt-1">
                {rev.body}
              </p>

              <div className="text-[10px] text-slate-400 pt-1">
                {new Date(rev.created_at).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
