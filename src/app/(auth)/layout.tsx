import Link from "next/link";
import { BookOpen } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-slate-50/70 flex min-h-[85vh] flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-1.5 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-2xl font-bold tracking-tight text-slate-900"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-800 text-white">
              <BookOpen className="h-4 w-4" />
            </div>
            <span>RTDS Bookshop</span>
          </Link>
          <p className="text-slate-500 text-xs">
            Verified multivendor book marketplace for readers and publishers
          </p>
        </div>

        <div className="rounded-xl border border-stone-200/80 bg-white p-6 shadow-2xs sm:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
