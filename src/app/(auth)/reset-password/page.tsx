import type { Metadata } from "next";
import { ResetPasswordForm } from "@/components/features/auth/reset-password-form";

export const metadata: Metadata = {
  title: "Set New Password",
  description: "Set a new password for your BookMarket account",
};

export default function ResetPasswordPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Set new password</h1>
      </div>
      <ResetPasswordForm />
    </div>
  );
}
