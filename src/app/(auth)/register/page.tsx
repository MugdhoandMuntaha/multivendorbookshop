import type { Metadata } from "next";
import { RegisterForm } from "@/components/features/auth/register-form";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Join BookMarket as a reader or collector",
};

export default function RegisterPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Create an account</h1>
        <p className="text-muted-foreground text-xs">
          Join thousands of book lovers finding rare and independent books
        </p>
      </div>
      <RegisterForm />
    </div>
  );
}
