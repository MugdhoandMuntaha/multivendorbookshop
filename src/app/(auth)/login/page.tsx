import { Suspense } from "react";
import type { Metadata } from "next";
import { LoginForm } from "@/components/features/auth/login-form";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your BookMarket account",
};

export default function LoginPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
        <p className="text-muted-foreground text-xs">
          Enter your credentials to access your account
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
