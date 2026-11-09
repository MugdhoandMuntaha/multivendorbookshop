"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck, Lock, Mail, AlertCircle, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get("next") || "/";
  const urlError = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(
    urlError === "unauthorized_role"
      ? "আপনার অ্যাকাউন্টটিতে এডমিন অ্যাক্সেস নেই। অনুমোদিত এডমিন অ্যাকাউন্ট দিয়ে প্রবেশ করুন।"
      : null
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      // Verify admin role
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .maybeSingle();

      if (profile?.role !== "admin") {
        await supabase.auth.signOut();
        setError("এই অ্যাকাউন্টে এডমিন অধিকার নেই। শুধুমাত্র মার্কেটপ্লেস এডমিনরা প্রবেশ করতে পারবেন।");
        setLoading(false);
        return;
      }

      router.push(nextUrl);
      router.refresh();
    }
  }

  return (
    <div className="neo-card p-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">
            এডমিন ইমেইল (Email)
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-emerald-600" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@rtds.com.bd"
              className="neo-input-recessed w-full rounded-xl py-2.5 pl-10 pr-3.5 text-xs text-slate-900"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">
            পাসওয়ার্ড (Password)
          </label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-emerald-600" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="neo-input-recessed w-full rounded-xl py-2.5 pl-10 pr-3.5 text-xs text-slate-900"
            />
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="neo-button-green flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold disabled:opacity-50"
          >
            <span>{loading ? "যাচাই করা হচ্ছে..." : "এডমিন প্যানেলে লগইন"}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </form>

      <div className="mt-6 border-t border-emerald-100 pt-4 text-center">
        <span className="text-[11px] text-slate-400">
          সুরক্ষিত সংযোগ | RTDS প্ল্যাটফর্ম অথেন্টিকেশন
        </span>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[oklch(0.985_0.006_155)] px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Banner */}
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-[4px_6px_16px_rgba(5,150,105,0.3)]">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            RTDS Bookshop Admin
          </h1>
          <p className="text-xs text-slate-500">
            সেন্ট্রাল কন্ট্রোল ও কাস্টমাইজার ড্যাশবোর্ডে প্রবেশ করুন
          </p>
        </div>

        {/* Suspense boundary for useSearchParams */}
        <Suspense
          fallback={
            <div className="neo-card p-8 text-center text-xs text-slate-400">
              লোড হচ্ছে...
            </div>
          }
        >
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
