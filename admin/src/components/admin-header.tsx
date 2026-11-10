"use client";

import { LogOut, User, DollarSign, Activity } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface AdminHeaderProps {
  adminEmail?: string;
  adminName?: string;
}

export function AdminHeader({ adminEmail, adminName }: AdminHeaderProps) {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-emerald-100/80 bg-white/90 px-6 shadow-xs backdrop-blur-md">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800">
          <Activity className="h-3.5 w-3.5 text-emerald-600" />
          <span>System Live: Central Database</span>
        </div>
        <span className="rounded-lg border border-emerald-200 bg-white px-2 py-0.5 text-[11px] font-bold text-slate-700">
          BDT (৳)
        </span>
      </div>

      <div className="flex items-center gap-4">
        {/* Admin profile pill */}
        <div className="flex items-center gap-2.5 rounded-xl border border-emerald-100 bg-emerald-50/50 px-3 py-1.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-700 text-xs font-bold text-white">
            <User className="h-3.5 w-3.5" />
          </div>
          <div className="flex flex-col text-left leading-none">
            <span className="text-xs font-bold text-slate-800">
              {adminName || "RTDS Administrator"}
            </span>
            <span className="text-[10px] text-slate-500">
              {adminEmail || "admin@rtds.com.bd"}
            </span>
          </div>
        </div>

        {/* Sign Out Button */}
        <button
          type="button"
          onClick={handleSignOut}
          className="neo-button-light flex h-9 items-center gap-1.5 rounded-xl px-3 text-xs font-bold text-rose-700 hover:text-rose-800"
          title="Sign out of Admin Center"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </div>
    </header>
  );
}
