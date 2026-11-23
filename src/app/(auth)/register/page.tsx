import type { Metadata } from "next";
import { RegisterForm } from "@/components/features/auth/register-form";

export const metadata: Metadata = {
  title: "Create Account | RTDS Bookshop",
  description: "Join RTDS Bookshop as a reader or bookseller",
};

export default function RegisterPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center">
        <h1 className="text-xl font-semibold tracking-tight text-slate-900">Create an account</h1>
        <p className="text-slate-500 text-xs">
          Join passionate readers discovering authentic books nationwide
        </p>
      </div>
      <RegisterForm />
    </div>
  );
}
