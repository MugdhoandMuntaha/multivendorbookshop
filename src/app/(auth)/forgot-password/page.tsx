import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/features/auth/forgot-password-form";

export const metadata: Metadata = {
  title: "Forgot Password | RTDS Bookshop",
  description: "Reset your RTDS Bookshop account password",
};

export default function ForgotPasswordPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center">
        <h1 className="text-xl font-semibold tracking-tight text-slate-900">Reset password</h1>
      </div>
      <ForgotPasswordForm />
    </div>
  );
}
