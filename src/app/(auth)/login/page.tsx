import { Suspense } from "react";
import type { Metadata } from "next";
import { LoginForm } from "@/components/features/auth/login-form";

export const metadata: Metadata = {
  title: "Sign In | RTDS Bookshop",
  description: "Sign in to your RTDS Bookshop account",
};

export default function LoginPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center">
        <h1 className="text-xl font-semibold tracking-tight text-slate-900">Sign in to your account</h1>
        <p className="text-slate-500 text-xs">
          Enter your email and password to access your account
        </p>
      </div>
      <Suspense
        fallback={
          <div className="text-muted-foreground flex h-48 items-center justify-center text-sm">
            Loading form...
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
