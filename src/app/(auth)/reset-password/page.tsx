import type { Metadata } from "next";
import { ResetPasswordForm } from "@/components/features/auth/reset-password-form";

export const metadata: Metadata = {
  title: "Set New Password | RTDS Bookshop",
  description: "Set a new password for your RTDS Bookshop account",
};

export default function ResetPasswordPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center">
        <h1 className="text-xl font-semibold tracking-tight text-slate-900">Set new password</h1>
      </div>
      <ResetPasswordForm />
    </div>
  );
}
