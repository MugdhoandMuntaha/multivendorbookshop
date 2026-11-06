import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/features/auth/forgot-password-form";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Reset your BookMarket account password",
};

export default function ForgotPasswordPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Reset password</h1>
      </div>
      <ForgotPasswordForm />
    </div>
  );
}
