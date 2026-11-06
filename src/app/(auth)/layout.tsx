import Link from "next/link";
import { BookOpen } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-muted/20 flex min-h-[85vh] flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <Link
            href="/"
            className="text-primary inline-flex items-center gap-2 text-2xl font-bold tracking-tight"
          >
            <BookOpen className="text-primary h-7 w-7" />
            <span>BookMarket</span>
          </Link>
          <p className="text-muted-foreground text-xs">
            The community marketplace for book lovers and independent sellers
          </p>
        </div>

        <div className="bg-card rounded-2xl border p-6 shadow-sm sm:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
